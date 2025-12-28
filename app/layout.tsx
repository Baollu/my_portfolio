import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Boris CHENG - Portfolio",
  description: "Portfolio de Boris CHENG - Développeur",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='fr'>
      <body className='bg-black text-zinc-200 min-h-screen'>
        {children}
      </body>
    </html>
  )
}
