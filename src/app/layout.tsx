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

  // Move this from here use tailwind instead for whichever classes are posible and and make it a class not an inline style
  const svgBackgroundStyle = {
    backgroundImage: 'url("/endless-constellation.svg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // Set to 100% of the viewport height
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Spooky Teller: Horror Stories</title>
      </head>
      <body style={svgBackgroundStyle} className={`${fellEnglishSC.className}`}>
        {children}
      </body>
    </html>
  )
}
