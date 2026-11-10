import type { Cita } from '../types';
import { StatusBadge } from './StatusBadge';

type Props = { cita: Cita; onConfirmar: (id: number) => void };

export function AppointmentCard({ cita, onConfirmar }: Props) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{cita.mascota}</h3>
            <StatusBadge estado={cita.estado} />
          </div>
          <p className="mt-2 text-sm text-slate-600">Cliente: {cita.cliente}</p>
          <p className="text-sm text-slate-600">{cita.servicio} · {cita.hora}</p>
        </div>

        {cita.estado === 'solicitada' && (
          <button onClick={() => onConfirmar(cita.id)}
            className="rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white
                       transition hover:-translate-y-0.5 hover:bg-teal-800
                       focus:outline-none focus:ring-4 focus:ring-teal-200">
            Confirmar cita
          </button>
        )}
      </div>
    </article>
  );
}

