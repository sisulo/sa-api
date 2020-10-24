import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewStorageEntityTypes1603045522727 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`
        UPDATE public.cat_storage_entity_type
        SET name = 'PORT_GROUP'
        WHERE name = 'PORT';

        UPDATE public.cat_storage_entity_type
        SET name = 'ADAPTER_GROUP'
        WHERE name = 'ADAPTER';

        INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (8, 'PORT');
        INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (9, 'CHANNEL_BOARD');
        INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (10, 'DKC');
        INSERT INTO public.cat_storage_entity_type (id_cat_storage_entity_type, name) VALUES (11, 'CONTROLLER');

        ALTER TABLE system_details
          RENAME TO storage_entity_details;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return ;
  }

}
