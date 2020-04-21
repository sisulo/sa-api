
CREATE OR REPLACE FUNCTION add_storage_entity(parent integer, childType smallint, status smallint,
                                              created timestamp, childName VARCHAR(100),
                                              param_depth integer) RETURNS integer AS
$$
DECLARE
    child INTEGER;
BEGIN
    child = currval(pg_get_serial_sequence('storage_entities', 'id')) + 1;
    INSERT INTO storage_entities(name, "parentId", id_cat_storage_entity_type, id_cat_storage_entity_status, created_at)
    VALUES (childName, parent, childType, status, created);

    INSERT INTO storage_entities_closure(id_ancestor, id_descendant)
    VALUES(child, child);

    INSERT INTO storage_entities_closure(id_ancestor, id_descendant)
    SELECT p.id_ancestor, c.id_descendant
    FROM storage_entities_closure p,
         storage_entities_closure c
    WHERE p.id_descendant = parent
      AND c.id_ancestor = child;

    RETURN child;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS cat_storage_entity_type
(
    id_cat_storage_entity_type SMALLINT PRIMARY KEY,
    name                       VARCHAR(20)
);

INSERT INTO cat_storage_entity_type (id_cat_storage_entity_type, name)
VALUES (1, 'DATA_CENTER'),
       (2, 'SYSTEMS'),
       (3, 'POOL'),
       (4, 'ADAPTER'),
       (5, 'PORT'),
       (6, 'HOST_GROUP');

