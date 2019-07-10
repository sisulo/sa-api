INSERT INTO systems (id_system, name, id_datacenter) VALUES
(24, 'XP7_B17_50225', 1),
(25, 'XP7_STL3_58634', 2);

INSERT INTO pools (name, id_system)
VALUES
('Pool#6 AFA_T1', 24),
('Pool#7 AFA_T1', 24)

INSERT INTO pools (name, id_system)
VALUES
('Pool#4 SHP_T0', 25),
('Pool#5 AFA_T2', 25),
('Pool#6 AFA_T0', 25),
('Pool#7 AFA_T1', 25),
('Pool#8 AFA_T1', 25);

INSERT INTO chas(name, id_system)
VALUES
('CHA-1PK,CHA-2PK', 23),
('CHA-1PC,CHA-2PC', 24),
('CHA-1PD,CHA-2PD', 24),
('CHA-1PE,CHA-2PE', 24),
('CHA-1PJ,CHA-2PJ', 24),
('CHA-1PK,CHA-2PK', 24),
('CHA-1PL,CHA-2PL', 24),
('CHA-1PC,CHA-2PC', 25),
('CHA-1PD,CHA-2PD', 25),
('CHA-1PE,CHA-2PE', 25),
('CHA-1PJ,CHA-2PJ', 25),
('CHA-1PK,CHA-2PK', 25),
('CHA-1PL,CHA-2PL', 25);