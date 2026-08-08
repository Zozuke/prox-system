import { getPageData } from '@/lib/getPageData';
import PageView from '@/components/PageView';

export default async function HomePage() {
  const { page, blocks, profile, userId } = await getPageData('home');

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-slate-400">
        Aún no hay una página de inicio. Créala desde el panel de administración.
      </div>
    );
  }

  return <PageView page={page} initialBlocks={blocks} userId={userId} userName={profile?.full_name} />;
}
