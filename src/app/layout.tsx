import type { Metadata } from 'next'
import { IM_Fell_English_SC } from 'next/font/google'
import './globals.css'

const fellEnglishSC = IM_Fell_English_SC({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spooky Teller',
  description: 'Spooky stories App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <title>Spooky Teller: Horror Stories</title>
      </head>
      <body className={`${fellEnglishSC.className} bg-amethysts`}>
        {children}
      </body>
    </html>
  )
}
