import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateWordsAndCategories1778401988668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // enum cho word_kind
    await queryRunner.query(`
      CREATE TYPE "words_word_kind_enum" AS ENUM (
        'noun',
        'verb',
        'adj',
        'adv'
      )
    `);

    // categories
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'category_name',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'last_update',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // words
    await queryRunner.createTable(
      new Table({
        name: 'words',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: true,
            unsigned: true,
          },
          {
            name: 'eng_meaning',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'vn_meaning',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'word_kind',
            type: 'enum',
            enumName: 'words_word_kind_enum',
            enum: ['noun', 'verb', 'adj', 'adv'],
            isArray: true,
          },
          {
            name: 'synonyms',
            type: 'text',
            isNullable: true,
            default: null,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
            default: null,
          },
          {
            name: 'last_update',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // foreign key
    await queryRunner.createForeignKey(
      'words',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('words');

    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('category_id') !== -1,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('words', foreignKey);
    }

    await queryRunner.dropTable('words');
    await queryRunner.dropTable('categories');

    await queryRunner.query(`
      DROP TYPE "words_word_kind_enum"
    `);
  }
}
