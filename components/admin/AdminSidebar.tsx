import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function AdminSidebar() {
  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      <div className="mb-8">
        <p className="text-lg font-extrabold text-[var(--brand-600)]">Prox System</p>
        <p className="text-xs text-slate-400">Panel de administración</p>
      </div>
      <nav className="flex-1 space-y-1">
        <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          📄 Páginas
        </Link>
        <Link href="/admin/submissions" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          📥 Respuestas recibidas
        </Link>
        <Link href="/admin/users" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          👥 Usuarios
        </Link>
        <Link href="/admin/appearance" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          🎨 Apariencia
        </Link>
        <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          🔗 Ver sitio público
        </Link>
      </nav>
      <div className="border-t border-slate-200 pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
