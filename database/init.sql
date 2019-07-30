CREATE TABLE datacenters
(
    id_datacenter SMALLSERIAL PRIMARY KEY,
    name          varchar(50),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE systems
(
    id_system     SERIAL PRIMARY KEY,
    name          varchar(100)                                    NOT NULL,
    id_datacenter SMALLINT REFERENCES datacenters (id_datacenter) NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cat_metric_type
(
    id_cat_metric_type SMALLSERIAL PRIMARY KEY,
    name               VARCHAR(30) NOT NULL,
    unit               VARCHAR(10)
);

CREATE TABLE system_metrics
(
    id_system_metric   SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    value              FLOAT,
    peak               FLOAT,
    id_system          INTEGER REFERENCES systems (id_system)                   NOT NULL,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pools
(
    id_pool    SERIAL PRIMARY KEY,
    name       text                                   NOT NULL,
    id_system  INTEGER REFERENCES systems (id_system) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pool_metrics
(
    id_pool_metric     SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    id_pool            INTEGER REFERENCES pools (id_pool)                       NOT NULL,
    id_system          INTEGER REFERENCES systems (id_system)                   NOT NULL,
    value              FLOAT,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chas
(
    id_cha     SERIAL PRIMARY KEY,
    name       TEXT                                   NOT NULL,
    id_system  INTEGER REFERENCES systems (id_system) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE cha_metrics
(
    id_cha_metric      SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    id_cha             INTEGER REFERENCES chas (id_cha)                         NOT NULL,
    id_system          INTEGER REFERENCES systems (id_system)                   NOT NULL,
    value              FLOAT,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);

INSERT INTO cat_metric_type
VALUES (1, 'PHYSICAL_CAPACITY', 'TB'),
       (2, 'PHYSICAL_SUBS_PERC', '%'),
       (3, 'AVAILABLE_CAPACITY', 'TB'),
       (4, 'LOGICAL_USED_PERC', '%'),
       (5, 'PHYSICAL_USED_PERC', '%'),
       (6, 'COMPRESSION_RATIO', NULL),
       (7, 'WORKLOAD', 'IOPS'),
       (8, 'RESPONSE', 'ms'),
       (9, 'TRANSFER', 'Mbps'),
       (10, 'HDD_PERC', '%'),
       (11, 'CPU_PERC', '%'),
       (12, 'WRITE_PENDING_PERC', '%'),
       (13, 'SLA_EVENTS', NULL),
       (14, 'OUT_OF_SLA_TIME', 's'),
       (15, 'DISBALANCE_EVENTS', NULL),
       (16, 'PREDICTION_L1', 'days'),
       (17, 'PREDICTION_L2', 'days'),
       (18, 'PREDICTION_L3', 'days'),
       (19, 'INFO', NULL),
       (20, 'CHANGE_DAY', 'GB'),
       (21, 'CHANGE_WEEK', 'GB'),
       (22, 'CHANGE_MONTH', 'GB'),
       (23, 'PHYSICAL_USED', 'TB'),
       (24, 'PHYSICAL_FREE', 'TB'),
       (25, 'LOGICAL_CAPACITY', 'TB'),
       (26, 'LOGICAL_USED', 'TB'),
       (27, 'LOGICAL_FREE', 'TB'),
       (29, 'NET_TOTAL', 'TB'),
       (30, 'NET_USED', 'TB'),
       (31, 'NET_FREE', 'TB'),
       (32, 'PHY_USED_BEF_SAVING', 'GB'),
       (33, 'DEDUP_RATIO', NULL),
       (34, 'TOTAL_SAVING_EFFECT', NULL),
       (35, 'DISBALANCE_PERC', '%'),
       (36, 'DISBALANCE_ABSOLUT', NULL);

INSERT INTO datacenters (id_datacenter, name)
VALUES (1, 'CZ_Chodov'),
       (2, 'CZ_Sitel'),
       (3, 'MY_Cyberjaja'),
       (4, 'MY_AIMS'),
       (5, 'US_Ashburn'),
       (6, 'US_Mechanigsburg');

INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('1', 'XP7_G11_58417', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('2', 'XP7_G12_58416', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('3', 'XP7_G13_58734', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('4', 'XP7_G14_10560', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('5', 'XP7_G15_20028', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('6', 'XP7_G16_20359', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('7', 'XP7_B11_50225', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('8', 'XP7_B12_58678', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('9', 'XP7_B13_59006', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('10', 'XP7_B14_10554', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('11', 'XP7_B15_10640', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('12', 'XP7_B16_11114', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('13', 'XP7_STL1_58634', '2');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('14', 'XP7_STL2_10558', '2');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('15', 'XP7_CBJ2_57216', '3');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('16', 'XP7_CBJ3_57222', '3');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('17', 'XP7_CBJ4_20575', '3');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('18', 'XP7_CBJ5_56053', '3');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('19', 'XP7_AIMS1_20627', '4');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('20', 'XP7_QAS1_20610', '5');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('21', 'XP7_QAS2_56139', '5');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('22', 'XP7_MEG1_10239', '6');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('23', 'XP7_MEG2_20725', '6');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('24', 'XP7_B17_50225', '1');
INSERT INTO public.systems(id_system, name, id_datacenter)
VALUES ('25', 'XP7_STL3_58634', '2');

INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('1', 'Pool#1 15k-T1', '1');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('2', 'Pool#2 SmT-T1', '1');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('3', 'Pool#3 FMD-T0', '1');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('4', 'Pool#4 OPM-T1', '1');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('5', 'Pool#1 15k-T1', '2');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('6', 'Pool#2 SmT-T1', '2');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('7', 'Pool#3 FMD-T0', '2');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('8', 'Pool#4 10k-T2', '2');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('9', 'Pool#6 AFA-T1', '2');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('10', 'Pool#1 AFA-T0', '3');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('11', 'Pool#2 ST-T1', '3');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('12', 'Pool#5 ST-T1', '3');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('13', 'Pool#6 AFA-T1', '3');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('14', 'Pool#0 AFA-T2', '4');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('15', 'Pool#1 AFA-T2', '4');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('16', 'Pool#0 AFA-T2', '5');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('17', 'Pool#1 AFA-T2', '5');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('18', 'Pool#1 AFA-T1', '6');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('19', 'Pool#2 AFA-T1', '6');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('20', 'Pool#1 15k-T1', '7');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('21', 'Pool#2 SmT-T1', '7');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('22', 'Pool#3 FMD-T0', '7');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('23', 'Pool#6 AFA-T1', '7');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('24', 'Pool#7 AFA-T1', '7');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('25', 'Pool#1 15k-T1', '8');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('26', 'Pool#3 AFA-T0', '8');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('27', 'Pool#4 SHP-T0', '8');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('28', 'Pool#1 AFA-T1', '9');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('29', 'Pool#2 AFA-T2', '9');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('30', 'Pool#3 AFA-T0', '9');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('31', 'Pool#1 AFA-T1', '10');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('32', 'Pool#2 AFA-T1', '10');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('33', 'Pool#3 AFA-T0', '10');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('34', 'Pool#1 AFA-T1', '11');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('35', 'Pool#2 AFA-T1', '11');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('36', 'Pool#2 AFA-T1', '11');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('37', 'Pool#1 AFA-T2', '12');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('38', 'Pool#1 15k-T1', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('39', 'Pool#2 10k-T2', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('40', 'Pool#3 SmT-T1', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('41', 'Pool#4 SHP-T0', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('42', 'Pool#5 SHT-T0', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('43', 'Pool#6 AFA-T0', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('44', 'Pool#7 AFA-T1', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('45', 'Pool#1 AFA-T1', '14');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('46', 'Pool#2 AFA-T1', '14');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('47', 'Pool#3 AFA-T0', '14');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('48', 'Pool#4 AFA-T2', '14');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('49', 'Pool#1 AFA-T1', '15');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('50', 'Pool#2 AFA-T1', '15');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('51', 'Pool#1 AFA-T1', '16');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('52', 'Pool#2 AFA-T1', '16');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('53', 'Pool#1 AFA-T1', '17');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('54', 'Pool#3 AFA-T0', '17');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('55', 'Pool#6 AFA-T1', '18');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('56', 'Pool#7 AFA-T1', '18');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('57', 'Pool#1 AFA-T1', '19');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('58', 'Pool#2 AFA-T2', '19');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('59', 'Pool#1 AFA-T1', '20');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('60', 'Pool#2 AFA-T1', '20');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('61', 'Pool#3 AFA-T0', '20');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('62', 'Pool#6 AFA-T2', '21');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('63', 'Pool#7 AFA-T2', '21');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('64', 'Pool#1 15k-T1', '22');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('65', 'Pool#2 10k-T2', '22');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('66', 'Pool#1 AFA-T2', '23');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('67', 'Pool#5 AFA-T2', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('68', 'Pool#8 AFA-T1', '13');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('69', 'Pool_6_AFA_T1', '24');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('70', 'Pool_7_AFA_T1', '24');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('71', 'Pool#4 SHP_T0', '25');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('72', 'Pool#5 AFA_T2', '25');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('73', 'Pool#6 AFA_T0', '25');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('74', 'Pool#7 AFA_T1', '25');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('75', 'Pool#8 AFA_T1', '25');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('76', 'Pool#2 AFA_T1', '23');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('77', 'Pool#2 AFA_T1', '12');
INSERT INTO public.pools(id_pool, name, id_system)
VALUES ('78', 'Pool_8_EXT_T2', '21');


INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('1', 'CHA-1PC,CHA-2PC', '1');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('2', 'CHA-1PD,CHA-2PD', '1');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('3', 'CHA-1PE,CHA-2PE', '1');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('4', 'CHA-1PJ,CHA-2PJ', '1');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('5', 'CHA-1PK,CHA-2PK', '1');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('6', 'CHA-1PL,CHA-2PL', '1');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('7', 'CHA-1PC,CHA-2PC', '2');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('8', 'CHA-1PD,CHA-2PD', '2');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('9', 'CHA-1PE,CHA-2PE', '2');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('10', 'CHA-1PJ,CHA-2PJ', '2');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('11', 'CHA-1PK,CHA-2PK', '2');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('12', 'CHA-1PL,CHA-2PL', '2');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('13', 'CHA-1PC,CHA-2PC', '3');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('14', 'CHA-1PD,CHA-2PD', '3');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('15', 'CHA-1PE,CHA-2PE', '3');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('16', 'CHA-1PJ,CHA-2PJ', '3');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('17', 'CHA-1PK,CHA-2PK', '3');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('18', 'CHA-1PL,CHA-2PL', '3');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('19', 'CHA-1PC,CHA-2PC', '4');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('20', 'CHA-1PD,CHA-2PD', '4');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('21', 'CHA-1PJ,CHA-2PJ', '4');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('22', 'CHA-1PC,CHA-2PC', '5');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('23', 'CHA-1PD,CHA-2PD', '5');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('24', 'CHA-1PJ,CHA-2PJ', '5');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('25', 'CHA-1PC,CHA-2PC', '6');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('26', 'CHA-1PD,CHA-2PD', '6');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('27', 'CHA-1PE,CHA-2PE', '6');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('28', 'CHA-1PJ,CHA-2PJ', '6');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('29', 'CHA-1PK,CHA-2PK', '6');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('30', 'CHA-1PC,CHA-2PC', '7');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('31', 'CHA-1PD,CHA-2PD', '7');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('32', 'CHA-1PE,CHA-2PE', '7');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('33', 'CHA-1PJ,CHA-2PJ', '7');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('34', 'CHA-1PK,CHA-2PK', '7');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('35', 'CHA-1PL,CHA-2PL', '7');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('36', 'CHA-1PC,CHA-2PC', '8');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('37', 'CHA-1PD,CHA-2PD', '8');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('38', 'CHA-1PE,CHA-2PE', '8');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('39', 'CHA-1PJ,CHA-2PJ', '8');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('40', 'CHA-1PK,CHA-2PK', '8');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('41', 'CHA-1PC,CHA-2PC', '9');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('42', 'CHA-1PD,CHA-2PD', '9');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('43', 'CHA-1PJ,CHA-2PJ', '9');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('44', 'CHA-1PC,CHA-2PC', '10');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('45', 'CHA-1PD,CHA-2PD', '10');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('46', 'CHA-1PE,CHA-2PE', '10');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('47', 'CHA-1PJ,CHA-2PJ', '10');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('48', 'CHA-1PK,CHA-2PK', '10');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('49', 'CHA-1PC,CHA-2PC', '11');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('50', 'CHA-1PD,CHA-2PD', '11');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('51', 'CHA-1PJ,CHA-2PJ', '11');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('52', 'CHA-1PK,CHA-2PK', '11');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('53', 'CHA-1PC,CHA-2PC', '12');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('54', 'CHA-1PD,CHA-2PD', '12');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('55', 'CHA-1PJ,CHA-2PJ', '12');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('56', 'CHA-1PC,CHA-2PC', '13');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('57', 'CHA-1PD,CHA-2PD', '13');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('58', 'CHA-1PE,CHA-2PE', '13');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('59', 'CHA-1PJ,CHA-2PJ', '13');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('60', 'CHA-1PK,CHA-2PK', '13');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('61', 'CHA-1PL,CHA-2PL', '13');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('62', 'CHA-1PC,CHA-2PC', '14');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('63', 'CHA-1PD,CHA-2PD', '14');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('64', 'CHA-1PJ,CHA-2PJ', '14');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('65', 'CHA-1PK,CHA-2PK', '14');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('66', 'CHA-1PC,CHA-2PC', '15');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('67', 'CHA-1PD,CHA-2PD', '15');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('68', 'CHA-1PJ,CHA-2PJ', '15');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('69', 'CHA-1PK,CHA-2PK', '15');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('70', 'CHA-1PC,CHA-2PC', '16');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('71', 'CHA-1PD,CHA-2PD', '16');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('72', 'CHA-1PE,CHA-2PE', '16');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('73', 'CHA-1PJ,CHA-2PJ', '16');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('74', 'CHA-1PK,CHA-2PK', '16');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('75', 'CHA-1PC,CHA-2PC', '17');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('76', 'CHA-1PD,CHA-2PD', '17');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('77', 'CHA-1PJ,CHA-2PJ', '17');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('78', 'CHA-1PK,CHA-2PK', '17');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('79', 'CHA-1PC,CHA-2PC', '18');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('80', 'CHA-1PD,CHA-2PD', '18');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('81', 'CHA-1PE,CHA-2PE', '18');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('82', 'CHA-1PF,CHA-2PF', '18');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('83', 'CHA-1PJ,CHA-2PJ', '18');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('84', 'CHA-1PK,CHA-2PK', '18');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('85', 'CHA-1PC,CHA-2PC', '19');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('86', 'CHA-1PJ,CHA-2PJ', '19');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('87', 'CHA-1PC,CHA-2PC', '20');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('88', 'CHA-1PD,CHA-2PD', '20');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('89', 'CHA-1PJ,CHA-2PJ', '20');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('90', 'CHA-1PK,CHA-2PK', '20');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('91', 'CHA-1PC,CHA-2PC', '21');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('92', 'CHA-1PD,CHA-2PD', '21');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('93', 'CHA-1PE,CHA-2PE', '21');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('94', 'CHA-1PJ,CHA-2PJ', '21');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('95', 'CHA-1PK,CHA-2PK', '21');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('96', 'CHA-1PC,CHA-2PC', '22');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('97', 'CHA-1PD,CHA-2PD', '22');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('98', 'CHA-1PC,CHA-2PC', '23');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('99', 'CHA-1PD,CHA-2PD', '23');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('100', 'CHA-1PJ,CHA-2PJ', '23');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('101', 'CHA-1PK,CHA-2PK', '23');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('102', 'CHA-1PC,CHA-2PC', '24');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('103', 'CHA-1PD,CHA-2PD', '24');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('104', 'CHA-1PE,CHA-2PE', '24');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('105', 'CHA-1PJ,CHA-2PJ', '24');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('106', 'CHA-1PK,CHA-2PK', '24');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('107', 'CHA-1PL,CHA-2PL', '24');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('108', 'CHA-1PC,CHA-2PC', '25');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('109', 'CHA-1PD,CHA-2PD', '25');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('110', 'CHA-1PE,CHA-2PE', '25');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('111', 'CHA-1PJ,CHA-2PJ', '25');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('112', 'CHA-1PK,CHA-2PK', '25');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('113', 'CHA-1PL,CHA-2PL', '25');
INSERT INTO public.chas(id_cha, name, id_system)
VALUES ('114', 'CHA-1PK,CHA-2PK', '5');
