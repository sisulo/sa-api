ALTER TABLE systems
    ALTER COLUMN name SET NOT NULL;
ALTER TABLE systems
    ALTER COLUMN id_datacenter SET NOT NULL;
ALTER TABLE cat_metric_type
    ALTER COLUMN name SET NOT NULL;
ALTER TABLE system_metrics
    ALTER COLUMN id_system SET NOT NULL;
ALTER TABLE system_metrics
    ALTER COLUMN date SET NOT NULL;
ALTER TABLE system_metrics
    ALTER COLUMN id_cat_metric_type SET NOT NULL;
ALTER TABLE pools
    ALTER COLUMN id_system SET NOT NULL;
ALTER TABLE pools
    ALTER COLUMN name SET NOT NULL;
ALTER TABLE pool_metrics
    ALTER COLUMN id_pool SET NOT NULL;
ALTER TABLE pool_metrics
    ALTER COLUMN id_system SET NOT NULL;
ALTER TABLE pool_metrics
    ALTER COLUMN date SET NOT NULL;
ALTER TABLE pool_metrics
    ALTER COLUMN id_cat_metric_type SET NOT NULL;
ALTER TABLE chas
    ALTER COLUMN id_system SET NOT NULL;
ALTER TABLE chas
    ALTER COLUMN name SET NOT NULL;
ALTER TABLE cha_metrics
    ALTER COLUMN id_cat_metric_type SET NOT NULL;
ALTER TABLE cha_metrics
    ALTER COLUMN id_cha SET NOT NULL;
ALTER TABLE cha_metrics
    ALTER COLUMN id_system SET NOT NULL;
ALTER TABLE cha_metrics
    ALTER COLUMN date SET NOT NULL;


CREATE TABLE cat_metric_group
(
    id_cat_metric_group SERIAL PRIMARY KEY,
    name                VARCHAR(30) NOT NULL
);

INSERT INTO cat_metric_group (id_cat_metric_group, name)
VALUES (1, 'PERFORMANCE'),
       (2, 'CAPACITY'),
       (3, 'ADAPTERS'),
       (4, 'SLA');

ALTER TABLE cat_metric_type
    ADD COLUMN id_cat_metric_group INTEGER REFERENCES cat_metric_group (id_cat_metric_group);
UPDATE cat_metric_type
SET id_cat_metric_group = 1
WHERE id_cat_metric_type IN (
                             7, 8, 11, 10, 12, 9
    );

UPDATE cat_metric_type
SET id_cat_metric_group = 2
WHERE id_cat_metric_type IN (1, 2, 3, 4, 5, 6, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34);
UPDATE cat_metric_type
SET id_cat_metric_group = 3
WHERE id_cat_metric_type IN (15, 35, 36);
UPDATE cat_metric_type
SET id_cat_metric_group = 4
WHERE id_cat_metric_type IN (13, 14);
DELETE
FROM cat_metric_type
WHERE id_cat_metric_type IN (28, 19);
ALTER TABLE cat_metric_type
    ALTER COLUMN id_cat_metric_group SET NOT NULL;

UPDATE cat_metric_type
SET unit = NULL
WHERE unit = '';
