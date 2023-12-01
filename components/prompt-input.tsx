import * as React from 'react'
import Textarea from 'react-textarea-autosize'

export interface PromptInputProps {
    input: any
    setInput: any
    name: string
    onKeyDown: any
    inputRef: any
    placeholder: string
}

export function PromptInput({
    input,
    setInput,
    name,
    onKeyDown,
    inputRef,
    placeholder,
}: PromptInputProps) {

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
      <div className="relative my-2.5 border-[#A9A9A9] border rounded-lg flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value, name)}
          placeholder={placeholder}
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
      </div>
  )
}
