import { nanoid } from '@/lib/utils'
import { MainScreen } from '@/components/main-screen'

export default function IndexPage() {
  const id = nanoid()

  return <MainScreen id={id} />
}
