'use client'

import { useChat, type Message } from 'ai/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import { PromptScreen } from '@/components/prompt-screen'
import BottomNavbar, { NavbarButton } from './bottom-navbar'
import { IconListen,
        IconPause,
        IconPlay,
        IconRefreshClockWise  } from '@/components/ui/icons'

export interface MainScreenProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}


export function MainScreen({ id, initialMessages, className }: MainScreenProps) {
  const router = useRouter()
  const path = usePathname()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      },
      onFinish() {
        if (!path.includes('chat')) {
          router.push(`/chat/${id}`, { shallow: true })
          router.refresh()
        }
      }
    })

    
    const chatListNavbarButtonsList: NavbarButton[] = [
        {
            icon: IconRefreshClockWise,
            label: 'Refresh',
            onClick: e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
            },
        },
        {
            icon: IconPause,
            label: 'Pause',
            onClick:  stop,
        },
        {
            icon: IconPlay,
            label: 'Continue',
            onClick:  async () => {
                await append({
                  id,
                  content: 'Continue generating the story with more terrifying elements include character development and even some deaths if seemed proper',
                  role: 'user'
                })
              },
        },
        {
            icon: IconListen,
            label: 'Listen',
            onClick: () => console.log('Reading text'),
        },
    ]
    const [chatListNavbarButtons, setChatListNavbarButtons] =  useState<NavbarButton[]>(
        [
            chatListNavbarButtonsList[0],
            chatListNavbarButtonsList[2],
            chatListNavbarButtonsList[3],
        ]
    )


    console.log("DEBUG LOADER",isLoading)
    const openAIMessages = messages?.filter(message => message.role !== 'user') || []

    useEffect(() => {
        if(!isLoading)
        setChatListNavbarButtons(
            [
                chatListNavbarButtonsList[0],
                chatListNavbarButtonsList[2],
                chatListNavbarButtonsList[3],
            ]
        )
        else {
            setChatListNavbarButtons(
                [
                    chatListNavbarButtonsList[0],
                    chatListNavbarButtonsList[1],
                    chatListNavbarButtonsList[3],
                ]
            )
        }
    }, [isLoading])

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {openAIMessages.length ? (
          <>
            <ChatList messages={openAIMessages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
            <PromptScreen
            id={id}
            isLoading={isLoading}
            stop={stop}
            append={append}
            reload={reload}
            messages={openAIMessages}
            input={input}
            setInput={setInput}
          />
        )}
      </div>
      {openAIMessages.length > 0 && <BottomNavbar buttons={chatListNavbarButtons}/>}
      
    </>
  )
}
