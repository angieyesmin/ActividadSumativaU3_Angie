// Repositorio encargado de realizar las consultas
// SQL relacionadas con las citas veterinarias.

import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/database.js";

import type {
  ActualizarCita,
  Cita,
  EstadoCita,
  NuevaCita,
} from "../types/cita.js";

// Tipo para representar los registros obtenidos de MySQL.
type CitaRow = Cita & RowDataPacket;

// Consultar todas las citas.
// También permite filtrar por estado.
export async function listarCitas(
  estado?: EstadoCita,
): Promise<Cita[]> {

  if (estado) {
    const [rows] = await pool.execute<CitaRow[]>(
      `SELECT * FROM citas
       WHERE estado = ?
       ORDER BY fecha, hora`,
      [estado],
    );

    return rows;
  }

  const [rows] = await pool.query<CitaRow[]>(
    `SELECT * FROM citas
     ORDER BY fecha, hora`,
  );

  return rows;
}

// Buscar una cita por su identificador.
export async function buscarCitaPorId(
  id: number,
): Promise<Cita | null> {

  const [rows] = await pool.execute<CitaRow[]>(
    `SELECT * FROM citas WHERE id = ?`,
    [id],
  );

  return rows[0] ?? null;
}

// Comprobar si existe una cita activa
// en una fecha y hora determinadas.
export async function horarioOcupado(
  fecha: string,
  hora: string,
  exceptoId?: number,
): Promise<boolean> {

  let sql = `SELECT id FROM citas
             WHERE fecha = ? AND hora = ?
             AND estado IN ('solicitada', 'confirmada')`;

  const valores: Array<string | number> = [fecha, hora];

  // Excluir el ID cuando se está modificando una cita.
  if (exceptoId !== undefined) {
    sql += " AND id <> ?";
    valores.push(exceptoId);
  }

  const [rows] = await pool.execute<RowDataPacket[]>(
    sql,
    valores,
  );

  return rows.length > 0;
}

// Registrar una nueva cita en la base de datos.
export async function crearCita(
  datos: NuevaCita,
): Promise<Cita> {

  const [resultado] = await pool.execute<ResultSetHeader>(
    `INSERT INTO citas
     (mascota, cliente, servicio, fecha, hora, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      datos.mascota,
      datos.cliente,
      datos.servicio,
      datos.fecha,
      datos.hora,
      datos.estado ?? "solicitada",
    ],
  );

  // Recuperar la cita recién registrada.
  const cita = await buscarCitaPorId(resultado.insertId);

  if (!cita) {
    throw new Error(
      "La cita se guardó, pero no pudo recuperarse.",
    );
  }

  return cita;
}

// Actualizar todos los datos de una cita.
export async function actualizarCita(
  id: number,
  datos: ActualizarCita,
): Promise<Cita | null> {

  await pool.execute(
    `UPDATE citas SET
     mascota = ?,
     cliente = ?,
     servicio = ?,
     fecha = ?,
     hora = ?,
     estado = ?
     WHERE id = ?`,
    [
      datos.mascota,
      datos.cliente,
      datos.servicio,
      datos.fecha,
      datos.hora,
      datos.estado,
      id,
    ],
  );

  // Recuperar la cita después de actualizarla.
  return buscarCitaPorId(id);
}

// Actualizar únicamente el estado de una cita.
export async function actualizarEstadoCita(
  id: number,
  estado: EstadoCita,
): Promise<Cita | null> {

  await pool.execute(
    `UPDATE citas SET estado = ?
     WHERE id = ?`,
    [estado, id],
  );

  // Recuperar la cita con su nuevo estado.
  return buscarCitaPorId(id);
}

// Eliminar una cita por su identificador.
export async function eliminarCita(
  id: number,
): Promise<boolean> {

  const [resultado] = await pool.execute<ResultSetHeader>(
    `DELETE FROM citas WHERE id = ?`,
    [id],
  );

  return resultado.affectedRows > 0;
}