import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSiteSettings } from '@/lib/getSiteSettings';
import { buildBrandPalette } from '@/lib/colorUtils';
import { fontStackFor } from '@/lib/fonts';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.site_name,
    description: 'Plataforma editable en tiempo real desde un panel de administración',
    manifest: '/manifest.json',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: settings.site_name },
  };
}

export const viewport: Viewport = {
  themeColor: '#3454e6',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const palette = buildBrandPalette(settings.primary_color);
  const fontStack = fontStackFor(settings.font_family);
  const googleFontFamily = settings.font_family.replace(/ /g, '+');

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?family=${googleFontFamily}:wght@400;500;600;700;800&display=swap`}
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--brand-50:${palette[50]};--brand-100:${palette[100]};--brand-300:${palette[300]};--brand-500:${palette[500]};--brand-600:${palette[600]};--brand-700:${palette[700]};--brand-900:${palette[900]};--site-font:${fontStack};}`,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
