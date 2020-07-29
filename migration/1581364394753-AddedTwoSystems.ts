import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTwoSystems1581364394753 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        INSERT INTO systems(id_system, name, id_datacenter)
        VALUES(26, 'XP8_G22_30738', 1),
        (27, 'XP8_G23_30739',1);
        SELECT setval('systems_id_system_seq', (SELECT MAX(id_system) from systems));
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return;
    }

}
