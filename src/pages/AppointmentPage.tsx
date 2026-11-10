import { useEffect, useState } from "react";

import { AppointmentCard } from "../components/AppointmentCard";
import { StatCard } from "../components/StatCard";

import {
  actualizarEstado,
  obtenerCitas,
  registrarCita,
} from "../services/citasApi";

import type { Cita, EstadoCita, NuevaCita } from "../types";

type Filtro = "todas" | EstadoCita;

const formularioInicial: NuevaCita = {
  mascota: "",
  cliente: "",
  servicio: "",
  fecha: "",
  hora: "",
};

export function AppointmentsPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [mensaje, setMensaje] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaCita, setNuevaCita] =
    useState<NuevaCita>(formularioInicial);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargarCitas() {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerCitas();
        setCitas(datos);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error al cargar las citas.",
        );
      } finally {
        setCargando(false);
      }
    }

    void cargarCitas();
  }, []);

  async function confirmarCita(id: number) {
    try {
      setError("");

      const actualizada = await actualizarEstado(id, "confirmada");

      setCitas((actuales) =>
        actuales.map((cita) =>
          cita.id === id ? actualizada : cita,
        ),
      );

      setMensaje("¡Cita confirmada correctamente!");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al confirmar.",
      );
    }
  }

  function manejarCambio(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setNuevaCita((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  async function guardarCita(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const citaRegistrada = await registrarCita(nuevaCita);

      setCitas((actuales) => [...actuales, citaRegistrada]);

      setNuevaCita(formularioInicial);
      setModalAbierto(false);

      setMensaje("¡Nueva cita registrada correctamente!");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No fue posible registrar la cita.",
      );
    } finally {
      setGuardando(false);
    }
  }

  const citasFiltradas =
    filtro === "todas"
      ? citas
      : citas.filter((cita) => cita.estado === filtro);

  const pendientes = citas.filter(
    (c) => c.estado === "solicitada",
  ).length;

  const confirmadas = citas.filter(
    (c) => c.estado === "confirmada",
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">

      {/* ENCABEZADO */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">
            Agenda de citas
          </h2>

          <p className="mt-1 text-slate-600">
            Consulta y administra las citas del día.
          </p>
        </div>

        <button
          onClick={() => {
            setNuevaCita(formularioInicial);
            setModalAbierto(true);
            setError("");
          }}
          className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
        >
          + Nueva cita
        </button>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        <StatCard
          titulo="Citas de hoy"
          valor={citas.length}
          color="text-teal-700"
        />

        <StatCard
          titulo="Pendientes"
          valor={pendientes}
          color="text-amber-600"
        />

        <StatCard
          titulo="Confirmadas"
          valor={confirmadas}
          color="text-green-600"
        />

      </section>

      {/* FILTROS */}
      <section className="mt-8">
        <label
          htmlFor="filtro"
          className="mb-2 block font-semibold text-slate-700"
        >
          Filtrar por estado
        </label>

        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as Filtro)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 sm:w-64"
        >
          <option value="todas">Todas</option>
          <option value="solicitada">Solicitadas</option>
          <option value="confirmada">Confirmadas</option>
          <option value="atendida">Atendidas</option>
        </select>
      </section>

      {/* MENSAJES */}
      {error && (
        <p className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-red-800">
          {error}
        </p>
      )}

      {mensaje && (
        <p className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-green-800">
          {mensaje}
        </p>
      )}

      {/* LISTADO */}
      <section className="mt-6 grid gap-4">

        {cargando ? (
          <p className="rounded-xl bg-white p-8 text-center">
            Cargando citas...
          </p>
        ) : citasFiltradas.length > 0 ? (
          citasFiltradas.map((cita) => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onConfirmar={confirmarCita}
            />
          ))
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            No se encontraron citas con ese estado.
          </p>
        )}

      </section>

      {/* MODAL NUEVA CITA */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Nueva cita
              </h2>

              <button
                onClick={() => setModalAbierto(false)}
                className="text-2xl text-slate-500 hover:text-red-600"
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarCita} className="space-y-4">

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Nombre de la mascota
                </label>

                <input
                  type="text"
                  name="mascota"
                  value={nuevaCita.mascota}
                  onChange={manejarCambio}
                  placeholder="Ej. Max"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Nombre del cliente
                </label>

                <input
                  type="text"
                  name="cliente"
                  value={nuevaCita.cliente}
                  onChange={manejarCambio}
                  placeholder="Nombre del propietario"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Servicio
                </label>

                <select
                  name="servicio"
                  value={nuevaCita.servicio}
                  onChange={manejarCambio}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="Consulta general">Consulta general</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Desparasitación">Desparasitación</option>
                  <option value="Estética">Estética</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Revisión médica">Revisión médica</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Fecha
                </label>

                <input
                  type="date"
                  name="fecha"
                  value={nuevaCita.fecha}
                  onChange={manejarCambio}
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">
                  Hora
                </label>

                <input
                  type="time"
                  name="hora"
                  value={nuevaCita.hora}
                  onChange={manejarCambio}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : "Guardar cita"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}