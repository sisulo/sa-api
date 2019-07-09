INSERT INTO pools (id_pool, "name", id_system)
VALUES(67, 'Pool#5 AFA-T2', 13);

INSERT INTO pools (id_pool, "name", id_system)
VALUES(68, 'Pool#8 AFA-T1', 13);

INSERT INTO cat_metric_type (id_cat_metric_type, name, unit)
VALUES(35, 'DISBALANCE_PERC', '%'),
(36, 'DISBALANCE_ABSOLUT', NULL);


-- DELETE FROM pool_metrics WHERE id_cat_metric_type = 13
-- INSERT INTO pool_metrics (id_cat_metric_type, id_pool, id_system, value, date)
-- SELECT 14, pools.id_pool, pools.id_system, RANDOM(), '2019-06-18'
-- FROM pools
--
-- SELECT * FROM cat_metric_type
