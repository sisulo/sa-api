UPDATE cat_metric_type
SET name = CONCAT(name, '_PERC')
WHERE cat_metric_type.id_cat_metric_type IN (2, 4, 5, 11, 12);

UPDATE cat_metric_type
SET name = CONCAT(name, '_PERC'), unit = '%'
WHERE cat_metric_type.id_cat_metric_type IN (10);

INSERT INTO cat_metric_type (id_cat_metric_type, name, unit)
VALUES
(20, 'CHANGE_DAY', 'GB'),
(21, 'CHANGE_WEEK', 'GB'),
(22, 'CHANGE_MONTH', 'GB'),
(23, 'PHYSICAL_USED', 'TB'),
(24, 'PHYSICAL_FREE', 'TB'),
(25, 'LOGICAL_CAPACITY', 'TB'),
(26, 'LOGICAL_USED', 'TB'),
(27, 'LOGICAL_FREE', 'TB'),
(28, 'LOGICAL_USED_PERC', '%'),
(29, 'NET_TOTAL', 'TB'),
(30, 'NET_USED', 'TB'),
(31, 'NET_FREE', 'TB'),
(32, 'PHY_USED_BEF_SAVING', 'GB'),
(33, 'DEDUP_RATIO', NULL),
(34, 'TOTAL_SAVING_EFFECT', NULL);

DELETE FROM cat_metric_type WHERE id_cat_metric_type = 19
