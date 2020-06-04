CREATE MATERIALIZED VIEW view_cha_metrics AS
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

CREATE MATERIALIZED VIEW view_port_metrics AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities ports
         LEFT JOIN port_metrics outer_sm
                   ON outer_sm.id_storage_entity = ports.id AND (outer_sm.id_metric = (SELECT inner_sm.id_metric
                                                                                        FROM port_metrics inner_sm
                                                                                        WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                          AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                          AND inner_sm.value IS NOT NULL
                                                                                        ORDER BY inner_sm.date DESC
                                                                                        LIMIT 1))
WHERE ports.id_cat_storage_entity_type = 5;

CREATE MATERIALIZED VIEW view_host_group_metrics(id, id_cat_metric_type, value, id_storage_entity, date, created_at) AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities host_groups
         LEFT JOIN host_group_metrics outer_sm
                   ON outer_sm.id_storage_entity = host_groups.id AND outer_sm.id_metric = (SELECT inner_sm.id_metric
                                                                                             FROM host_group_metrics inner_sm
                                                                                             WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                               AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                               AND inner_sm.value IS NOT NULL
                                                                                             ORDER BY inner_sm.date DESC
                                                                                             LIMIT 1)
WHERE host_groups.id_cat_storage_entity_type = 6;

CREATE MATERIALIZED VIEW view_pool_metrics(id, id_cat_metric_type, value, id_storage_entity, date, created_at) AS
SELECT outer_sm.id_metric AS id,
       outer_sm.id_cat_metric_type,
       outer_sm.value,
       outer_sm.id_storage_entity,
       outer_sm.date,
       outer_sm.created_at
FROM storage_entities pools
         LEFT JOIN pool_metrics outer_sm
                   ON outer_sm.id_storage_entity = pools.id AND outer_sm.id_metric = (SELECT inner_sm.id_metric
                                                                                      FROM pool_metrics inner_sm
                                                                                      WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                                                                                        AND outer_sm.id_storage_entity = inner_sm.id_storage_entity
                                                                                        AND inner_sm.value IS NOT NULL
                                                                                      ORDER BY inner_sm.date DESC
                                                                                      LIMIT 1)
WHERE pools.id_cat_storage_entity_type = 3;

CREATE MATERIALIZED VIEW view_system_metrics (id, id_cat_metric_type, value, peak, id_storage_entity, date, created_at) AS
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