CREATE TABLE IF NOT EXISTS storage_entities
(
    id            SERIAL PRIMARY KEY,
    name                         VARCHAR(100),
    serial_number                VARCHAR(30),
    "parentId"                   INTEGER REFERENCES storage_entities (id),
    id_cat_storage_entity_status SMALLINT  DEFAULT (1) REFERENCES cat_component_status (id_cat_component_status) NOT NULL,
    id_cat_storage_entity_type   SMALLINT REFERENCES cat_storage_entity_type (id_cat_storage_entity_type) NOT NULL,
    created_at                   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_entities_closure
(
    id_ancestor                      INTEGER REFERENCES storage_entities (id),
    id_descendant                    INTEGER REFERENCES storage_entities (id),
    PRIMARY KEY(id_ancestor, id_descendant)
);

SELECT setval('storage_entities_id_seq', 1);

ALTER TABLE system_metrics
    DROP CONSTRAINT IF EXISTS system_metrics_id_system_fkey;
ALTER TABLE pool_metrics
    DROP CONSTRAINT IF EXISTS pool_metrics_id_pool_fkey;
ALTER TABLE host_group_metrics
    DROP CONSTRAINT IF EXISTS host_group_metrics_id_host_group_fkey;
ALTER TABLE externals
    DROP CONSTRAINT IF EXISTS externals_id_host_group_fkey;
ALTER TABLE cha_metrics
    DROP CONSTRAINT IF EXISTS cha_metrics_id_cha_fkey;
ALTER TABLE port_metrics
    DROP CONSTRAINT IF EXISTS port_metrics_id_port_fkey;
ALTER TABLE block_size_latency
    DROP CONSTRAINT IF EXISTS block_size_latency_id_pool_fkey;
Do
$$

    DECLARE
        current_id_datacenter INTEGER;
        current_id_system     INTEGER;
        current_id_pool       INTEGER;
        current_id_hg         INTEGER;
        current_id_adapter    INTEGER;
        current_id_port       INTEGER;
        ---- DATACENTER ----
        rec_datacenter        RECORD;
        cur_datacenters CURSOR
            FOR SELECT d.name, d.id_datacenter
                FROM datacenters d;
        ---- SYSTEMS ----
        rec_system            RECORD;
        cur_system CURSOR  (param_id_datacenter INTEGER)
            FOR SELECT s.id_system, s.name, created_at, id_cat_component_status as status
                FROM systems s
                WHERE s.id_datacenter = param_id_datacenter;
        ---- POOLS ----
        rec_pool              RECORD;
        cur_pool CURSOR    (param_id_system INTEGER)
            FOR SELECT p.id_pool, p.name, created_at, id_cat_component_status as status
                FROM pools p
                WHERE p.id_system = param_id_system;
        -- HOST_GROUPS ---
        rec_hg                RECORD;
        cur_hg CURSOR      (param_id_system INTEGER)
            FOR SELECT hg.id_host_group, hg.name, hg.created_at, hg.id_cat_component_status as status
                FROM host_groups hg
                WHERE id_system = param_id_system;
        -- CHA ---
        rec_adapter           RECORD;
        cur_adapter CURSOR (param_id_system INTEGER)
            FOR SELECT chas.id_cha, chas.name, chas.created_at, chas.id_cat_component_status as status
                FROM chas
                WHERE id_system = param_id_system;
        -- PORT ---
        rec_port              RECORD;
        cur_port CURSOR    (param_id_adapter INTEGER)
            FOR SELECT p.id_port, p.name, p.created_at, p.id_cat_component_status as status
                FROM ports p
                WHERE id_cha = param_id_adapter;

    Begin

        OPEN cur_datacenters;
        LOOP
            FETCH cur_datacenters INTO rec_datacenter;
            EXIT WHEN NOT FOUND;

            current_id_datacenter = currval(pg_get_serial_sequence('storage_entities', 'id')) + 1;

            INSERT INTO storage_entities(name, id_cat_storage_entity_type, "parentId")
            VALUES (rec_datacenter.name, 1, null);

            INSERT INTO storage_entities_closure(id_ancestor, id_descendant)
            VALUES(current_id_datacenter, current_id_datacenter);

            OPEN cur_system(rec_datacenter.id_datacenter);

            LOOP
                FETCH cur_system INTO rec_system;
                EXIT WHEN NOT FOUND;

                current_id_system = add_storage_entity(current_id_datacenter, CAST(2 AS SMALLINT), rec_system.status,
                                                       rec_system.created_at, rec_system.name, 2);

                UPDATE system_metrics
                SET id_system = current_id_system
                WHERE id_system = rec_system.id_system;

                OPEN cur_pool(rec_system.id_system);
                LOOP
                    FETCH cur_pool INTO rec_pool;
                    EXIT WHEN NOT FOUND;

                    current_id_pool = add_storage_entity(current_id_system, CAST(3 AS SMALLINT), rec_pool.status,
                                                         rec_pool.created_at, rec_pool.name, 3);
                    UPDATE pool_metrics
                    SET id_pool = current_id_pool
                    WHERE id_pool = rec_pool.id_pool;

                    UPDATE block_size_latency
                    SET id_pool = current_id_pool
                    WHERE id_pool = rec_pool.id_pool;

                end loop;
                CLOSE cur_pool;

                OPEN cur_hg(rec_system.id_system);
                LOOP
                    FETCH cur_hg INTO rec_hg;
                    EXIT WHEN NOT FOUND;

                    current_id_hg = add_storage_entity(current_id_system, CAST(6 AS SMALLINT), rec_hg.status,
                                                       rec_hg.created_at, rec_hg.name, 3);

                    UPDATE host_group_metrics
                    SET id_host_group = current_id_hg
                    WHERE id_host_group = rec_hg.id_host_group;

                    UPDATE externals
                    SET id_host_group = current_id_hg
                    WHERE id_host_group = rec_hg.id_host_group;
                end loop;
                CLOSE cur_hg;

                OPEN cur_adapter(rec_system.id_system);
                LOOP
                    FETCH cur_adapter INTO rec_adapter;
                    EXIT WHEN NOT FOUND;

                    current_id_adapter = add_storage_entity(current_id_system, CAST(4 AS SMALLINT), rec_adapter.status,
                                                            rec_adapter.created_at, rec_adapter.name, 3);

                    UPDATE cha_metrics
                    SET id_cha = current_id_adapter
                    WHERE id_cha = rec_adapter.id_cha;

                    --- PORTS -----
                    OPEN cur_port(rec_adapter.id_cha);
                    LOOP
                        FETCH cur_port INTO rec_port;
                        EXIT WHEN NOT FOUND;

                        current_id_port = add_storage_entity(current_id_adapter, CAST(5 AS SMALLINT), rec_port.status,
                                                             rec_port.created_at, rec_port.name, 4);
                        UPDATE port_metrics
                        SET id_port = current_id_port
                        WHERE id_port = rec_port.id_port;

                    end loop;
                    CLOSE cur_port;

                end loop;
                CLOSE cur_adapter;

            end loop;
            CLOSE cur_system;
        end loop;
        CLOSE cur_datacenters;
    End
$$ LANGUAGE plpgsql;

---------------------------------------------------
--- Rename column and set constraint to storage_entity
---------------------------------------------------
ALTER TABLE system_metrics
    RENAME COLUMN id_system TO id_storage_entity;
ALTER TABLE system_metrics
    ADD CONSTRAINT system_metrics_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);

ALTER TABLE pool_metrics
    RENAME COLUMN id_pool TO id_storage_entity;
ALTER TABLE pool_metrics
    ADD CONSTRAINT pool_metrics_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);

ALTER TABLE host_group_metrics
    RENAME COLUMN id_host_group TO id_storage_entity;
ALTER TABLE host_group_metrics
    ADD CONSTRAINT host_group_metrics_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);

ALTER TABLE externals
    RENAME COLUMN id_host_group TO id_storage_entity;
ALTER TABLE externals
    ADD CONSTRAINT externals_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);

ALTER TABLE cha_metrics
    RENAME COLUMN id_cha TO id_storage_entity;
ALTER TABLE cha_metrics
    ADD CONSTRAINT cha_metrics_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);
ALTER TABLE port_metrics
    RENAME COLUMN id_port TO id_storage_entity;
