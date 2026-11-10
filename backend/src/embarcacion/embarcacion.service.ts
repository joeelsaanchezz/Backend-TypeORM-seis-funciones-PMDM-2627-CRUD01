import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Puerto } from "../puerto/entities/puerto.entity";
import { Embarcacion } from "./entities/embarcacion.entity";

@Injectable()
export class EmbarcacionService {
  constructor(
    @InjectRepository(Embarcacion)
    private readonly embarcacionRepository: Repository<Embarcacion>,
    @InjectRepository(Puerto)
    private readonly puertoRepository: Repository<Puerto>,
  ) {}

  findAll() {
    return this.embarcacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.puerto", "principal")
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByPuerto(principalId: number) {
    return this.embarcacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.puerto", "principal")
      .where("principal.id = :principalId", { principalId })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  searchByName(text: string) {
    return this.embarcacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.puerto", "principal")
      .where("registro.nombre ILIKE :pattern", { pattern: `%${text}%` })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByPuertoAndMinimum(principalId: number, minimum: number) {
    return this.embarcacionRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.puerto", "principal")
      .where("principal.id = :principalId", { principalId })
      .andWhere("registro.esloraMetros >= :minimum", { minimum })
      .orderBy("registro.esloraMetros", "DESC")
      .getMany();
  }

  countByPuerto() {
    return this.puertoRepository
      .createQueryBuilder("principal")
      .leftJoin("principal.embarcaciones", "registro")
      .select("principal.id", "id")
      .addSelect("principal.nombre", "nombre")
      .addSelect("COUNT(registro.id)", "total")
      .groupBy("principal.id")
      .addGroupBy("principal.nombre")
      .orderBy("principal.id", "ASC")
      .getRawMany();
  }

  async create(nombre: string, esloraMetros: number, puertoId: number) {
    const puerto = await this.puertoRepository.findOneBy({ id: puertoId });

    if (!puerto) {
      throw new NotFoundException("Ese puerto no existe");
    }

    const embarcacion = this.embarcacionRepository.create({
      nombre,
      esloraMetros,
      puerto,
    });

    return this.embarcacionRepository.save(embarcacion);
  }

  async update(id: number, datos: { nombre?: string; esloraMetros?: number }) {
    const embarcacion = await this.embarcacionRepository.findOne({
      where: { id },
      relations: { puerto: true },
    });

    if (!embarcacion) {
      throw new NotFoundException("Esa embarcación no existe");
    }

    if (datos.nombre !== undefined) {
      embarcacion.nombre = datos.nombre;
    }
    if (datos.esloraMetros !== undefined) {
      embarcacion.esloraMetros = Number(datos.esloraMetros);
    }

    return this.embarcacionRepository.save(embarcacion);
  }

  async changePuerto(id: number, puertoId: number) {
    const embarcacion = await this.embarcacionRepository.findOneBy({ id });
    if (!embarcacion) {
      throw new NotFoundException("Esa embarcación no existe");
    }

    const puerto = await this.puertoRepository.findOneBy({ id: puertoId });
    if (!puerto) {
      throw new NotFoundException("Ese puerto no existe");
    }

    embarcacion.puerto = puerto;
    return this.embarcacionRepository.save(embarcacion);
  }

  async remove(id: number) {
    const embarcacion = await this.embarcacionRepository.findOneBy({ id });

    if (!embarcacion) {
      throw new NotFoundException("Esa embarcación no existe");
    }

    await this.embarcacionRepository.remove(embarcacion);

    return { mensaje: `Embarcación ${id} eliminada` };
  }
}
