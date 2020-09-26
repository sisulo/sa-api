CREATE TABLE IF NOT EXISTS cat_component_status
(
    id_cat_component_status SMALLINT    NOT NULL
        CONSTRAINT cat_component_status_pkey
            PRIMARY KEY,
    name                    VARCHAR(15) NOT NULL
);
CREATE TABLE IF NOT EXISTS cat_external_type
(
    id_cat_external_type SERIAL NOT NULL
        CONSTRAINT cat_external_type_pkey
            PRIMARY KEY,
    name                 VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS cat_metric_group
(
    id_cat_metric_group SERIAL      NOT NULL
        CONSTRAINT cat_metric_group_pkey
            PRIMARY KEY,
    name                VARCHAR(30) NOT NULL
);
CREATE TABLE IF NOT EXISTS cat_metric_type
(
    id_cat_metric_type  SMALLSERIAL NOT NULL
        CONSTRAINT cat_metric_type_pkey
            PRIMARY KEY,
    name                VARCHAR(30) NOT NULL,
    unit                VARCHAR(10),
    id_cat_metric_group INTEGER     NOT NULL
        CONSTRAINT cat_metric_type_id_cat_metric_group_fkey
            REFERENCES cat_metric_group
);
CREATE TABLE IF NOT EXISTS cat_operation
(
    id_cat_operation SERIAL NOT NULL
        CONSTRAINT cat_operation_pkey
            PRIMARY KEY,
    name             VARCHAR(10)
);
CREATE TABLE IF NOT EXISTS metric_thresholds
(
    id_metric_threshold SERIAL NOT NULL
        CONSTRAINT metric_thresholds_pkey
            PRIMARY KEY,
    id_cat_metric_type  SMALLINT
        CONSTRAINT metric_thresholds_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    min_value           DOUBLE PRECISION,
    max_value           DOUBLE PRECISION
);
CREATE TABLE IF NOT EXISTS migration_schema
(
    id        SERIAL  NOT NULL
        CONSTRAINT "PK_bb30f6fc0e64e58714313844dc3"
            PRIMARY KEY,
    timestamp BIGINT  NOT NULL,
    name      VARCHAR NOT NULL
);
CREATE TABLE IF NOT EXISTS cat_storage_entity_type
(
    id_cat_storage_entity_type SMALLINT NOT NULL
        CONSTRAINT cat_storage_entity_type_pkey
            PRIMARY KEY,
    name                       VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS storage_entities
(
    id                           SERIAL              NOT NULL
        CONSTRAINT storage_entities_pkey
            PRIMARY KEY,
    name                         VARCHAR(100),
    serial_number                VARCHAR(30),
    "parentId"                   INTEGER
        CONSTRAINT "storage_entities_parentId_fkey"
            REFERENCES storage_entities,
    id_cat_storage_entity_status SMALLINT  DEFAULT 1 NOT NULL
        CONSTRAINT storage_entities_id_cat_storage_entity_status_fkey
            REFERENCES cat_component_status,
    id_cat_storage_entity_type   SMALLINT            NOT NULL
        CONSTRAINT storage_entities_id_cat_storage_entity_type_fkey
            REFERENCES cat_storage_entity_type,
    created_at                   TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS block_size_latency
(
    id_metric          SERIAL           NOT NULL
        CONSTRAINT block_size_latency_pkey
            PRIMARY KEY,
    id_cat_metric_type INTEGER          NOT NULL
        CONSTRAINT block_size_latency_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    id_storage_entity  INTEGER          NOT NULL
        CONSTRAINT block_size_latency_id_storage_entity_fkey
            REFERENCES storage_entities,
    id_cat_operation   INTEGER          NOT NULL
        CONSTRAINT block_size_latency_id_cat_operation_fkey
            REFERENCES cat_operation,
    block_size         DOUBLE PRECISION NOT NULL,
    latency            DOUBLE PRECISION NOT NULL,
    value              INTEGER          NOT NULL,
    date               DATE             NOT NULL,
    created_at         TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cha_metrics
(
    id_metric          SERIAL   NOT NULL
        CONSTRAINT cha_metrics_pkey
            PRIMARY KEY,
    id_cat_metric_type SMALLINT NOT NULL
        CONSTRAINT cha_metrics_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    id_storage_entity  INTEGER  NOT NULL
        CONSTRAINT cha_metrics_id_storage_entity_fkey
            REFERENCES storage_entities,
    value              DOUBLE PRECISION,
    date               DATE     NOT NULL,
    created_at         TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cha_metrics_date
    ON cha_metrics (id_storage_entity ASC, id_cat_metric_type ASC, date DESC);

CREATE INDEX IF NOT EXISTS idx_cha_metrics_id_cha_metric_type
    ON cha_metrics (id_storage_entity, id_cat_metric_type, id_metric);

CREATE TABLE IF NOT EXISTS externals
(
    id_external          SERIAL NOT NULL
        CONSTRAINT externals_pkey
            PRIMARY KEY,
    id_cat_external_type INTEGER
        CONSTRAINT externals_id_cat_external_type_fkey
            REFERENCES cat_external_type,
    value                VARCHAR(50),
    id_storage_entity    INTEGER
        CONSTRAINT externals_id_storage_entity_fkey
            REFERENCES storage_entities
);
CREATE TABLE IF NOT EXISTS host_group_metrics
(
    id_metric          SERIAL   NOT NULL
        CONSTRAINT host_group_metrics_pkey
            PRIMARY KEY,
    id_cat_metric_type SMALLINT NOT NULL
        CONSTRAINT host_group_metrics_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    id_storage_entity  INTEGER  NOT NULL
        CONSTRAINT host_group_metrics_id_storage_entity_fkey
            REFERENCES storage_entities,
    value              DOUBLE PRECISION,
    date               DATE     NOT NULL,
    created_at         TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_host_group_metrics_date
    ON host_group_metrics (id_storage_entity ASC, id_cat_metric_type ASC, date DESC);

CREATE INDEX IF NOT EXISTS idx_host_group_metrics_id_cha_metric_type
    ON host_group_metrics (id_storage_entity, id_cat_metric_type, id_metric);

CREATE TABLE IF NOT EXISTS pool_metrics
(
    id_metric          SERIAL   NOT NULL
        CONSTRAINT pool_metrics_pkey
            PRIMARY KEY,
    id_cat_metric_type SMALLINT NOT NULL
        CONSTRAINT pool_metrics_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    id_storage_entity  INTEGER  NOT NULL
        CONSTRAINT pool_metrics_id_storage_entity_fkey
            REFERENCES storage_entities,
    value              DOUBLE PRECISION,
    date               DATE     NOT NULL,
    created_at         TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pool_metrics_date
    ON pool_metrics (id_storage_entity ASC, id_cat_metric_type ASC, date DESC);

CREATE INDEX IF NOT EXISTS idx_pool_metrics_id_pool_metric_type
    ON pool_metrics (id_storage_entity, id_cat_metric_type, id_metric);

CREATE TABLE IF NOT EXISTS port_metrics
(
    id_metric          SERIAL   NOT NULL
        CONSTRAINT port_metrics_pkey
            PRIMARY KEY,
    id_cat_metric_type SMALLINT NOT NULL
        CONSTRAINT port_metrics_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    id_storage_entity  INTEGER  NOT NULL
        CONSTRAINT port_metrics_id_storage_entity_fkey
            REFERENCES storage_entities,
    value              DOUBLE PRECISION,
    date               DATE     NOT NULL,
    created_at         TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_port_metrics_date
    ON port_metrics (id_storage_entity ASC, id_cat_metric_type ASC, date DESC);

CREATE INDEX IF NOT EXISTS idx_port_metrics_id_metric_type
    ON port_metrics (id_storage_entity, id_cat_metric_type, id_metric);

CREATE TABLE IF NOT EXISTS system_metrics
(
    id_metric          SERIAL   NOT NULL
        CONSTRAINT system_metrics_pkey
            PRIMARY KEY,
    id_cat_metric_type SMALLINT NOT NULL
        CONSTRAINT system_metrics_id_cat_metric_type_fkey
            REFERENCES cat_metric_type,
    value              DOUBLE PRECISION,
    peak               DOUBLE PRECISION,
    id_storage_entity  INTEGER  NOT NULL
        CONSTRAINT system_metrics_id_storage_entity_fkey
            REFERENCES storage_entities,
    date               DATE     NOT NULL,
    created_at         TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_system_metrics_date
    ON system_metrics (id_storage_entity ASC, id_cat_metric_type ASC, date DESC);

CREATE INDEX IF NOT EXISTS idx_system_metrics_id_cat_metric_type
    ON system_metrics (id_storage_entity, id_cat_metric_type, id_metric);

CREATE TABLE IF NOT EXISTS storage_entities_closure
(
    id_ancestor   INTEGER NOT NULL
        CONSTRAINT storage_entities_closure_id_ancestor_fkey
            REFERENCES storage_entities,
    id_descendant INTEGER NOT NULL
        CONSTRAINT storage_entities_closure_id_descendant_fkey
            REFERENCES storage_entities,
    CONSTRAINT storage_entities_closure_pkey
        PRIMARY KEY (id_ancestor, id_descendant)
);
CREATE TABLE IF NOT EXISTS system_details
(
    id_storage_entity   INTEGER NOT NULL
        CONSTRAINT system_details_pkey
            PRIMARY KEY
        CONSTRAINT system_details_id_storage_entity_fkey
            REFERENCES storage_entities,
    model               VARCHAR(15),
    prefix_reference_id VARCHAR(10),
    dkc                 VARCHAR(30),
    management_ip       VARCHAR(20),
    rack                VARCHAR(10),
    room                VARCHAR(10)
);
CREATE UNIQUE INDEX IF NOT EXISTS ix_id_storage_entity
    ON system_details (id_storage_entity);

CREATE MATERIALIZED VIEW IF NOT EXISTS view_cha_metrics AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities chas
         LEFT JOIN cha_metrics outer_sm
                   ON outer_sm.id_storage_entity = chas.id AND outer_sm.id_metric = ((SELECT inner_sm.id_metric
                                                                                      FROM cha_metrics inner_sm
                                                                                      WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                        AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                        AND inner_sm.value IS NOT NULL
                                                                                      ORDER BY inner_sm.date DESC
                                                                                      LIMIT 1))
WHERE chas.id_cat_storage_entity_type = 4;

CREATE MATERIALIZED VIEW IF NOT EXISTS view_port_metrics AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities ports
         LEFT JOIN port_metrics outer_sm
                   ON outer_sm.id_storage_entity = ports.id AND outer_sm.id_metric = ((SELECT inner_sm.id_metric
                                                                                       FROM port_metrics inner_sm
                                                                                       WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                         AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                         AND inner_sm.value IS NOT NULL
                                                                                       ORDER BY inner_sm.date DESC
                                                                                       LIMIT 1))
WHERE ports.id_cat_storage_entity_type = 5;

CREATE MATERIALIZED VIEW IF NOT EXISTS view_host_group_metrics AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities host_groups
         LEFT JOIN host_group_metrics outer_sm
                   ON outer_sm.id_storage_entity = host_groups.id AND outer_sm.id_metric = ((SELECT inner_sm.id_metric
                                                                                             FROM host_group_metrics inner_sm
                                                                                             WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                               AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                               AND inner_sm.value IS NOT NULL
                                                                                             ORDER BY inner_sm.date DESC
                                                                                             LIMIT 1))
WHERE host_groups.id_cat_storage_entity_type = 6;

CREATE MATERIALIZED VIEW IF NOT EXISTS view_pool_metrics AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities pools
         LEFT JOIN pool_metrics outer_sm
                   ON outer_sm.id_storage_entity = pools.id AND outer_sm.id_metric = ((SELECT inner_sm.id_metric
                                                                                       FROM pool_metrics inner_sm
                                                                                       WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                         AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                         AND inner_sm.value IS NOT NULL
                                                                                       ORDER BY inner_sm.date DESC
                                                                                       LIMIT 1))
WHERE pools.id_cat_storage_entity_type = 3;

CREATE MATERIALIZED VIEW IF NOT EXISTS view_system_metrics AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.peak,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities systems
         LEFT JOIN system_metrics outer_sm
                   ON outer_sm.id_storage_entity = systems.id AND outer_sm.id_metric = ((SELECT inner_sm.id_metric
                                                                                         FROM system_metrics inner_sm
                                                                                         WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                           AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                           AND inner_sm.value IS NOT NULL
                                                                                         ORDER BY inner_sm.date DESC
                                                                                         LIMIT 1))
WHERE systems.id_cat_storage_entity_type = 2;

CREATE TABLE parity_group_metrics (
    id_metric SERIAL,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type),
    value DOUBLE PRECISION,
    peak DOUBLE PRECISION,
    id_storage_entity INTEGER REFERENCES storage_entities (id),
    start_time TIMESTAMP,
    end_time TIMESTAMP
);
