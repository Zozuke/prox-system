export default function AdminDesktopOnly() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="card-surface max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-50)] text-2xl">
          🖥️
        </div>
        <h1 className="text-lg font-bold">El panel de administración es solo de escritorio</h1>
        <p className="mt-2 text-sm text-slate-500">
          Para editar el contenido de Prox System, abre esta misma dirección desde una computadora.
          El sitio público sí funciona perfectamente desde el celular.
        </p>
        <a href="/" className="btn-primary mt-6">Ir al sitio</a>
      </div>
    </main>
  );
}
