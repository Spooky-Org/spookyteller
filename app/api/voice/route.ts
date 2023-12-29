import OpenAI from 'openai'
import { auth } from '@/auth'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
type ChatMessage = {
  role: string;
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage;
  id: string;
  previewToken?: string;
};

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json as ChatRequest;

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const aacAudio = await openai.audio.speech.create({
    model:"tts-1",
    voice:messages.role === 'user' ? 'alloy' : "shimmer",
    input:messages.content,
    response_format: 'mp3'
  })



  return new Response(aacAudio.body, {
    headers: { 'Content-Type': 'audio/mp3' }
  });
}
