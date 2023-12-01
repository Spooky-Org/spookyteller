import { type UseChatHelpers } from 'ai/react'

import { PromptInputForm } from '@/components/prompt-input-form'

export interface PromptScreenProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function PromptScreen({
  id,
  isLoading,
  append,
  input,
  setInput,
}: PromptScreenProps) {
  return (
    <>
    <div style={{    left: '50%', transform: 'translate(-50%, 0)', top: '10%'}} className='absolute top-20px'>
      <img src='/SpookyTellerIcon.png' alt="spooky-teller-icon" />
    </div>
    <div className="fixed inset-x-0 bottom-50% bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptInputForm
            onSubmit={async value => {
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
    </>
  )
}