ALTER TABLE port_metrics
    ADD CONSTRAINT port_metrics_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);

ALTER TABLE block_size_latency
    RENAME COLUMN id_pool TO id_storage_entity;
ALTER TABLE block_size_latency
    ADD CONSTRAINT block_size_latency_id_storage_entity_fkey FOREIGN KEY (id_storage_entity) REFERENCES storage_entities (id);


DROP VIEW view_host_group_metrics;
DROP VIEW view_cha_metrics;
DROP VIEW view_pool_metrics;
DROP VIEW view_port_metrics;
DROP VIEW view_system_metrics;
--DROP VIEW view_weighted_average_capacity;

DROP TABLE ports;
DROP TABLE chas;
DROP TABLE host_groups;
DROP TABLE pools;
DROP TABLE systems;
DROP TABLE datacenters;
--SELECT *
--FROM storage_entities;
--
--SELECT *
--FROM storage_entities_closure

-- select *
-- from pg_stat_activity
-- where (state = 'idle in transaction')
--   and xact_start is not null;

--TRUNCATE storage_entities;

-- SELECT currval()

--SELECT * FROM storage_entities_closure WHERE id_descendant = 227

drop view IF EXISTS view_pool_metrics;
create view view_pool_metrics as
SELECT
 outer_sm.id_metric as id,
 outer_sm.id_cat_metric_type,
 outer_sm.value,
 outer_sm.id_storage_entity,
 outer_sm.date,
 outer_sm.created_at
FROM storage_entities datacenters
JOIN storage_entities systems on systems."parentId" = datacenters.id AND systems.id_cat_storage_entity_type = 2
JOIN storage_entities pools on pools."parentId" = systems.id AND pools.id_cat_storage_entity_type = 3
LEFT JOIN pool_metrics outer_sm on outer_sm.id_storage_entity = pools.id and outer_sm.id_metric = (
	SELECT inner_sm.id_metric
	FROM pool_metrics as inner_sm
	WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
		AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
	ORDER BY date DESC
	LIMIT 1
)
WHERE "datacenters".id_cat_storage_entity_type = 1;

drop view IF EXISTS view_system_metrics;
create view view_system_metrics as
select
     outer_sm.id_metric AS id,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.peak,
     outer_sm.id_storage_entity,
     outer_sm.date,
     outer_sm.created_at
from storage_entities datacenters
join storage_entities systems on systems."parentId" = datacenters.id AND systems.id_cat_storage_entity_type = 2
left join system_metrics outer_sm on outer_sm.id_storage_entity = systems.id and outer_sm.id_metric = (
	select inner_sm.id_metric
	from system_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type and outer_sm.id_storage_entity = inner_sm.id_storage_entity
	order by date desc
	LIMIT 1
)
WHERE datacenters.id_cat_storage_entity_type = 1

CREATE VIEW view_port_metrics as
SELECT
   outer_sm.id_metric AS id,
   outer_sm.id_cat_metric_type,
   outer_sm.value,
   outer_sm.id_storage_entity,
   outer_sm.date,
   outer_sm.created_at
FROM
   storage_entities datacenters
   JOIN
      storage_entities systems
      ON systems."parentId" = datacenters.id AND systems.id_cat_storage_entity_type = 2
   JOIN
      storage_entities chas
      ON systems.id = chas."parentId" AND chas.id_cat_storage_entity_type = 4
   JOIN
      storage_entities ports
      ON chas.id = ports."parentId" AND ports.id_cat_storage_entity_type = 5
   LEFT JOIN
      port_metrics outer_sm
      ON outer_sm.id_storage_entity = ports.id
      AND outer_sm.id_metric IN
      (
         SELECT
            inner_sm.id_metric
         FROM
            port_metrics as inner_sm
         WHERE
            outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
            and outer_sm.id_storage_entity = inner_sm.id_storage_entity
         ORDER BY
            date DESC LIMIT 1
      )
	  WHERE datacenters.id_cat_storage_entity_type = 1
;

drop view IF EXISTS view_cha_metrics;
create view view_cha_metrics as
select
   outer_sm.id_metric AS id,
   outer_sm.id_cat_metric_type,
   outer_sm.value,
   outer_sm.id_storage_entity,
   outer_sm.date,
   outer_sm.created_at
from
   storage_entities datacenters
   join
      storage_entities systems
      on systems."parentId" = datacenters.id AND systems.id_cat_storage_entity_type = 2
   join
      storage_entities chas
      on systems.id = chas."parentId" AND chas.id_cat_storage_entity_type = 4
   left join
      cha_metrics outer_sm ON
      outer_sm.id_storage_entity = chas.id
      and outer_sm.id_metric in
      (
         select
            inner_sm.id_metric
         from
            cha_metrics as inner_sm
         where
            outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
            and outer_sm.id_storage_entity = inner_sm.id_storage_entity
         order by
            inner_sm.date desc limit 1
      )
	  WHERE datacenters.id_cat_storage_entity_type = 1
;