INSERT INTO public.cat_component_status (id_cat_component_status, name) VALUES (2, 'INACTIVE');
INSERT INTO public.cat_component_status (id_cat_component_status, name) VALUES (1, 'ACTIVE');

INSERT INTO public.cat_external_type (id_cat_external_type, name) VALUES (1, 'TIER');

INSERT INTO public.cat_metric_group (id_cat_metric_group, name) VALUES (1, 'PERFORMANCE');
INSERT INTO public.cat_metric_group (id_cat_metric_group, name) VALUES (2, 'CAPACITY');
INSERT INTO public.cat_metric_group (id_cat_metric_group, name) VALUES (3, 'ADAPTERS');
INSERT INTO public.cat_metric_group (id_cat_metric_group, name) VALUES (4, 'SLA');

INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (7, 'WORKLOAD', 'IOPS', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (8, 'RESPONSE', 'ms', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (1, 'PHYSICAL_CAPACITY', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (3, 'AVAILABLE_CAPACITY', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (6, 'COMPRESSION_RATIO', null, 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (16, 'PREDICTION_L1', 'days', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (17, 'PREDICTION_L2', 'days', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (18, 'PREDICTION_L3', 'days', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (20, 'CHANGE_DAY', 'GB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (21, 'CHANGE_WEEK', 'GB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (22, 'CHANGE_MONTH', 'GB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (23, 'PHYSICAL_USED', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (24, 'PHYSICAL_FREE', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (25, 'LOGICAL_CAPACITY', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (26, 'LOGICAL_USED', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (27, 'LOGICAL_FREE', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (29, 'NET_TOTAL', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (30, 'NET_USED', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (31, 'NET_FREE', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (32, 'PHY_USED_BEF_SAVING', 'GB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (33, 'DEDUP_RATIO', null, 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (34, 'TOTAL_SAVING_EFFECT', null, 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (13, 'SLA_EVENTS', null, 4);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (14, 'OUT_OF_SLA_TIME', 's', 4);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (10, 'HDD_PERC', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (11, 'CPU_PERC', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (12, 'WRITE_PENDING_PERC', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (2, 'PHYSICAL_SUBS_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (4, 'LOGICAL_USED_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (5, 'PHYSICAL_USED_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (37, 'SUBSCRIBED_CAPACITY', 'TB', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (38, 'LOGICAL_SUBS_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (39, 'NET_SUBS_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (40, 'NET_USED_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (9, 'TRANSFER', 'MBps', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (41, 'WORKLOAD_MONTH', 'IOPS', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (42, 'RESPONSE_MONTH', 'ms', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (43, 'TRANSFER_MONTH', 'MBps', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (44, 'HDD_PERC_MONTH', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (45, 'CPU_PERC_MONTH', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (46, 'WRITE_PENDING_PERC_MONTH', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (50, 'SLA_EVENTS_MONTH', null, 4);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (51, 'OUT_OF_SLA_TIME_MONTH', 's', 4);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (52, 'WORKLOAD_WEEK', 'IOPS', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (53, 'RESPONSE_WEEK', 'ms', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (54, 'TRANSFER_WEEK', 'MBps', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (55, 'HDD_PERC_WEEK', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (56, 'CPU_PERC_WEEK', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (57, 'WRITE_PENDING_PERC_WEEK', '%', 1);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (61, 'SLA_EVENTS_WEEK', null, 4);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (62, 'OUT_OF_SLA_TIME_WEEK', 's', 4);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (15, 'IMBALANCE_EVENTS', null, 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (35, 'IMBALANCE_PERC', '%', 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (47, 'IMBALANCE_EVENTS_MONTH', null, 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (48, 'IMBALANCE_PERC_MONTH', '%', 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (58, 'IMBALANCE_EVENTS_WEEK', null, 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (59, 'IMBALANCE_PERC_WEEK', '%', 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (36, 'IMBALANCE_ABSOLUT', 'MBps', 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (49, 'IMBALANCE_ABSOLUT_MONTH', 'MBps', 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (60, 'IMBALANCE_ABSOLUT_WEEK', 'MBps', 3);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (63, 'PORT_IMBALANCE_EVENTS', null, 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (64, 'PORT_IMBALANCE_PERC', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (65, 'PORT_IMBALANCE_ABSOLUT', 'MBps', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (66, 'PORT_IMBALANCE_EVENTS_WEEK', null, 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (67, 'PORT_IMBALANCE_PERC_WEEK', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (68, 'PORT_IMBALANCE_ABSOLUT_WEEK', 'MBps', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (69, 'PORT_IMBALANCE_EVENTS_MONTH', null, 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (70, 'PORT_IMBALANCE_PERC_MONTH', '%', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (71, 'PORT_IMBALANCE_ABSOLUT_MONTH', 'MBps', 2);
INSERT INTO public.cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group) VALUES (72, 'LATENCY_PER_BLOCK_SIZE', null, 2);

INSERT INTO public.cat_operation (id_cat_operation, name) VALUES (1, 'READ');
INSERT INTO public.cat_operation (id_cat_operation, name) VALUES (2, 'WRITE');

INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (1, 'DATA_CENTER');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (2, 'SYSTEMS');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (3, 'POOL');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (4, 'ADAPTER');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (5, 'PORT');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (6, 'HOST_GROUP');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (7, 'PARITY_GROUP');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (8, 'PORT');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (9, 'CHANNEL_BOARD');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (10, 'DKC');
INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (11, 'CONTROLLER');
