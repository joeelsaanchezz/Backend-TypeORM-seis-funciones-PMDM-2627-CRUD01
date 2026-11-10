import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Puerto } from "../puerto/entities/puerto.entity";
import { Embarcacion } from "./entities/embarcacion.entity";
import { EmbarcacionController } from "./embarcacion.controller";
import { EmbarcacionService } from "./embarcacion.service";

@Module({
  imports: [TypeOrmModule.forFeature([Puerto, Embarcacion])],
  controllers: [EmbarcacionController],
  providers: [EmbarcacionService],
})
export class EmbarcacionModule {}
