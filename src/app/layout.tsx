import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Magorya ✨ - Tu Hada Mágica',
  description: 'Asistente mágica amiga con personalidad de maestra en psicopedagogía. Te acompaña, organiza y motiva con magia.',
  keywords: ['asistente', 'ia', 'psicopedagogia', 'hada', 'magia', 'compania'],
  openGraph: {
    title: 'Magorya ✨ - Tu Hada Mágica',
    description: 'Asistente mágica amiga con personalidad de maestra en psicopedagogía.',
    type: 'website',
    locale: 'es',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
