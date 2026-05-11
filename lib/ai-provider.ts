import { createOpenAI, openai } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"

const DEFAULT_GATEWAY_MODEL = "openai/gpt-5.4"
const DEFAULT_OPENAI_MODEL = "gpt-5.4"
const APP_USER_AGENT = "data-agent/0.0.1"

export class MissingAIConfigurationError extends Error {
  constructor() {
    super(
      "Missing AI credentials. Set AI_GATEWAY_API_KEY for Vercel AI Gateway, or set OPENAI_API_KEY with optional OPENAI_BASE_URL for an OpenAI-compatible gateway."
    )
    this.name = "MissingAIConfigurationError"
  }
}

export type DataAgentModelRuntime = {
  model: LanguageModel
  modelId: string
  providerLabel: string
}

export function resolveDataAgentModel(
  requestedModelId?: string
): DataAgentModelRuntime {
  const providerPreference = process.env.DATA_AGENT_PROVIDER?.trim()
  const openAIKey = process.env.OPENAI_API_KEY?.trim()
  const openAIBaseURL = process.env.OPENAI_BASE_URL?.trim()
  const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim()
  const isVercelRuntime = process.env.VERCEL === "1"

  if (providerPreference === "gateway" && !gatewayKey && !isVercelRuntime) {
    throw new MissingAIConfigurationError()
  }

  if (
    providerPreference === "gateway" ||
    (!providerPreference && (gatewayKey || isVercelRuntime))
  ) {
    const modelId =
      process.env.AI_GATEWAY_MODEL?.trim() ??
      requestedModelId ??
      DEFAULT_GATEWAY_MODEL

    return {
      model: modelId as LanguageModel,
      modelId,
      providerLabel: "Vercel AI Gateway",
    }
  }

  if (
    openAIKey &&
    openAIBaseURL &&
    (!providerPreference ||
      providerPreference === "openai-compatible" ||
      providerPreference === "athenai")
  ) {
    const modelId =
      process.env.OPENAI_CHAT_MODEL?.trim() ??
      stripOpenAIProviderPrefix(requestedModelId) ??
      DEFAULT_OPENAI_MODEL
    const provider = createOpenAI({
      apiKey: openAIKey,
      baseURL: openAIBaseURL,
      headers: {
        "User-Agent": process.env.ATHENAI_USER_AGENT?.trim() || APP_USER_AGENT,
      },
      name: process.env.OPENAI_PROVIDER_NAME?.trim() || "athenai",
    })

    return {
      model: provider(modelId),
      modelId,
      providerLabel: process.env.OPENAI_PROVIDER_LABEL || "AthenaAI Gateway",
    }
  }

  if (openAIKey && (!providerPreference || providerPreference === "openai")) {
    const modelId =
      process.env.OPENAI_CHAT_MODEL?.trim() ??
      stripOpenAIProviderPrefix(requestedModelId) ??
      DEFAULT_OPENAI_MODEL

    return {
      model: openai(modelId),
      modelId,
      providerLabel: "OpenAI",
    }
  }

  throw new MissingAIConfigurationError()
}

function stripOpenAIProviderPrefix(modelId?: string) {
  if (!modelId) {
    return undefined
  }

  return modelId.startsWith("openai/")
    ? modelId.slice("openai/".length)
    : modelId
}
