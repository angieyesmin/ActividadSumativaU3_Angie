export function Header() {
  return (
    <header className="bg-teal-700 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <h1 className="text-xl font-bold">Veterinaria Huellitas</h1>
          <p className="text-sm text-teal-100">Sistema administrativo</p>
        </div>
        <span className="text-sm font-medium">Administrador</span>
      </div>
    </header>
  );
}
