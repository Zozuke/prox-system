import { getPageData } from '@/lib/getPageData';
import PageView from '@/components/PageView';
import { notFound } from 'next/navigation';

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const { page, blocks, profile, userId } = await getPageData(params.slug);

  if (!page) notFound();

  return <PageView page={page} initialBlocks={blocks} userId={userId} userName={profile?.full_name} />;
}
