"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { ArrowUpIcon, PlusIcon, RotateCcwIcon, SquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const defaultModelId = "gpt-5.4"

const promptSuggestions = [
  "帮我查一下今日各主体资金余额，并生成表格",
  "把需求明细里的异常记录找出来",
  "基于预算漏斗数据生成一份执行摘要",
]

export function NewSessionChat() {
  const [input, setInput] = useState("")
  const [sessionId, setSessionId] = useState(() => createSessionId())
  const [visibleError, setVisibleError] = useState<string | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  )

  const {
    clearError,
    error,
    messages,
    sendMessage,
    setMessages,
    status,
    stop,
  } = useChat({
    id: sessionId,
    transport,
    experimental_throttle: 40,
    onError: (chatError) => setVisibleError(chatError.message),
  })

  const isBusy = status === "submitted" || status === "streaming"
  const hasMessages = messages.length > 0
  const trimmedInput = input.trim()
  const currentError = visibleError ?? error?.message ?? null

  useEffect(() => {
    const scrollContainer = messagesRef.current

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages, status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedInput || isBusy) {
      return
    }

    const prompt = trimmedInput
    setInput("")
    setVisibleError(null)
    clearError()

    await sendMessage(
      { text: prompt },
      {
        body: {
          modelId: defaultModelId,
          sessionId,
        },
      }
    )
  }

  async function handleComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  async function handleNewSession() {
    if (isBusy) {
      await stop()
    }

    setInput("")
    setMessages([])
    setVisibleError(null)
    clearError()
    setSessionId(createSessionId())
  }

  function applySuggestion(suggestion: string) {
    setInput(suggestion)
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div
        ref={messagesRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-2",
          hasMessages ? "py-6" : "flex items-center justify-center"
        )}
      >
        {hasMessages ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Data Agent
                </p>
                <h1 className="truncate text-xl font-semibold">
                  新建 Agent 会话
                </h1>
              </div>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleNewSession}
                    />
                  }
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  新会话
                </TooltipTrigger>
                <TooltipContent>清空当前会话并重新开始</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-col gap-5">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {status === "submitted" ? <AssistantThinking /> : null}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 pb-10">
            <h1 className="text-center text-4xl font-semibold tracking-normal text-balance md:text-5xl">
              miHoQuery
            </h1>
            <div className="flex w-full max-w-4xl flex-col gap-3">
              <Composer
                input={input}
                isBusy={isBusy}
                visibleError={currentError}
                onInputChange={setInput}
                onKeyDown={handleComposerKeyDown}
                onSubmit={handleSubmit}
                onStop={stop}
              />
              <div className="flex flex-wrap items-center justify-center gap-2 px-3">
                {promptSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="max-w-full"
                  >
                    <span className="truncate">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {hasMessages ? (
        <div className="bg-background/95 px-2 py-4 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl">
            <Composer
              compact
              input={input}
              isBusy={isBusy}
              visibleError={currentError}
              onInputChange={setInput}
              onKeyDown={handleComposerKeyDown}
              onSubmit={handleSubmit}
              onStop={stop}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}

function Composer({
  compact = false,
  input,
  isBusy,
  visibleError,
  onInputChange,
  onKeyDown,
  onStop,
  onSubmit,
}: {
  compact?: boolean
  input: string
  isBusy: boolean
  visibleError: string | null
  onInputChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onStop: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md",
          compact ? "rounded-xl" : "rounded-2xl"
        )}
      >
        <Textarea
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="我可以帮你查明细数据、生成统计报表、分析业务趋势。告诉我你想了解什么？"
          disabled={isBusy}
          className={cn(
            "max-h-52 min-h-24 resize-none border-0 px-5 pt-5 pb-2 text-base shadow-none focus-visible:ring-0 md:text-base",
            compact && "min-h-16 px-4 pt-4 text-sm md:text-sm"
          )}
        />
        <div className="flex min-h-14 items-center justify-between gap-3 px-4 pb-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="添加上下文"
                  />
                }
              >
                <PlusIcon />
              </TooltipTrigger>
              <TooltipContent>添加文件、数据资产或工具上下文</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            {isBusy ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      size="icon-lg"
                      variant="secondary"
                      aria-label="停止生成"
                      onClick={onStop}
                    />
                  }
                >
                  <SquareIcon />
                </TooltipTrigger>
                <TooltipContent>停止生成</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="submit"
                      size="icon-lg"
                      aria-label="发送"
                      disabled={!input.trim()}
                    />
                  }
                >
                  <ArrowUpIcon />
                </TooltipTrigger>
                <TooltipContent>发送</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {visibleError ? (
        <div className="flex min-h-6 items-center justify-end px-5">
          <p className="truncate text-xs text-destructive">{visibleError}</p>
        </div>
      ) : null}
    </form>
  )
}

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  return (
    <article className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-6",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-card-foreground shadow-sm"
        )}
      >
        <div className="flex flex-col gap-3">
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <p
                  key={`${message.id}-${index}`}
                  className="whitespace-pre-wrap"
                >
                  {part.text}
                </p>
              )
            }

            if (part.type === "reasoning") {
              return (
                <details
                  key={`${message.id}-${index}`}
                  className="text-muted-foreground"
                >
                  <summary className="cursor-pointer text-xs">
                    Reasoning
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap">{part.text}</p>
                </details>
              )
            }

            if (part.type === "source-url") {
              return (
                <a
                  key={`${message.id}-${index}`}
                  href={part.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs underline underline-offset-4"
                >
                  {part.title ?? part.url}
                </a>
              )
            }

            return null
          })}
        </div>
      </div>
    </article>
  )
}

function AssistantThinking() {
  return (
    <article className="flex justify-start">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
        <span className="size-2 animate-pulse rounded-full bg-muted-foreground" />
        <span>Thinking</span>
      </div>
    </article>
  )
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}`
}
