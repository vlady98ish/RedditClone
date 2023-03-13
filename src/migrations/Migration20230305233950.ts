import { Migration } from '@mikro-orm/migrations';

export class Migration20230305233950 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "updated_at" type varchar using ("updated_at"::varchar);');
  }

}
