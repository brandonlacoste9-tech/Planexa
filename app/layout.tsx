import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Planexa - Planification de rendez-vous',
  description: 'Outil de planification en français pour gérer vos disponibilités et permettre à vos clients de réserver des rendez-vous.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  )
}
