import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Puerto } from "../../puerto/entities/puerto.entity";

@Entity({ name: "EMBARCACION" })
export class Embarcacion {
  @PrimaryGeneratedColumn({ name: "ID" })
  id!: number;

  @Column({ name: "NOMBRE", type: "varchar", length: 120 })
  nombre!: string;

  @Column({ name: "ESLORA_METROS", type: "integer" })
  esloraMetros!: number;

  @ManyToOne(() => Puerto, (puerto) => puerto.embarcaciones, { nullable: false })
  @JoinColumn({ name: "ID_PUERTO" })
  puerto!: Puerto;
}
