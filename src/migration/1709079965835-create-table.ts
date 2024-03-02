import { table } from "console";
import { create } from "domain";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1709079965835 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query('')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
