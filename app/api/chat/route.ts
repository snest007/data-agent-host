import { convertToModelMessages, streamText, type UIMessage } from "ai"

import {
  MissingAIConfigurationError,
  resolveDataAgentModel,
} from "@/lib/ai-provider"

export const maxDuration = 60

type ChatRequestBody = {
  accessMode?: string
  effort?: string
  messages?: UIMessage[]
  modelId?: string
  sessionId?: string
}

const dataAgentSystemPrompt = [
  "You are Data Agent, an enterprise data assistant for querying, explaining, and transforming internal data assets.",
  "Ask concise clarifying questions when the request is ambiguous.",
  "When the user asks for data work, explain the assumptions, likely data sources, and the next concrete action.",
  "Do not claim that you queried private datasets unless tools or data were actually provided in this conversation.",
].join("\n")

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody

    if (!Array.isArray(body.messages)) {
      return Response.json(
        { error: "Request body must include a messages array." },
        { status: 400 }
      )
    }

    const runtime = resolveDataAgentModel(body.modelId)
    const result = streamText({
      model: runtime.model,
      messages: await convertToModelMessages(body.messages),
      system: dataAgentSystemPrompt,
      maxOutputTokens: 2048,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "data-agent.chat",
        metadata: {
          accessMode: body.accessMode ?? "unset",
          effort: body.effort ?? "unset",
          modelId: runtime.modelId,
          provider: runtime.providerLabel,
          sessionId: body.sessionId ?? "new-session",
        },
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    if (error instanceof MissingAIConfigurationError) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.error("Data Agent chat failed", error)

    return Response.json(
      { error: "Data Agent chat request failed." },
      { status: 500 }
    )
  }
}
