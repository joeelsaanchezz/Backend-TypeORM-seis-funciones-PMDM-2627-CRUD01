import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EmbarcacionService } from "./embarcacion.service";

@Controller("embarcaciones")
export class EmbarcacionController {
  constructor(private readonly embarcacionService: EmbarcacionService) {}

  // 2. Listar registros
  @Get()
  findAll() {
    return this.embarcacionService.findAll();
  }

  // 6. INNER JOIN + WHERE por texto: GET /embarcaciones/buscar?texto=bri
  @Get("buscar")
  searchByName(@Query("texto") texto: string) {
    return this.embarcacionService.searchByName(texto ?? "");
  }

  // LEFT JOIN + GROUP BY: total de embarcaciones por puerto
  @Get("resumen/puerto")
  countByPuerto() {
    return this.embarcacionService.countByPuerto();
  }

  // 6. INNER JOIN + WHERE por ID del puerto (ruta más específica primero)
  @Get("puerto/:puertoId/minimo/:minimo")
  findByPuertoAndMinimum(
    @Param("puertoId", ParseIntPipe) puertoId: number,
    @Param("minimo", ParseIntPipe) minimo: number,
  ) {
    return this.embarcacionService.findByPuertoAndMinimum(puertoId, minimo);
  }

  // 6. INNER JOIN + WHERE por ID del puerto
  @Get("puerto/:puertoId")
  findByPuerto(@Param("puertoId", ParseIntPipe) puertoId: number) {
    return this.embarcacionService.findByPuerto(puertoId);
  }

  // 1. Añadir un registro
  @Post()
  create(@Body() datos: { nombre: string; esloraMetros: number; puertoId: number }) {
    return this.embarcacionService.create(
      datos.nombre,
      Number(datos.esloraMetros),
      Number(datos.puertoId),
    );
  }

  // 5. Modificar la clave foránea (ID_PUERTO): PATCH /embarcaciones/3/puerto { "puertoId": 2 }
  @Patch(":id/puerto")
  changePuerto(
    @Param("id", ParseIntPipe) id: number,
    @Body() datos: { puertoId: number },
  ) {
    return this.embarcacionService.changePuerto(id, Number(datos.puertoId));
  }

  // 4. Modificar campos conservando el ID: PATCH /embarcaciones/3 { "nombre": "Nuevo" }
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() datos: { nombre?: string; esloraMetros?: number },
  ) {
    return this.embarcacionService.update(id, datos);
  }

  // 3. Eliminar el registro elegido
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.embarcacionService.remove(id);
  }
}
