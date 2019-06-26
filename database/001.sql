UPDATE cat_metric_type
SET name = CONCAT(name, '_PERC')
WHERE cat_metric_type.id_cat_metric_type IN (2, 4, 5, 11, 12)

INSERT INTO cat_metric_type (id_cat_metric_type, name, unit)
VALUES
(20, 'CHANGE_DAY', NULL),
(21, 'CHANGE_WEEK', NULL),
(22, 'CHANGE_MONTH', NULL),
(23, 'PHYSICAL_USED', NULL),
(24, 'PHYSICAL_FREE', NULL),
(25, 'LOGICAL_CAPACITY', NULL),
(26, 'LOGICAL_USED', NULL),
(27, 'LOGICAL_FREE', NULL),
(28, 'LOGICAL_USED_PERC', '%'),
(29, 'NET_TOTAL', NULL),
(30, 'NET_USED', NULL),
(31, 'NET_FREE', NULL),
(32, 'PHY_USED_BEF_SAVING', NULL),
(33, 'DEDUP_RATIO', NULL),
(34, 'TOTAL_SAVING_EFFECT', NULL);
