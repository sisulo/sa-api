create TABLE datacenters
(
    id_datacenter SMALLSERIAL PRIMARY KEY,
    name          varchar(50),
    created_at    TIMESTAMP DEFAULT NOW()
);

create TABLE systems
(
    id_system     SERIAL PRIMARY KEY,
    name          varchar(100)                                    NOT NULL,
    id_datacenter SMALLINT REFERENCES datacenters (id_datacenter) NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

create TABLE cat_metric_type
(
    id_cat_metric_type SMALLSERIAL PRIMARY KEY,
    name               VARCHAR(30) NOT NULL,
    unit               VARCHAR(10)
);

create TABLE system_metrics
(
    id_system_metric   SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    value              FLOAT,
    peak               FLOAT,
    id_system          INTEGER REFERENCES systems (id_system)                   NOT NULL,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);

create TABLE pools
(
    id_pool    SERIAL PRIMARY KEY,
    name       text                                   NOT NULL,
    id_system  INTEGER REFERENCES systems (id_system) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

create TABLE pool_metrics
(
    id_pool_metric     SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    id_pool            INTEGER REFERENCES pools (id_pool)                       NOT NULL,
    value              FLOAT,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);

create TABLE chas
(
    id_cha     SERIAL PRIMARY KEY,
    name       TEXT                                   NOT NULL,
    id_system  INTEGER REFERENCES systems (id_system) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


create TABLE cha_metrics
(
    id_cha_metric      SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    id_cha             INTEGER REFERENCES chas (id_cha)                         NOT NULL,
    value              FLOAT,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);

insert into cat_metric_type
values (1, 'PHYSICAL_CAPACITY', 'TB'),
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

insert into datacenters (id_datacenter, name)
values (1, 'CZ_Chodov'),
       (2, 'CZ_Sitel'),
       (3, 'MY_Cyberjaja'),
       (4, 'MY_AIMS'),
       (5, 'US_Ashburn'),
       (6, 'US_Mechanigsburg');

insert into public.systems(id_system, name, id_datacenter)
VALUES ('1', 'XP7_G11_58417', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('2', 'XP7_G12_58416', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('3', 'XP7_G13_58734', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('4', 'XP7_G14_10560', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('5', 'XP7_G15_20028', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('6', 'XP7_G16_20359', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('7', 'XP7_B11_50225', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('8', 'XP7_B12_58678', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('9', 'XP7_B13_59006', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('10', 'XP7_B14_10554', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('11', 'XP7_B15_10640', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('12', 'XP7_B16_11114', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('13', 'XP7_STL1_58634', '2');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('14', 'XP7_STL2_10558', '2');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('15', 'XP7_CBJ2_57216', '3');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('16', 'XP7_CBJ3_57222', '3');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('17', 'XP7_CBJ4_20575', '3');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('18', 'XP7_CBJ5_56053', '3');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('19', 'XP7_AIMS1_20627', '4');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('20', 'XP7_QAS1_20610', '5');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('21', 'XP7_QAS2_56139', '5');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('22', 'XP7_MEG1_10239', '6');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('23', 'XP7_MEG2_20725', '6');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('24', 'XP7_B17_50225', '1');
insert into public.systems(id_system, name, id_datacenter)
VALUES ('25', 'XP7_STL3_58634', '2');

insert into public.pools(id_pool, name, id_system)
VALUES ('1', 'Pool#1 15k-T1', '1');
insert into public.pools(id_pool, name, id_system)
VALUES ('2', 'Pool#2 SmT-T1', '1');
insert into public.pools(id_pool, name, id_system)
VALUES ('3', 'Pool#3 FMD-T0', '1');
insert into public.pools(id_pool, name, id_system)
VALUES ('4', 'Pool#4 OPM-T1', '1');
insert into public.pools(id_pool, name, id_system)
VALUES ('5', 'Pool#1 15k-T1', '2');
insert into public.pools(id_pool, name, id_system)
VALUES ('6', 'Pool#2 SmT-T1', '2');
insert into public.pools(id_pool, name, id_system)
VALUES ('7', 'Pool#3 FMD-T0', '2');
insert into public.pools(id_pool, name, id_system)
VALUES ('8', 'Pool#4 10k-T2', '2');
insert into public.pools(id_pool, name, id_system)
VALUES ('9', 'Pool#6 AFA-T1', '2');
insert into public.pools(id_pool, name, id_system)
VALUES ('10', 'Pool#1 AFA-T0', '3');
insert into public.pools(id_pool, name, id_system)
VALUES ('11', 'Pool#2 ST-T1', '3');
insert into public.pools(id_pool, name, id_system)
VALUES ('12', 'Pool#5 ST-T1', '3');
insert into public.pools(id_pool, name, id_system)
VALUES ('13', 'Pool#6 AFA-T1', '3');
insert into public.pools(id_pool, name, id_system)
VALUES ('14', 'Pool#0 AFA-T2', '4');
insert into public.pools(id_pool, name, id_system)
VALUES ('15', 'Pool#1 AFA-T2', '4');
insert into public.pools(id_pool, name, id_system)
VALUES ('16', 'Pool#0 AFA-T2', '5');
insert into public.pools(id_pool, name, id_system)
VALUES ('17', 'Pool#1 AFA-T2', '5');
insert into public.pools(id_pool, name, id_system)
VALUES ('18', 'Pool#1 AFA-T1', '6');
insert into public.pools(id_pool, name, id_system)
VALUES ('19', 'Pool#2 AFA-T1', '6');
insert into public.pools(id_pool, name, id_system)
VALUES ('20', 'Pool#1 15k-T1', '7');
insert into public.pools(id_pool, name, id_system)
VALUES ('21', 'Pool#2 SmT-T1', '7');
insert into public.pools(id_pool, name, id_system)
VALUES ('22', 'Pool#3 FMD-T0', '7');
insert into public.pools(id_pool, name, id_system)
VALUES ('23', 'Pool#6 AFA-T1', '7');
insert into public.pools(id_pool, name, id_system)
VALUES ('24', 'Pool#7 AFA-T1', '7');
insert into public.pools(id_pool, name, id_system)
VALUES ('25', 'Pool#1 15k-T1', '8');
insert into public.pools(id_pool, name, id_system)
VALUES ('26', 'Pool#3 AFA-T0', '8');
insert into public.pools(id_pool, name, id_system)
VALUES ('27', 'Pool#4 SHP-T0', '8');
insert into public.pools(id_pool, name, id_system)
VALUES ('28', 'Pool#1 AFA-T1', '9');
insert into public.pools(id_pool, name, id_system)
VALUES ('29', 'Pool#2 AFA-T2', '9');
insert into public.pools(id_pool, name, id_system)
VALUES ('30', 'Pool#3 AFA-T0', '9');
insert into public.pools(id_pool, name, id_system)
VALUES ('31', 'Pool#1 AFA-T1', '10');
insert into public.pools(id_pool, name, id_system)
VALUES ('32', 'Pool#2 AFA-T1', '10');
insert into public.pools(id_pool, name, id_system)
VALUES ('33', 'Pool#3 AFA-T0', '10');
insert into public.pools(id_pool, name, id_system)
VALUES ('34', 'Pool#1 AFA-T1', '11');
insert into public.pools(id_pool, name, id_system)
VALUES ('35', 'Pool#2 AFA-T1', '11');
insert into public.pools(id_pool, name, id_system)
VALUES ('36', 'Pool#2 AFA-T1', '11');
insert into public.pools(id_pool, name, id_system)
VALUES ('37', 'Pool#1 AFA-T2', '12');
insert into public.pools(id_pool, name, id_system)
VALUES ('38', 'Pool#1 15k-T1', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('39', 'Pool#2 10k-T2', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('40', 'Pool#3 SmT-T1', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('41', 'Pool#4 SHP-T0', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('42', 'Pool#5 SHT-T0', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('43', 'Pool#6 AFA-T0', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('44', 'Pool#7 AFA-T1', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('45', 'Pool#1 AFA-T1', '14');
insert into public.pools(id_pool, name, id_system)
VALUES ('46', 'Pool#2 AFA-T1', '14');
insert into public.pools(id_pool, name, id_system)
VALUES ('47', 'Pool#3 AFA-T0', '14');
insert into public.pools(id_pool, name, id_system)
VALUES ('48', 'Pool#4 AFA-T2', '14');
insert into public.pools(id_pool, name, id_system)
VALUES ('49', 'Pool#1 AFA-T1', '15');
insert into public.pools(id_pool, name, id_system)
VALUES ('50', 'Pool#2 AFA-T1', '15');
insert into public.pools(id_pool, name, id_system)
VALUES ('51', 'Pool#1 AFA-T1', '16');
insert into public.pools(id_pool, name, id_system)
VALUES ('52', 'Pool#2 AFA-T1', '16');
insert into public.pools(id_pool, name, id_system)
VALUES ('53', 'Pool#1 AFA-T1', '17');
insert into public.pools(id_pool, name, id_system)
VALUES ('54', 'Pool#3 AFA-T0', '17');
insert into public.pools(id_pool, name, id_system)
VALUES ('55', 'Pool#6 AFA-T1', '18');
insert into public.pools(id_pool, name, id_system)
VALUES ('56', 'Pool#7 AFA-T1', '18');
insert into public.pools(id_pool, name, id_system)
VALUES ('57', 'Pool#1 AFA-T1', '19');
insert into public.pools(id_pool, name, id_system)
VALUES ('58', 'Pool#2 AFA-T2', '19');
insert into public.pools(id_pool, name, id_system)
VALUES ('59', 'Pool#1 AFA-T1', '20');
insert into public.pools(id_pool, name, id_system)
VALUES ('60', 'Pool#2 AFA-T1', '20');
insert into public.pools(id_pool, name, id_system)
VALUES ('61', 'Pool#3 AFA-T0', '20');
insert into public.pools(id_pool, name, id_system)
VALUES ('62', 'Pool#6 AFA-T2', '21');
insert into public.pools(id_pool, name, id_system)
VALUES ('63', 'Pool#7 AFA-T2', '21');
insert into public.pools(id_pool, name, id_system)
VALUES ('64', 'Pool#1 15k-T1', '22');
insert into public.pools(id_pool, name, id_system)
VALUES ('65', 'Pool#2 10k-T2', '22');
insert into public.pools(id_pool, name, id_system)
VALUES ('66', 'Pool#1 AFA-T2', '23');
insert into public.pools(id_pool, name, id_system)
VALUES ('67', 'Pool#5 AFA-T2', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('68', 'Pool#8 AFA-T1', '13');
insert into public.pools(id_pool, name, id_system)
VALUES ('69', 'Pool_6_AFA_T1', '24');
insert into public.pools(id_pool, name, id_system)
VALUES ('70', 'Pool_7_AFA_T1', '24');
insert into public.pools(id_pool, name, id_system)
VALUES ('71', 'Pool#4 SHP_T0', '25');
insert into public.pools(id_pool, name, id_system)
VALUES ('72', 'Pool#5 AFA_T2', '25');
insert into public.pools(id_pool, name, id_system)
VALUES ('73', 'Pool#6 AFA_T0', '25');
insert into public.pools(id_pool, name, id_system)
VALUES ('74', 'Pool#7 AFA_T1', '25');
insert into public.pools(id_pool, name, id_system)
VALUES ('75', 'Pool#8 AFA_T1', '25');
insert into public.pools(id_pool, name, id_system)
VALUES ('76', 'Pool#2 AFA_T1', '23');
insert into public.pools(id_pool, name, id_system)
VALUES ('77', 'Pool#2 AFA_T1', '12');
insert into public.pools(id_pool, name, id_system)
VALUES ('78', 'Pool_8_EXT_T2', '21');


insert into public.chas(id_cha, name, id_system)
VALUES ('1', 'CHA-1PC,CHA-2PC', '1');
insert into public.chas(id_cha, name, id_system)
VALUES ('2', 'CHA-1PD,CHA-2PD', '1');
insert into public.chas(id_cha, name, id_system)
VALUES ('3', 'CHA-1PE,CHA-2PE', '1');
insert into public.chas(id_cha, name, id_system)
VALUES ('4', 'CHA-1PJ,CHA-2PJ', '1');
insert into public.chas(id_cha, name, id_system)
VALUES ('5', 'CHA-1PK,CHA-2PK', '1');
insert into public.chas(id_cha, name, id_system)
VALUES ('6', 'CHA-1PL,CHA-2PL', '1');
insert into public.chas(id_cha, name, id_system)
VALUES ('7', 'CHA-1PC,CHA-2PC', '2');
insert into public.chas(id_cha, name, id_system)
VALUES ('8', 'CHA-1PD,CHA-2PD', '2');
insert into public.chas(id_cha, name, id_system)
VALUES ('9', 'CHA-1PE,CHA-2PE', '2');
insert into public.chas(id_cha, name, id_system)
VALUES ('10', 'CHA-1PJ,CHA-2PJ', '2');
insert into public.chas(id_cha, name, id_system)
VALUES ('11', 'CHA-1PK,CHA-2PK', '2');
insert into public.chas(id_cha, name, id_system)
VALUES ('12', 'CHA-1PL,CHA-2PL', '2');
insert into public.chas(id_cha, name, id_system)
VALUES ('13', 'CHA-1PC,CHA-2PC', '3');
insert into public.chas(id_cha, name, id_system)
VALUES ('14', 'CHA-1PD,CHA-2PD', '3');
insert into public.chas(id_cha, name, id_system)
VALUES ('15', 'CHA-1PE,CHA-2PE', '3');
insert into public.chas(id_cha, name, id_system)
VALUES ('16', 'CHA-1PJ,CHA-2PJ', '3');
insert into public.chas(id_cha, name, id_system)
VALUES ('17', 'CHA-1PK,CHA-2PK', '3');
insert into public.chas(id_cha, name, id_system)
VALUES ('18', 'CHA-1PL,CHA-2PL', '3');
insert into public.chas(id_cha, name, id_system)
VALUES ('19', 'CHA-1PC,CHA-2PC', '4');
insert into public.chas(id_cha, name, id_system)
VALUES ('20', 'CHA-1PD,CHA-2PD', '4');
insert into public.chas(id_cha, name, id_system)
VALUES ('21', 'CHA-1PJ,CHA-2PJ', '4');
insert into public.chas(id_cha, name, id_system)
VALUES ('22', 'CHA-1PC,CHA-2PC', '5');
insert into public.chas(id_cha, name, id_system)
VALUES ('23', 'CHA-1PD,CHA-2PD', '5');
insert into public.chas(id_cha, name, id_system)
VALUES ('24', 'CHA-1PJ,CHA-2PJ', '5');
insert into public.chas(id_cha, name, id_system)
VALUES ('25', 'CHA-1PC,CHA-2PC', '6');
insert into public.chas(id_cha, name, id_system)
VALUES ('26', 'CHA-1PD,CHA-2PD', '6');
insert into public.chas(id_cha, name, id_system)
VALUES ('27', 'CHA-1PE,CHA-2PE', '6');
insert into public.chas(id_cha, name, id_system)
VALUES ('28', 'CHA-1PJ,CHA-2PJ', '6');
insert into public.chas(id_cha, name, id_system)
VALUES ('29', 'CHA-1PK,CHA-2PK', '6');
insert into public.chas(id_cha, name, id_system)
VALUES ('30', 'CHA-1PC,CHA-2PC', '7');
insert into public.chas(id_cha, name, id_system)
VALUES ('31', 'CHA-1PD,CHA-2PD', '7');
insert into public.chas(id_cha, name, id_system)
VALUES ('32', 'CHA-1PE,CHA-2PE', '7');
insert into public.chas(id_cha, name, id_system)
VALUES ('33', 'CHA-1PJ,CHA-2PJ', '7');
insert into public.chas(id_cha, name, id_system)
VALUES ('34', 'CHA-1PK,CHA-2PK', '7');
insert into public.chas(id_cha, name, id_system)
VALUES ('35', 'CHA-1PL,CHA-2PL', '7');
insert into public.chas(id_cha, name, id_system)
VALUES ('36', 'CHA-1PC,CHA-2PC', '8');
insert into public.chas(id_cha, name, id_system)
VALUES ('37', 'CHA-1PD,CHA-2PD', '8');
insert into public.chas(id_cha, name, id_system)
VALUES ('38', 'CHA-1PE,CHA-2PE', '8');
insert into public.chas(id_cha, name, id_system)
VALUES ('39', 'CHA-1PJ,CHA-2PJ', '8');
insert into public.chas(id_cha, name, id_system)
VALUES ('40', 'CHA-1PK,CHA-2PK', '8');
insert into public.chas(id_cha, name, id_system)
VALUES ('41', 'CHA-1PC,CHA-2PC', '9');
insert into public.chas(id_cha, name, id_system)
VALUES ('42', 'CHA-1PD,CHA-2PD', '9');
insert into public.chas(id_cha, name, id_system)
VALUES ('43', 'CHA-1PJ,CHA-2PJ', '9');
insert into public.chas(id_cha, name, id_system)
VALUES ('44', 'CHA-1PC,CHA-2PC', '10');
insert into public.chas(id_cha, name, id_system)
VALUES ('45', 'CHA-1PD,CHA-2PD', '10');
insert into public.chas(id_cha, name, id_system)
VALUES ('46', 'CHA-1PE,CHA-2PE', '10');
insert into public.chas(id_cha, name, id_system)
VALUES ('47', 'CHA-1PJ,CHA-2PJ', '10');
insert into public.chas(id_cha, name, id_system)
VALUES ('48', 'CHA-1PK,CHA-2PK', '10');
insert into public.chas(id_cha, name, id_system)
VALUES ('49', 'CHA-1PC,CHA-2PC', '11');
insert into public.chas(id_cha, name, id_system)
VALUES ('50', 'CHA-1PD,CHA-2PD', '11');
insert into public.chas(id_cha, name, id_system)
VALUES ('51', 'CHA-1PJ,CHA-2PJ', '11');
insert into public.chas(id_cha, name, id_system)
VALUES ('52', 'CHA-1PK,CHA-2PK', '11');
insert into public.chas(id_cha, name, id_system)
VALUES ('53', 'CHA-1PC,CHA-2PC', '12');
insert into public.chas(id_cha, name, id_system)
VALUES ('54', 'CHA-1PD,CHA-2PD', '12');
insert into public.chas(id_cha, name, id_system)
VALUES ('55', 'CHA-1PJ,CHA-2PJ', '12');
insert into public.chas(id_cha, name, id_system)
VALUES ('56', 'CHA-1PC,CHA-2PC', '13');
insert into public.chas(id_cha, name, id_system)
VALUES ('57', 'CHA-1PD,CHA-2PD', '13');
insert into public.chas(id_cha, name, id_system)
VALUES ('58', 'CHA-1PE,CHA-2PE', '13');
insert into public.chas(id_cha, name, id_system)
VALUES ('59', 'CHA-1PJ,CHA-2PJ', '13');
insert into public.chas(id_cha, name, id_system)
VALUES ('60', 'CHA-1PK,CHA-2PK', '13');
insert into public.chas(id_cha, name, id_system)
VALUES ('61', 'CHA-1PL,CHA-2PL', '13');
insert into public.chas(id_cha, name, id_system)
VALUES ('62', 'CHA-1PC,CHA-2PC', '14');
insert into public.chas(id_cha, name, id_system)
VALUES ('63', 'CHA-1PD,CHA-2PD', '14');
insert into public.chas(id_cha, name, id_system)
VALUES ('64', 'CHA-1PJ,CHA-2PJ', '14');
insert into public.chas(id_cha, name, id_system)
VALUES ('65', 'CHA-1PK,CHA-2PK', '14');
insert into public.chas(id_cha, name, id_system)
VALUES ('66', 'CHA-1PC,CHA-2PC', '15');
insert into public.chas(id_cha, name, id_system)
VALUES ('67', 'CHA-1PD,CHA-2PD', '15');
insert into public.chas(id_cha, name, id_system)
VALUES ('68', 'CHA-1PJ,CHA-2PJ', '15');
insert into public.chas(id_cha, name, id_system)
VALUES ('69', 'CHA-1PK,CHA-2PK', '15');
insert into public.chas(id_cha, name, id_system)
VALUES ('70', 'CHA-1PC,CHA-2PC', '16');
insert into public.chas(id_cha, name, id_system)
VALUES ('71', 'CHA-1PD,CHA-2PD', '16');
insert into public.chas(id_cha, name, id_system)
VALUES ('72', 'CHA-1PE,CHA-2PE', '16');
insert into public.chas(id_cha, name, id_system)
VALUES ('73', 'CHA-1PJ,CHA-2PJ', '16');
insert into public.chas(id_cha, name, id_system)
VALUES ('74', 'CHA-1PK,CHA-2PK', '16');
insert into public.chas(id_cha, name, id_system)
VALUES ('75', 'CHA-1PC,CHA-2PC', '17');
insert into public.chas(id_cha, name, id_system)
VALUES ('76', 'CHA-1PD,CHA-2PD', '17');
insert into public.chas(id_cha, name, id_system)
VALUES ('77', 'CHA-1PJ,CHA-2PJ', '17');
insert into public.chas(id_cha, name, id_system)
VALUES ('78', 'CHA-1PK,CHA-2PK', '17');
insert into public.chas(id_cha, name, id_system)
VALUES ('79', 'CHA-1PC,CHA-2PC', '18');
insert into public.chas(id_cha, name, id_system)
VALUES ('80', 'CHA-1PD,CHA-2PD', '18');
insert into public.chas(id_cha, name, id_system)
VALUES ('81', 'CHA-1PE,CHA-2PE', '18');
insert into public.chas(id_cha, name, id_system)
VALUES ('82', 'CHA-1PF,CHA-2PF', '18');
insert into public.chas(id_cha, name, id_system)
VALUES ('83', 'CHA-1PJ,CHA-2PJ', '18');
insert into public.chas(id_cha, name, id_system)
VALUES ('84', 'CHA-1PK,CHA-2PK', '18');
insert into public.chas(id_cha, name, id_system)
VALUES ('85', 'CHA-1PC,CHA-2PC', '19');
insert into public.chas(id_cha, name, id_system)
VALUES ('86', 'CHA-1PJ,CHA-2PJ', '19');
insert into public.chas(id_cha, name, id_system)
VALUES ('87', 'CHA-1PC,CHA-2PC', '20');
insert into public.chas(id_cha, name, id_system)
VALUES ('88', 'CHA-1PD,CHA-2PD', '20');
insert into public.chas(id_cha, name, id_system)
VALUES ('89', 'CHA-1PJ,CHA-2PJ', '20');
insert into public.chas(id_cha, name, id_system)
VALUES ('90', 'CHA-1PK,CHA-2PK', '20');
insert into public.chas(id_cha, name, id_system)
VALUES ('91', 'CHA-1PC,CHA-2PC', '21');
insert into public.chas(id_cha, name, id_system)
VALUES ('92', 'CHA-1PD,CHA-2PD', '21');
insert into public.chas(id_cha, name, id_system)
VALUES ('93', 'CHA-1PE,CHA-2PE', '21');
insert into public.chas(id_cha, name, id_system)
VALUES ('94', 'CHA-1PJ,CHA-2PJ', '21');
insert into public.chas(id_cha, name, id_system)
VALUES ('95', 'CHA-1PK,CHA-2PK', '21');
insert into public.chas(id_cha, name, id_system)
VALUES ('96', 'CHA-1PC,CHA-2PC', '22');
insert into public.chas(id_cha, name, id_system)
VALUES ('97', 'CHA-1PD,CHA-2PD', '22');
insert into public.chas(id_cha, name, id_system)
VALUES ('98', 'CHA-1PC,CHA-2PC', '23');
insert into public.chas(id_cha, name, id_system)
VALUES ('99', 'CHA-1PD,CHA-2PD', '23');
insert into public.chas(id_cha, name, id_system)
VALUES ('100', 'CHA-1PJ,CHA-2PJ', '23');
insert into public.chas(id_cha, name, id_system)
VALUES ('101', 'CHA-1PK,CHA-2PK', '23');
insert into public.chas(id_cha, name, id_system)
VALUES ('102', 'CHA-1PC,CHA-2PC', '24');
insert into public.chas(id_cha, name, id_system)
VALUES ('103', 'CHA-1PD,CHA-2PD', '24');
insert into public.chas(id_cha, name, id_system)
VALUES ('104', 'CHA-1PE,CHA-2PE', '24');
insert into public.chas(id_cha, name, id_system)
VALUES ('105', 'CHA-1PJ,CHA-2PJ', '24');
insert into public.chas(id_cha, name, id_system)
VALUES ('106', 'CHA-1PK,CHA-2PK', '24');
insert into public.chas(id_cha, name, id_system)
VALUES ('107', 'CHA-1PL,CHA-2PL', '24');
insert into public.chas(id_cha, name, id_system)
VALUES ('108', 'CHA-1PC,CHA-2PC', '25');
insert into public.chas(id_cha, name, id_system)
VALUES ('109', 'CHA-1PD,CHA-2PD', '25');
insert into public.chas(id_cha, name, id_system)
VALUES ('110', 'CHA-1PE,CHA-2PE', '25');
insert into public.chas(id_cha, name, id_system)
VALUES ('111', 'CHA-1PJ,CHA-2PJ', '25');
insert into public.chas(id_cha, name, id_system)
VALUES ('112', 'CHA-1PK,CHA-2PK', '25');
insert into public.chas(id_cha, name, id_system)
VALUES ('113', 'CHA-1PL,CHA-2PL', '25');
insert into public.chas(id_cha, name, id_system)
VALUES ('114', 'CHA-1PK,CHA-2PK', '5');

create TABLE cat_metric_group
(
    id_cat_metric_group SERIAL PRIMARY KEY,
    name                VARCHAR(30) NOT NULL
);

insert into cat_metric_group (id_cat_metric_group, name)
values (1, 'PERFORMANCE'),
       (2, 'CAPACITY'),
       (3, 'ADAPTERS'),
       (4, 'SLA');

alter table cat_metric_type
    add COLUMN id_cat_metric_group INTEGER REFERENCES cat_metric_group (id_cat_metric_group);
update cat_metric_type
set id_cat_metric_group = 1
where id_cat_metric_type in (
                             7, 8, 11, 10, 12, 9
    );

update cat_metric_type
set id_cat_metric_group = 2
where id_cat_metric_type in (1, 2, 3, 4, 5, 6, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34);
update cat_metric_type
set id_cat_metric_group = 3
where id_cat_metric_type in (15, 35, 36);
update cat_metric_type
set id_cat_metric_group = 4
where id_cat_metric_type in (13, 14);
delete
from cat_metric_type
where id_cat_metric_type in (28, 19);
alter table cat_metric_type
    alter COLUMN id_cat_metric_group SET NOT NULL;

update cat_metric_type
set unit = null
where unit = '';
------------------------------ VIEWS ----------------------------------------------------------------------------------
drop view IF EXISTS view_system_metrics;
create view view_system_metrics as
select
     outer_sm.id_system_metric,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.peak,
     outer_sm.id_system,
     outer_sm.date,
     outer_sm.created_at
from datacenters
join systems on systems.id_datacenter = datacenters.id_datacenter
left join system_metrics outer_sm on outer_sm.id_system = systems.id_system and outer_sm.id_system_metric in (
	select inner_sm.id_system_metric
	from system_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type and outer_sm.id_system = inner_sm.id_system
	order by date desc
	LIMIT 1
);

drop view IF EXISTS view_cha_metrics;
create view view_cha_metrics as
select
     outer_sm.id_cha_metric,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.id_cha,
     outer_sm.date,
     outer_sm.created_at
from datacenters
join systems on systems.id_datacenter = datacenters.id_datacenter
join chas on systems.id_system = chas.id_system
left join cha_metrics outer_sm on chas.id_system = systems.id_system
	and outer_sm.id_cha = chas.id_cha and outer_sm.id_cha_metric in (
	select inner_sm.id_cha_metric
	from cha_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
	and outer_sm.id_cha = inner_sm.id_cha
	order by date desc
	LIMIT 1
);

drop view IF EXISTS view_pool_metrics;
create view view_pool_metrics as
select
     outer_sm.id_pool_metric,
     outer_sm.id_cat_metric_type,
     outer_sm.value,
     outer_sm.id_pool,
     outer_sm.date,
     outer_sm.created_at
from datacenters
join systems on systems.id_datacenter = datacenters.id_datacenter
join pools on systems.id_system = pools.id_system
left join pool_metrics outer_sm on outer_sm.id_pool = pools.id_pool and outer_sm.id_pool_metric in (
	select inner_sm.id_pool_metric
	from pool_metrics as inner_sm
	where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
	and outer_sm.id_pool = inner_sm.id_pool
	order by date desc
	LIMIT 1
);
