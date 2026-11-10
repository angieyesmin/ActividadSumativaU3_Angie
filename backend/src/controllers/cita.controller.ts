// Controlador para validar los datos, aplicar las reglas de
// negocio y llamar al repositorio y consultas HTTP.

import type { Request, Response } from "express";

import {
  actualizarCita,
  actualizarEstadoCita,
  buscarCitaPorId,
  crearCita,
  eliminarCita,
  horarioOcupado,
  listarCitas,
} from "../repositories/cita.repository.js";

import {
  estadosPermitidos,
  type ActualizarCita,
  type EstadoCita,
  type NuevaCita,
} from "../types/cita.js";

import { AppError } from "../middlewares/error.middleware.js";

// Obtener y validar el ID de una cita.
function obtenerId(req: Request): number {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "El identificador no es válido.");
  }

  return id;
}

// Validar que el estado de una cita sea permitido.
function esEstadoValido(valor: unknown): valor is EstadoCita {
  return (
    typeof valor === "string" &&
    estadosPermitidos.includes(valor as EstadoCita)
  );
}

// Validar los campos obligatorios de una cita.
function validarCampos(
  datos: Partial<NuevaCita> | undefined,
): void {
  const cuerpo = datos ?? {};

  const campos = [
    cuerpo.mascota,
    cuerpo.cliente,
    cuerpo.servicio,
    cuerpo.fecha,
    cuerpo.hora,
  ];

  const existeVacio = campos.some(
    (valor) =>
      typeof valor !== "string" || valor.trim() === "",
  );

  if (existeVacio) {
    throw new AppError(
      400,
      "Todos los campos son obligatorios.",
    );
  }

  // Validar el estado si fue enviado.
  if (
    cuerpo.estado !== undefined &&
    !esEstadoValido(cuerpo.estado)
  ) {
    throw new AppError(
      400,
      "El estado de la cita no es válido.",
    );
  }
}

// Consultar todas las citas.
export async function obtenerCitas(
  req: Request,
  res: Response,
): Promise<void> {
  const estado = req.query.estado;

  if (
    estado !== undefined &&
    !esEstadoValido(estado)
  ) {
    throw new AppError(
      400,
      "El filtro de estado no es válido.",
    );
  }

  const citas = await listarCitas(estado);

  res.json(citas);
}

// Consultar una cita por su ID.
export async function obtenerCita(
  req: Request,
  res: Response,
): Promise<void> {
  const cita = await buscarCitaPorId(obtenerId(req));

  if (!cita) {
    throw new AppError(
      404,
      "La cita no fue encontrada.",
    );
  }

  res.json(cita);
}

// Registrar una nueva cita.
export async function registrarCita(
  req: Request,
  res: Response,
): Promise<void> {
  const datos = req.body as Partial<NuevaCita> | undefined;

  validarCampos(datos);

  if (await horarioOcupado(datos!.fecha!, datos!.hora!)) {
    throw new AppError(
      409,
      "Ya existe una cita activa en ese horario.",
    );
  }

  const cita = await crearCita(datos as NuevaCita);

  res.status(201).json({
    mensaje: "Cita registrada correctamente.",
    cita,
  });
}

// Modificar una cita existente.
export async function modificarCita(
  req: Request,
  res: Response,
): Promise<void> {
  const id = obtenerId(req);

  const datos = req.body as Partial<ActualizarCita> | undefined;

  validarCampos(datos);

  // El estado es obligatorio al modificar.
  if (!esEstadoValido(datos?.estado)) {
    throw new AppError(
      400,
      "El estado es obligatorio y debe ser válido.",
    );
  }

  // Comprobar que el horario no esté ocupado.
  if (
    await horarioOcupado(
      datos!.fecha!,
      datos!.hora!,
      id,
    )
  ) {
    throw new AppError(
      409,
      "Ya existe otra cita activa en ese horario.",
    );
  }

  const cita = await actualizarCita(
    id,
    datos as ActualizarCita,
  );

  if (!cita) {
    throw new AppError(
      404,
      "La cita no fue encontrada.",
    );
  }

  res.json({
    mensaje: "Cita actualizada correctamente.",
    cita,
  });
}

// Cambiar el estado de una cita.
export async function cambiarEstado(
  req: Request,
  res: Response,
): Promise<void> {
  const id = obtenerId(req);

  const estado: unknown = req.body?.estado;

  if (!esEstadoValido(estado)) {
    throw new AppError(
      400,
      "El estado enviado no es válido.",
    );
  }

  // Comprobar que la cita exista.
  const actual = await buscarCitaPorId(id);

  if (!actual) {
    throw new AppError(
      404,
      "La cita no fue encontrada.",
    );
  }

  // Una cita atendida no puede cancelarse.
  if (
    actual.estado === "atendida" &&
    estado === "cancelada"
  ) {
    throw new AppError(
      409,
      "Una cita atendida no puede cancelarse.",
    );
  }

  const cita = await actualizarEstadoCita(id, estado);

  res.json({
    mensaje: "Estado actualizado correctamente.",
    cita,
  });
}

// Eliminar una cita.
export async function borrarCita(
  req: Request,
  res: Response,
): Promise<void> {
  const eliminada = await eliminarCita(obtenerId(req));

  if (!eliminada) {
    throw new AppError(
      404,
      "La cita no fue encontrada.",
    );
  }

  res.status(204).send();
}