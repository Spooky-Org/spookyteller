import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <Image
        src='/spooky-main-logo.png'
        alt='Company Logo'
        width={300}
        height={300}
        priority
      />
      <h1 className='text-3xl text-milk'>Spooky Teller</h1>
    </main>
  )
}
