import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMicroservices1652011277616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO microservices (name, "checkUrl") VALUES ('localhost:5000', 'http://localhost:5000/healthcheck')`,
    );
    await queryRunner.query(
      `INSERT INTO microservices (name, "checkUrl") VALUES ('localhost:6000', 'http://localhost:6000/healthcheck')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
