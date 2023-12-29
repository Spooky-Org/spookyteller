'use client'

import {type Message, useChat} from 'ai/react'
import {useEffect, useMemo, useRef, useState} from 'react'
import {cn} from '@/lib/utils'
import {ChatList} from '@/components/chat-list'
import {ChatScrollAnchor} from '@/components/chat-scroll-anchor'
import {toast} from 'react-hot-toast'
import {usePathname, useRouter} from 'next/navigation'
import {PromptScreen} from '@/components/prompt-screen'
import BottomNavbar, {NavbarButton} from './bottom-navbar'
import {IconListen, IconPause, IconPlay, IconRefreshClockWise} from '@/components/ui/icons'
import {ChatRequest} from "@/app/api/voice/route";

type SpeechTrackPlayer = {
  audioElem: HTMLAudioElement;
  status: 'playing' | 'pause';
  speed: number;
  volume: number;
  second: number;
};

type SpeechTrack = {
  content: string
  request: 'none' | 'pending' | 'error' | 'ready'
  player?: SpeechTrackPlayer
}

export interface MainScreenProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function MainScreen({id, initialMessages, className}: MainScreenProps) {
  const router = useRouter()
  const path = usePathname();
  const audioManagerRef = useRef<AudioManager>(new AudioManager());
  const [isAudioPlaying,setIsAudioPlaying] = useState<boolean>(false);
  const {messages, append, reload, stop, isLoading, input, setInput} =
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
      onFinish(message: Message) {
        //Redirect user to ChatID after the first successful chat stream, this should only happen on new chats
        if (!path.includes('chat')) {
          router.push(`/chat/${id}`, {shallow: true})
          router.refresh()
        }

        //Load Story messages/paragraphs into AudioManager
        if (message.role === 'assistant') {
          audioManagerRef.current.append(message);
        }
      }
    })

  /*
    Sync AudioManager with react state, allow React to trigger effect based on AudioManagerState
    TODO: is this the only way? Should we add the state inside the Manger, maybe a ReactAudioManager?
   */
  useEffect(() => {
    if(!audioManagerRef.current || !path.includes('chat')) return;
    audioManagerRef.current.onPlayChange((isPlaying) => {
      setIsAudioPlaying(isPlaying)
    })
  }, [audioManagerRef.current])

  //Load Story messages/paragraphs into AudioManager
  useEffect(() => {
    if (messages.length === 0 || messages.length === 1) return;
    const storyMessages = messages.filter((message) => message.role === 'assistant');
    for (const storyMessage of storyMessages) {
      audioManagerRef.current.append(storyMessage);
    }
  }, []);


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
      onClick: stop,
    },
    {
      icon: IconPlay,
      label: 'Continue',
      onClick: async () => {
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
      onClick: () => audioManagerRef.current.play(),
    },
    {
      icon: IconPause,
      label: 'Pause Listen',
      onClick: () => audioManagerRef.current.pause(),
    },
  ]
  const [chatListNavbarButtons, setChatListNavbarButtons] = useState<NavbarButton[]>(
    [
      chatListNavbarButtonsList[0],
      chatListNavbarButtonsList[2],
      chatListNavbarButtonsList[3],
    ]
  )

  const openAIMessages = messages?.filter(message => message.role !== 'user') || []

  useEffect(() => {
    const firstIcon = chatListNavbarButtonsList[0];
    const secondIcon = !isLoading ? chatListNavbarButtonsList[2] : chatListNavbarButtonsList[1];
    const thirdIcon = !isAudioPlaying ? chatListNavbarButtonsList[3] : chatListNavbarButtonsList[4];

    setChatListNavbarButtons(
      [firstIcon,secondIcon,thirdIcon]
    )
  }, [isLoading,audioManagerRef.current.isPlaying])


  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {openAIMessages.length ? (
          <>
            <ChatList messages={openAIMessages}/>
            <ChatScrollAnchor trackVisibility={isLoading}/>
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

/*
  TODO: Design Interface, what action should AudioManager allow you to do?
  - play,pause, restart?, playFrom?
  - Is 'append'  a good abstraction?
 */

class AudioManager {
  private readonly speechTracks: Map<number, SpeechTrack> = new Map<number, SpeechTrack>();
  private _isPlaying = false;
  private audioTrackerIndex = 1;
  private onPlayChangeCallback: ((isPlaying:boolean) => void) | null = null;

  constructor() {
  }

  onPlayChange(callback: (isPlaying:boolean) => void) {
    this.onPlayChangeCallback = callback;
  }
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  set isPlaying(value: boolean) {
    if (value !== this._isPlaying) {
      this._isPlaying = value;
      if(this.onPlayChangeCallback){
        this.onPlayChangeCallback(this._isPlaying)
      }
    }
  }

  append(message: Message) {
    const paragraphs = this.messagesToParagraphs(message);
    for (const paragraph of paragraphs) {
      if (!this.paragraphAlreadyExist(paragraph)) {
        this.speechTracks.set(this.speechTracks.size + 1, {content: paragraph, request: 'none'});
      }
    }
  }

  async play(paragraph?: string) {
    /*
        TODO: If paragraph is exist, change audioTrackerIndex.
          Example use case: User can click on a paragraph in the screen,
          audio should be play from where he clicked
     */


    if (!this.isPlaying) {
      this.isPlaying = true;
      await this.playNext();
    }
  }

  async pause() {
    this.isPlaying = false;
    this.speechTracks.get(this.audioTrackerIndex)?.player?.audioElem.pause()
  }

  private async playNext() {
    if (!this.isPlaying) return;
    if (this.audioTrackerIndex > this.speechTracks.size) {
      this.isPlaying = false;
      return;
    }
    const track = this.speechTracks.get(this.audioTrackerIndex);
    if (!track) throw new Error('Missing Track');

    if (!track.player) {
      const respTrack = await this.textToSpeech(track.content, 'user');
      if (!respTrack) throw new Error('Error While converting text to speech');
      this.speechTracks.set(this.audioTrackerIndex, {...track, player: respTrack});
      respTrack.audioElem.addEventListener('ended', () => {
        this.audioTrackerIndex++;
        this.playNext();
      });
      await respTrack.audioElem.play();
    }

    const nextTrack = this.speechTracks.get(this.audioTrackerIndex + 1);
    if(nextTrack){
      this.textToSpeech(nextTrack.content, 'user').then((respTrack2) => {
        if(respTrack2){
          this.speechTracks.set(this.audioTrackerIndex + 1, {...nextTrack, player: respTrack2});
          respTrack2.audioElem.addEventListener('ended', () => {
            this.audioTrackerIndex++;
            this.playNext();
          });
        }
      });
    }

    track.player?.audioElem.play()
  }

  private async textToSpeech(text: string, role: string): Promise<SpeechTrackPlayer | null> {
    const request = {
      messages: {
        content: text,
        role: role
      }
    } as ChatRequest;

    try {
      const response = await fetch('/api/voice', {
        method: 'POST', // Ensure the correct HTTP method is set
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob); // Create a URL for the blob
      const audio = document.createElement('audio');
      audio.src = url;
      audio.controls = true;
      audio.style.display = 'none';
      document.body.appendChild(audio);

      return {
        audioElem: audio,
        status: 'pause',
        speed: 1,
        volume: 50,
        second: 0
      };

    } catch (error) {
      console.error('Error fetching and processing data', error);
      return null; // In case of error, return null or handle as required
    }
  }

  private paragraphAlreadyExist(paragraph: string) {
    let exists = false;
    this.speechTracks.forEach((value) => {
      if (value.content.indexOf(paragraph) !== -1) {
        exists = true;
      }
    });
    return exists;
  }

  private messagesToParagraphs(message: Message) {
    return message.content.split('\n\n');
  }
}
