import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import { IconPlay, IconFilters } from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { PromptInput } from '@/components/prompt-input'
import BottomNavbar, { NavbarButton } from './bottom-navbar'

export interface PromptInputFormProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

interface BuildPromptParams {
  characters: string,
  place: string,
  length?: string
}

const ENbuildPrompt = ({characters='add some random names', place='pick any place from a common terror movie', length = '20 seconds'}: BuildPromptParams)  => 
`Short ${length} read Scary story with characters: ${characters} set in ${place}, add dialogs as well as sound indicators of open doors etc, don't be afraid to add mystery, murder or even a plot twist, make it really creepy`

const ESbuildPrompt = ({characters='agrega nombres al azar', place='algun lugar comun de peliculas de miedo', length = '20 segundos'}: BuildPromptParams)  => 
`Historia corta de ${length} de lectura de miedo con los personajes: ${characters} puestos en ${place}, agrega dialogos asi como indicadores de sonidos puertas abriendose etc, no tengas miedo de agregar misterio asesinato y hasta un plot twist, hazla espeluznante`


export function PromptInputForm({
  onSubmit,
  input,
  setInput,
}: PromptInputFormProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const characterInputRef = React.useRef<HTMLTextAreaElement>(null)
  const placeInputRef = React.useRef<HTMLTextAreaElement>(null)
  const [formInputs, setFormInput] = React.useState<Record<string, string>>({
    characters: '',
    place: ''
  })
  const [language, setLanguage] = React.useState<'EN' | 'ES'>('EN');

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'EN' ? 'ES' : 'EN'));
  };

  const handlesetFormInput = (value: any, name: any) => {
    setFormInput({
      ...formInputs,
      [name]: value,
    })
  }

  React.useEffect(() => {
    const { characters, place} = formInputs
    setInput(currentPormptBuilder({characters, place}))
  }, [formInputs])



  React.useEffect(() => {
    if (characterInputRef.current) {
        characterInputRef.current.focus()
    }
  }, [])

  const promptScreenNavbarButtons: NavbarButton[] = [
    {
      icon: IconPlay,
      label: 'Play',
      type: 'submit'
    },
  ];

  const currentPormptBuilder = language === 'EN' ? ENbuildPrompt : ESbuildPrompt

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
        <PromptInput 
        name='characters'
        input={formInputs.characters}
        setInput={handlesetFormInput}
        onKeyDown={onKeyDown}
        inputRef={characterInputRef}
        placeholder={'List some characters!'}/>
        <PromptInput 
        name='place'
        input={formInputs.place}
        setInput={handlesetFormInput}
        onKeyDown={onKeyDown}
        inputRef={placeInputRef}
        placeholder={'Type a place!'}/>
        <div className='mt-5 mb-2.5 flex justify-evenly items-center'>
        <div
          className="cursor-pointer w-8 h-8 border-2 border-white rounded-full flex items-center justify-center"
          onClick={toggleLanguage}
        >
          {language}
        </div>
          <IconFilters className='w-8 h-8 border-2 border-[#FFFFFF] rounded-full' onClick={() => {
            //add modal/bottom sheet open actions
          }}/>
          
        </div>
        <BottomNavbar buttons={promptScreenNavbarButtons}/>
        
    </form>
  )
}
