'use client';
import { Button } from '@/stories/Button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src="/spooky-main-logo.png"
        alt="Company Logo"
        width={300}
        height={300}
        priority
      />
      <h1 className="text-3xl text-milk">Spooky Teller</h1>
      <Link href="/story-teller">
        <Button primary label="Story Teller" />
      </Link>

    </main>
  )
}
