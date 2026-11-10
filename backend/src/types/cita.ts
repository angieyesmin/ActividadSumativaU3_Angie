export const estadosPermitidos = [
  "solicitada",
  "confirmada",
  "atendida",
  "rechazada",
  "cancelada",
] as const;

export type EstadoCita = (typeof estadosPermitidos)[number];

export type Cita = {
  id: number;
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  created_at: string;
  updated_at: string;
};

export type NuevaCita = {
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado?: EstadoCita;
};

export type ActualizarCita = {
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
};
