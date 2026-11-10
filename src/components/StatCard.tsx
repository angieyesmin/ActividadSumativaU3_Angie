type StatCardProps = { titulo: string; valor: number; color: string };

export function StatCard({ titulo, valor, color }: StatCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold text-slate-500">{titulo}</h2>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{valor}</p>
    </article>
  );
}
