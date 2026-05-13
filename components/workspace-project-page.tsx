"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FolderIcon, FolderSymlinkIcon } from "lucide-react"

import { useWorkspace } from "@/components/workspace-provider"

export function WorkspaceProjectPage({ projectId }: { projectId: string }) {
  const router = useRouter()
  const { getProject, getSession, isHydrated } = useWorkspace()
  const project = getProject(projectId)
  const primarySession = project?.sessionIds
    .map((sessionId) => getSession(sessionId))
    .find(Boolean)

  useEffect(() => {
    if (!project || !primarySession) {
      return
    }

    router.replace(`/assets/my/${project.id}/${primarySession.routeSegment}`)
  }, [primarySession, project, router])

  if (!project) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-semibold">
            {isHydrated ? "项目不存在" : "正在加载项目"}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {isHydrated
              ? "这个项目可能已经被删除，或当前 workspace 状态尚未包含它。"
              : "正在读取本地 workspace 状态。"}
          </p>
        </div>
      </section>
    )
  }

  const currentProject = project
  const currentSession = primarySession

  if (currentSession) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-semibold">正在打开数据资产</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            当前 folder 会直接进入它对应的会话。
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {currentProject.isMcpShared ? (
                <FolderSymlinkIcon />
              ) : (
                <FolderIcon />
              )}
              我的数据资产
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {currentProject.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {currentProject.description}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-6">
          <p className="text-sm text-muted-foreground">
            这个 folder 当前没有绑定会话。
          </p>
        </div>
      </div>
    </section>
  )
}

export function WorkspaceProjectsPage() {
  const { getSession, projects } = useWorkspace()

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            我的数据资产
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            保存后的数据资产会以 folder 的形式出现在这里。当前每个
            folder 对应一条会话，结构上保留后续多会话扩展。
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="divide-y divide-border">
            {projects.map((project) => {
              const primarySession = project.sessionIds
                .map((sessionId) => getSession(sessionId))
                .find(Boolean)
              const title = primarySession?.title ?? project.title
              const description = primarySession?.messages.length
                ? (getFirstUserText(primarySession.messages) ??
                  project.description)
                : project.description

              return (
                <Link
                  key={project.id}
                  href={
                    primarySession
                      ? `/assets/my/${project.id}/${primarySession.routeSegment}`
                      : `/assets/my/${project.id}`
                  }
                  className="flex min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                >
                  {project.isMcpShared ? (
                    <FolderSymlinkIcon className="shrink-0 text-muted-foreground" />
                  ) : (
                    <FolderIcon className="shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function getFirstUserText(
  messages: { role: string; parts: { type: string }[] }[]
) {
  const textPart = messages
    .find((message) => message.role === "user")
    ?.parts.find(
      (part): part is { type: "text"; text: string } => part.type === "text"
    )

  return textPart?.text
}
