export type EstadoCita =
  | "solicitada"
  | "confirmada"
  | "atendida";

export type Cita = {
  id: number;
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
};

export type NuevaCita = {
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
};