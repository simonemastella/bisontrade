import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742240909861 implements MigrationInterface {
    name = 'Init1742240909861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."operation_type_enum" AS ENUM('withdraw', 'deposit')`);
        await queryRunner.query(`CREATE TABLE "operation" ("id" SERIAL NOT NULL, "type" "public"."operation_type_enum" NOT NULL DEFAULT 'deposit', "transaction" character varying NOT NULL, "amount" numeric(78,0) NOT NULL, "fee" numeric(78,0) NOT NULL, "holdingId" integer, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_position_enum" AS ENUM('buy', 'sell')`);
        await queryRunner.query(`CREATE TYPE "public"."order_type_enum" AS ENUM('market', 'limit')`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('open', 'closed', 'partially_fulfilled', 'deleted')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "position" "public"."order_position_enum" NOT NULL DEFAULT 'buy', "type" "public"."order_type_enum" NOT NULL DEFAULT 'market', "status" "public"."order_status_enum" NOT NULL DEFAULT 'open', "amount" numeric(78,0) NOT NULL, "price" numeric(36,18), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "tradePairId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trade" ("id" SERIAL NOT NULL, "price" numeric(36,18) NOT NULL, "amount" numeric(78,0) NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "buyOrderId" integer NOT NULL, "sellOrderId" integer NOT NULL, CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trade_pair" ("id" SERIAL NOT NULL, "symbol" character varying, "tick_size" numeric(36,18) NOT NULL, "min_order_size" numeric(36,18) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "baseAssetId" integer NOT NULL, "quoteAssetId" integer NOT NULL, CONSTRAINT "PK_303b170292ab7e487636df32ec3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0519a004859ea36e645b272610" ON "trade_pair" ("baseAssetId", "quoteAssetId") `);
        await queryRunner.query(`CREATE TABLE "holding" ("id" SERIAL NOT NULL, "amount" numeric(78,0) NOT NULL, "userId" integer, "assetId" integer, CONSTRAINT "PK_82c37e949073d49d4b73e34a903" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "name" character varying NOT NULL, "decimals" integer NOT NULL, "network" character varying NOT NULL, "icon" character varying NOT NULL, "fee" double precision NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "operation" ADD CONSTRAINT "FK_ae3dca702a97214e0b4f08bc2d3" FOREIGN KEY ("holdingId") REFERENCES "holding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_14827c0e433aa0ad3632107b290" FOREIGN KEY ("tradePairId") REFERENCES "trade_pair"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trade" ADD CONSTRAINT "FK_64c81a5c0e5cb6443b6e0e4d574" FOREIGN KEY ("buyOrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trade" ADD CONSTRAINT "FK_46de8e3c413efaaa0f0926f08d1" FOREIGN KEY ("sellOrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trade_pair" ADD CONSTRAINT "FK_4d7f23ee744addc8b8330c37cd0" FOREIGN KEY ("baseAssetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trade_pair" ADD CONSTRAINT "FK_cca429d085fa54a67e3ddfb41bc" FOREIGN KEY ("quoteAssetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "holding" ADD CONSTRAINT "FK_64f7c65278280212fc3ec3090ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "holding" ADD CONSTRAINT "FK_13da7b7e0d21eff0553da498655" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "holding" DROP CONSTRAINT "FK_13da7b7e0d21eff0553da498655"`);
        await queryRunner.query(`ALTER TABLE "holding" DROP CONSTRAINT "FK_64f7c65278280212fc3ec3090ae"`);
        await queryRunner.query(`ALTER TABLE "trade_pair" DROP CONSTRAINT "FK_cca429d085fa54a67e3ddfb41bc"`);
        await queryRunner.query(`ALTER TABLE "trade_pair" DROP CONSTRAINT "FK_4d7f23ee744addc8b8330c37cd0"`);
        await queryRunner.query(`ALTER TABLE "trade" DROP CONSTRAINT "FK_46de8e3c413efaaa0f0926f08d1"`);
        await queryRunner.query(`ALTER TABLE "trade" DROP CONSTRAINT "FK_64c81a5c0e5cb6443b6e0e4d574"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_14827c0e433aa0ad3632107b290"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "operation" DROP CONSTRAINT "FK_ae3dca702a97214e0b4f08bc2d3"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TABLE "holding"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0519a004859ea36e645b272610"`);
        await queryRunner.query(`DROP TABLE "trade_pair"`);
        await queryRunner.query(`DROP TABLE "trade"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_position_enum"`);
        await queryRunner.query(`DROP TABLE "operation"`);
        await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
