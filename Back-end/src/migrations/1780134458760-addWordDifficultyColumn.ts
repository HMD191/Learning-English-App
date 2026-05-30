import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWordDifficultyColumn1780134458760 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE words
      ADD COLUMN difficulty SMALLINT NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE words
      DROP COLUMN difficulty
    `);
  }
}
