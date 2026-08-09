import { getPageData } from '@/lib/getPageData';
import PageView from '@/components/PageView';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function HomePage() {
  const { page, blocks, profile, userId } = await getPageData('home');

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar userName={profile?.full_name} isLoggedIn={!!userId} />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-slate-400">Aún no hay una página de inicio. Créala desde el panel de administración.</p>
          {profile?.role === 'admin' ? (
            <Link href="/admin" className="btn-primary">Ir al panel de administración</Link>
          ) : !userId ? (
            <Link href="/login" className="btn-secondary">Iniciar sesión</Link>
          ) : null}
        </div>
      </div>
    );
  }

  return <PageView page={page} initialBlocks={blocks} userId={userId} userName={profile?.full_name} />;
}
