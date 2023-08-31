// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse, experimental_StreamData } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  const data = new experimental_StreamData()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {experimental_streamData: true})

  for(let i = 0; i < 1000; i++) {
    data.append({
      text: 'Hello, how are you?',
    })
  }
  data.close()

  // Respond with the stream
  return new StreamingTextResponse(stream, {}, data)
}
