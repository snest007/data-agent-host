"use client"

import { usePathname, useRouter } from "next/navigation"
import { Fragment, useState, type ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  WorkspaceProvider,
  useWorkspace,
} from "@/components/workspace-provider"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { appRoutes, getRouteByPath } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import type { WorkspaceSession } from "@/lib/workspace-mock"
import {
  BarChart3Icon,
  ChevronRightIcon,
  EllipsisIcon,
  FileTextIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  SaveIcon,
} from "lucide-react"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <AppShellContent>{children}</AppShellContent>
    </WorkspaceProvider>
  )
}

function AppShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const workspace = useWorkspace()
  const route = workspace.getRouteByPath(pathname) ?? getRouteByPath(pathname)
  const currentSession = getSessionFromPath(pathname, workspace)
  const shouldHideBreadcrumb = pathname === appRoutes.newSession.path
  const [artifactSessionId, setArtifactSessionId] = useState<string | null>(
    null
  )
  const isArtifactOpen = currentSession?.id === artifactSessionId

  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-hidden border border-border">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            {currentSession ? (
              <SessionHeaderTitle session={currentSession} />
            ) : shouldHideBreadcrumb ? null : (
              <Breadcrumb>
                <BreadcrumbList>
                  {route.breadcrumbs.map((item, index) => {
                    const isLast = index === route.breadcrumbs.length - 1

                    return (
                      <Fragment key={`${item}-${index}`}>
                        {index > 0 ? (
                          <BreadcrumbSeparator className="hidden md:block" />
                        ) : null}
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{item}</BreadcrumbPage>
                          ) : (
                            <span>{item}</span>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          {currentSession ? (
            <SessionHeaderActions
              isArtifactOpen={isArtifactOpen}
              session={currentSession}
              onArtifactOpenChange={(isOpen) =>
                setArtifactSessionId(isOpen ? currentSession.id : null)
              }
            />
          ) : null}
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {currentSession ? (
            <div
              className={
                isArtifactOpen
                  ? "grid min-h-0 flex-1 grid-cols-[minmax(0,3fr)_minmax(0,7fr)] transition-[grid-template-columns] duration-300 ease-out"
                  : "grid min-h-0 flex-1 grid-cols-[minmax(0,10fr)_minmax(0,0fr)] transition-[grid-template-columns] duration-300 ease-out"
              }
            >
              <div className="flex min-h-0 min-w-0 flex-col overflow-hidden p-4">
                {children}
              </div>
              <div className="min-h-0 min-w-0 overflow-hidden">
                <SessionArtifactPanel
                  isOpen={isArtifactOpen}
                  session={currentSession}
                />
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function SessionHeaderActions({
  isArtifactOpen,
  onArtifactOpenChange,
  session,
}: {
  isArtifactOpen: boolean
  onArtifactOpenChange: (isOpen: boolean) => void
  session: WorkspaceSession
}) {
  const router = useRouter()
  const { saveTemporarySession } = useWorkspace()

  function handleSaveTemporarySession() {
    const savedSession = saveTemporarySession(session.id)

    if (savedSession?.projectId) {
      router.push(
        `/assets/my/${savedSession.projectId}/${savedSession.routeSegment}`
      )
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      {session.isTemporary ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="保存为数据资产"
                onClick={handleSaveTemporarySession}
              />
            }
          >
            <SaveIcon />
          </TooltipTrigger>
          <TooltipContent>保存为数据资产</TooltipContent>
        </Tooltip>
      ) : null}

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={
                isArtifactOpen ? "关闭 Artifacts 面板" : "打开 Artifacts 面板"
              }
              aria-pressed={isArtifactOpen}
              onClick={() => onArtifactOpenChange(!isArtifactOpen)}
            />
          }
        >
          {isArtifactOpen ? <PanelRightCloseIcon /> : <PanelRightOpenIcon />}
        </TooltipTrigger>
        <TooltipContent>
          {isArtifactOpen ? "关闭 Artifacts 面板" : "打开 Artifacts 面板"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function SessionArtifactPanel({
  isOpen,
  session,
}: {
  isOpen: boolean
  session: WorkspaceSession
}) {
  const [activeTab, setActiveTab] = useState<ArtifactTabId>("table")
  const [activeProcessTab, setActiveProcessTab] =
    useState<ArtifactProcessTabId>("flow")
  const artifact = getArtifactContent(session)

  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={
        isOpen
          ? "flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-l border-border bg-background opacity-100 transition-[opacity,transform] duration-300 ease-out"
          : "pointer-events-none flex h-full min-h-0 min-w-0 translate-x-4 flex-col overflow-hidden border-l border-border bg-background opacity-0 transition-[opacity,transform] duration-300 ease-out"
      }
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2">
          <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
          <h2 className="truncate text-sm font-medium">Artifacts</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Artifacts 操作"
              />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuGroup>
              <DropdownMenuItem>下载明细表</DropdownMenuItem>
              <DropdownMenuItem>复制结果摘要</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <section className="rounded-xl border border-border bg-background p-1 shadow-sm">
            <div className="grid grid-cols-2 gap-1">
              {artifactTabs.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon

                return (
                  <Button
                    key={tab.id}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "h-10 justify-start gap-2 rounded-lg px-3 text-sm font-medium",
                      isActive
                        ? "bg-foreground text-background hover:bg-foreground hover:text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>
          </section>

          {activeTab === "table" ? (
            <div className="grid gap-4">
              <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                <div className="border-b border-border px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-medium">明细表预览</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {artifact.table.caption}
                      </p>
                    </div>
                    <Badge variant="outline">
                      共 {artifact.table.rows.length} 行示意数据
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {artifact.table.filters.map((filter) => (
                      <Badge
                        key={filter}
                        variant="outline"
                        className="font-normal"
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="overflow-auto p-2">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow>
                        {artifact.table.columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {artifact.table.rows.map((row, rowIndex) => (
                        <TableRow key={`${artifact.title}-${rowIndex}`}>
                          {artifact.table.columns.map((column, columnIndex) => (
                            <TableCell
                              key={`${rowIndex}-${column}`}
                              className={cn(
                                columnIndex === 0 ? "font-medium" : undefined,
                                column === "风险级别" || column === "状态"
                                  ? "text-foreground"
                                  : undefined
                              )}
                            >
                              {row[column]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium">数据处理过程</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      展示这份表格在生成前的主要整理步骤，方便继续追问口径和处理规则。
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-1">
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: "flow", label: "数据流转" },
                        { id: "rules", label: "处理规则" },
                        { id: "sql", label: "SQL" },
                      ].map((item) => (
                        <Button
                          key={item.id}
                          type="button"
                          variant="ghost"
                          className={cn(
                            "h-9 rounded-md px-3 text-sm",
                            activeProcessTab === item.id
                              ? "bg-background text-foreground shadow-sm hover:bg-background"
                              : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                          )}
                          onClick={() =>
                            setActiveProcessTab(
                              item.id as ArtifactProcessTabId
                            )
                          }
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                {activeProcessTab === "flow" ? (
                  <div className="mt-4 grid gap-3">
                    {artifact.process.flow.map((step, index) => {
                      const preview = getArtifactFlowPreview(artifact, index)

                      return (
                        <div
                          key={`${artifact.title}-flow-${step.title}`}
                          className="rounded-lg border border-border bg-muted/20 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
                                步骤 {index + 1}
                              </span>
                              <h5 className="text-sm font-medium">
                                {step.title}
                              </h5>
                            </div>
                            <Badge variant="outline" className="font-normal">
                              {preview.label}
                            </Badge>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {step.detail}
                          </p>
                          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background">
                            <div className="overflow-auto">
                              <Table className="text-xs">
                                <TableHeader>
                                  <TableRow>
                                    {preview.columns.map((column) => (
                                      <TableHead key={column}>{column}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {preview.rows.map((row, rowIndex) => (
                                    <TableRow
                                      key={`${step.title}-${rowIndex}`}
                                      className="odd:bg-muted/20"
                                    >
                                      {preview.columns.map((column, columnIndex) => (
                                        <TableCell
                                          key={`${rowIndex}-${column}`}
                                          className={cn(
                                            columnIndex === 0
                                              ? "font-medium"
                                              : undefined
                                          )}
                                        >
                                          {row[column]}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          {index < artifact.process.flow.length - 1 ? (
                            <div className="mt-3 flex items-center justify-center text-muted-foreground">
                              <ChevronRightIcon className="size-4 rotate-90" />
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
                {activeProcessTab === "rules" ? (
                  <div className="mt-4 space-y-3">
                    {artifact.process.rules.map((rule, index) => (
                      <div
                        key={`${artifact.title}-rule-${rule.title}`}
                        className="rounded-lg border border-border bg-muted/20 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
                            规则 {index + 1}
                          </span>
                          <h5 className="text-sm font-medium">{rule.title}</h5>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {rule.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {activeProcessTab === "sql" ? (
                  <pre className="mt-4 overflow-auto rounded-lg border border-border bg-muted/20 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    <code>{artifact.process.sql}</code>
                  </pre>
                ) : null}
              </section>
            </div>
          ) : (
            <div className="grid gap-4">
              <section className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium">图示表达</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      用轻量表达先给出结构和重点，方便继续追问。
                    </p>
                  </div>
                  <Badge variant="outline">{artifact.visual.chartLabel}</Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {artifact.visual.series.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-foreground transition-[width] duration-300"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <h4 className="text-sm font-medium">关键结论</h4>
                  <div className="mt-3 space-y-3">
                    {artifact.visual.insights.map((insight) => (
                      <div
                        key={insight}
                        className="rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm leading-6 text-muted-foreground"
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <h4 className="text-sm font-medium">结构占比</h4>
                  <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3">
                    <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                      {artifact.visual.distribution.map((item) => (
                        <div
                          key={item.label}
                          className={cn(
                            "h-full",
                            item.tone === "primary" && "bg-foreground",
                            item.tone === "secondary" && "bg-muted-foreground/70",
                            item.tone === "tertiary" && "bg-muted-foreground/35"
                          )}
                          style={{ width: `${item.percent}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      {artifact.visual.distribution.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-2.5 rounded-full",
                                item.tone === "primary" && "bg-foreground",
                                item.tone === "secondary" &&
                                  "bg-muted-foreground/70",
                                item.tone === "tertiary" &&
                                  "bg-muted-foreground/35"
                              )}
                            />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {item.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

function SessionHeaderTitle({ session }: { session: WorkspaceSession }) {
  const router = useRouter()
  const { deleteSession, getProject, renameSession } = useWorkspace()
  const project = session.projectId ? getProject(session.projectId) : undefined
  const parentTitle = session.isTemporary
    ? "临时会话"
    : (project?.title ?? "项目会话")

  function handleRename() {
    const nextTitle = window.prompt("重命名会话", session.title)

    if (nextTitle === null) {
      return
    }

    renameSession(session.id, nextTitle)
  }

  function handleDelete() {
    deleteSession(session.id)
    router.replace(appRoutes.newSession.path)
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="truncate text-sm font-normal text-muted-foreground">
        {parentTitle}
      </span>
      <ChevronRightIcon className="size-3 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 items-center gap-1">
        <h1 className="truncate text-sm font-normal tracking-normal">
          {session.title}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`${session.title} 操作`}
                className="shrink-0"
              />
            }
          >
            <EllipsisIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-28">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleRename}>重命名</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                删除
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function getSessionFromPath(
  pathname: string,
  workspace: ReturnType<typeof useWorkspace>
) {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodePathSegment(segment))

  if (segments[0] === "sessions" && segments[1] && segments[1] !== "new") {
    return workspace.getSessionByRoute(segments[1])
  }

  if (segments[0] === "assets" && segments[1] === "my" && segments[3]) {
    return workspace.getSessionByRoute(segments[3], segments[2])
  }

  return undefined
}

function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

type ArtifactTabId = "table" | "visual"
type ArtifactProcessTabId = "flow" | "rules" | "sql"

type ArtifactMetric = {
  label: string
  value: string
  helper: string
}

type ArtifactTable = {
  caption: string
  filters: string[]
  columns: string[]
  rows: Record<string, string>[]
}

type ArtifactVisual = {
  chartLabel: string
  insights: string[]
  series: { label: string; value: string; percent: number }[]
  distribution: {
    label: string
    percent: number
    tone: "primary" | "secondary" | "tertiary"
  }[]
}

type ArtifactProcessStep = {
  title: string
  detail: string
}

type ArtifactProcess = {
  flow: ArtifactProcessStep[]
  rules: ArtifactProcessStep[]
  sql: string
}

type ArtifactContent = {
  scopeLabel: string
  title: string
  description: string
  metrics: ArtifactMetric[]
  table: ArtifactTable
  visual: ArtifactVisual
  process: ArtifactProcess
}

const artifactTabs: {
  id: ArtifactTabId
  label: string
  icon: typeof LayoutListIcon
}[] = [
  {
    id: "table",
    label: "数据表格",
    icon: LayoutListIcon,
  },
  {
    id: "visual",
    label: "图示表达",
    icon: BarChart3Icon,
  },
]

const fundsArtifact = createArtifact({
  scopeLabel: "资金余额",
  title: "主体资金余额结果明细",
  description:
    "围绕主体、币种、可用余额、冻结余额和日环比，提供可继续追问的明细表和结构表达。",
  metrics: [
    { label: "结果行数", value: "4 行", helper: "按主体维度拆分展示" },
    { label: "核心字段", value: "6 个", helper: "余额、冻结、环比、更新时间" },
    { label: "优先关注", value: "2 个主体", helper: "负向环比或冻结金额偏高" },
  ],
  table: {
    caption: "结果已按主体维度整理，可继续追加阈值、负责人或账户明细。",
    filters: ["日期：今日", "维度：主体 / 币种", "排序：余额降序"],
    columns: ["主体", "币种", "可用余额", "冻结余额", "日环比", "更新时间"],
    rows: [
      ["主体 A", "CNY", "1284.0 万", "32.0 万", "+2.4%", "10:30"],
      ["主体 B", "USD", "192.5 万", "8.0 万", "-0.8%", "10:28"],
      ["主体 C", "CNY", "851.2 万", "0.0", "+0.6%", "10:25"],
      ["主体 D", "HKD", "324.1 万", "12.0 万", "-1.1%", "10:21"],
    ],
  },
  visual: {
    chartLabel: "余额对比",
    insights: [
      "主体 A 是当前主要资金承载主体，适合继续追问账户构成和最近大额变动。",
      "主体 B 与主体 D 均出现负向环比，建议进一步拆解冻结金额和变动原因。",
      "主体 C 状态稳定，可作为正常样本对比异常主体。",
    ],
    series: [
      { label: "主体 A", value: "1284.0 万", percent: 100 },
      { label: "主体 C", value: "851.2 万", percent: 66 },
      { label: "主体 D", value: "324.1 万", percent: 25 },
      { label: "主体 B", value: "192.5 万", percent: 15 },
    ],
    distribution: [
      { label: "正常", percent: 58, tone: "primary" },
      { label: "需关注", percent: 27, tone: "secondary" },
      { label: "高风险", percent: 15, tone: "tertiary" },
    ],
  },
})

const requirementsOverdueArtifact = createArtifact({
  scopeLabel: "需求明细",
  title: "高优需求超期定位",
  description:
    "聚焦 P0/P1 超期未闭环记录，按负责人汇总并突出等待时间较长的异常需求。",
  metrics: [
    { label: "异常记录", value: "18 条", helper: "P0 / P1 超期未闭环" },
    { label: "负责人", value: "4 组", helper: "A / B / C 组及未分配" },
    { label: "最长等待", value: "11 天", helper: "建议优先处理未分配记录" },
  ],
  table: {
    caption: "这份明细已经对齐超期和未闭环口径，适合继续让 Agent 汇总到负责人或原因分类。",
    filters: ["优先级：P0 / P1", "状态：未闭环", "排序：等待时长降序"],
    columns: ["需求单ID", "需求标题", "负责人", "阻塞原因", "状态", "已等待"],
    rows: [
      ["REQ-1165", "异常记录回溯", "未分配", "权限审批", "未闭环", "11 天"],
      ["REQ-1032", "高优需求超期定位", "A 组", "数据接入", "处理中", "9 天"],
      ["REQ-1191", "重复提交识别", "B 组", "口径确认", "待确认", "8 天"],
      ["REQ-1098", "来源占比复盘", "B 组", "数据准备", "待确认", "7 天"],
      ["REQ-1143", "负责人待办排行", "C 组", "开发排期", "处理中", "6 天"],
    ],
  },
  visual: {
    chartLabel: "负责人分布",
    insights: [
      "A 组和 B 组承接了最多高优需求，适合继续按阻塞原因做二次拆分。",
      "未分配记录数量少但等待时间最长，建议单独跟踪。",
      "当前卡点主要集中在数据接入、权限审批和口径确认。",
    ],
    series: [
      { label: "A 组", value: "7 条", percent: 100 },
      { label: "B 组", value: "5 条", percent: 72 },
      { label: "C 组", value: "3 条", percent: 42 },
      { label: "未分配", value: "1 条", percent: 18 },
    ],
    distribution: [
      { label: "处理中", percent: 46, tone: "primary" },
      { label: "待确认", percent: 34, tone: "secondary" },
      { label: "未闭环", percent: 20, tone: "tertiary" },
    ],
  },
  process: {
    flow: [
      ["筛选高优未闭环需求", "先按 P0/P1 优先级与未闭环状态过滤需求记录，只保留当前需要跟进的范围。"],
      ["补充负责人和阻塞原因", "关联负责人字段与阻塞原因标签，便于后续按人和问题类型继续汇总。"],
      ["按等待时间排序输出", "计算等待时长后按降序整理结果，优先暴露等待时间最长的异常需求。"],
    ],
    rules: [
      ["超期口径", "以当前日期减去最近有效推进时间计算等待时长，超过阈值视为超期。"],
      ["未闭环规则", "状态为处理中、待确认、未闭环的需求均纳入当前结果。"],
      ["异常优先级", "未分配、等待时间长、阻塞原因为权限或口径问题的记录优先展示。"],
    ],
    sql: [
      "-- 高优需求超期定位",
      "SELECT",
      "  demand_id,",
      "  demand_title,",
      "  owner_group,",
      "  blocker_reason,",
      "  current_status,",
      "  DATEDIFF(CURRENT_DATE, last_progress_date) AS waiting_days",
      "FROM requirement_detail",
      "WHERE priority IN ('P0', 'P1')",
      "  AND current_status IN ('处理中', '待确认', '未闭环')",
      "  AND DATEDIFF(CURRENT_DATE, last_progress_date) >= 5",
      "ORDER BY waiting_days DESC;",
    ].join("\n"),
  },
})

const requirementsSourceArtifact = createArtifact({
  scopeLabel: "需求明细",
  title: "需求来源占比",
  description:
    "按本月来源维度整理需求量和环比变化，支持继续追问增长最快来源的明细。",
  metrics: [
    { label: "来源类型", value: "4 类", helper: "业务运营、财务分析、项目管理、其他" },
    { label: "增长最快", value: "财务分析", helper: "环比提升 9 个百分点" },
    { label: "总需求量", value: "84 条", helper: "本月 mock 汇总" },
  ],
  table: {
    caption: "可以继续要求展开某一来源下的具体需求列表，或按周拆趋势。",
    filters: ["时间：本月", "视角：需求来源", "排序：占比降序"],
    columns: ["来源", "需求数", "占比", "环比变化", "主要类型", "状态"],
    rows: [
      ["业务运营", "35", "42%", "+3pp", "数据看板 / 复盘", "稳定"],
      ["财务分析", "24", "28%", "+9pp", "经营分析 / 对账", "增长最快"],
      ["项目管理", "15", "18%", "-2pp", "进度 / 执行", "稳定"],
      ["其他", "10", "12%", "-1pp", "零散需求", "波动较小"],
    ],
  },
  visual: {
    chartLabel: "来源占比",
    insights: [
      "业务运营仍是需求主来源，但增速不如财务分析。",
      "财务分析来源增长最快，适合继续追问新增需求集中在哪些模块。",
      "项目管理占比稳定，可作为基线来源看长期变化。",
    ],
    series: [
      { label: "业务运营", value: "42%", percent: 100 },
      { label: "财务分析", value: "28%", percent: 67 },
      { label: "项目管理", value: "18%", percent: 43 },
      { label: "其他", value: "12%", percent: 29 },
    ],
    distribution: [
      { label: "业务运营", percent: 42, tone: "primary" },
      { label: "财务分析", percent: 28, tone: "secondary" },
      { label: "其他来源", percent: 30, tone: "tertiary" },
    ],
  },
})

const requirementsOwnerArtifact = createArtifact({
  scopeLabel: "需求明细",
  title: "负责人待办排行",
  description:
    "按负责人聚合待处理需求数、平均等待天数和最早创建时间，突出高等待负责人。",
  metrics: [
    { label: "负责人", value: "5 位", helper: "当前待办已聚合到负责人维度" },
    { label: "高等待", value: "2 位", helper: "平均等待超过 6 天" },
    { label: "最长待办", value: "11 天", helper: "建议作为自动提醒阈值" },
  ],
  table: {
    caption: "这份结果适合继续要求按负责人展开具体需求，或只保留等待时间大于 5 天的记录。",
    filters: ["状态：待处理", "排序：平均等待天数降序", "范围：本月"],
    columns: ["负责人", "待处理需求数", "平均等待", "最早创建", "高优需求", "状态"],
    rows: [
      ["A 组", "7", "6.8 天", "05-02", "3", "需关注"],
      ["B 组", "5", "6.1 天", "05-03", "2", "需关注"],
      ["C 组", "4", "4.9 天", "05-05", "1", "稳定"],
      ["D 组", "3", "3.4 天", "05-06", "1", "稳定"],
      ["未分配", "1", "11.0 天", "05-01", "1", "异常"],
    ],
  },
  visual: {
    chartLabel: "等待时长对比",
    insights: [
      "A 组和 B 组的待办规模最大，适合继续看高优需求分布。",
      "未分配虽只有 1 条，但等待时间极长，应单独处理。",
      "当前提醒阈值可先设为平均等待超过 5 天。",
    ],
    series: [
      { label: "未分配", value: "11.0 天", percent: 100 },
      { label: "A 组", value: "6.8 天", percent: 62 },
      { label: "B 组", value: "6.1 天", percent: 55 },
      { label: "C 组", value: "4.9 天", percent: 45 },
      { label: "D 组", value: "3.4 天", percent: 31 },
    ],
    distribution: [
      { label: "超过 6 天", percent: 43, tone: "primary" },
      { label: "3-6 天", percent: 37, tone: "secondary" },
      { label: "3 天内", percent: 20, tone: "tertiary" },
    ],
  },
})

const budgetConversionArtifact = createArtifact({
  scopeLabel: "预算漏斗",
  title: "预算漏斗转化分析",
  description:
    "展示申请、审批、冻结、消耗四个阶段的转化情况，并保留关键阶段明细。",
  metrics: [
    { label: "关键阶段", value: "4 段", helper: "申请、审批、冻结、消耗" },
    { label: "最终转化", value: "51%", helper: "申请到实际消耗" },
    { label: "最大流失", value: "审批到冻结", helper: "当前最主要损耗段" },
  ],
  table: {
    caption: "如果你继续追问，可以再把每个阶段拆到渠道或预算单明细。",
    filters: ["范围：本月", "视角：漏斗阶段", "排序：阶段顺序"],
    columns: ["阶段", "预算单数", "金额", "转化率", "主要损耗", "状态"],
    rows: [
      ["申请", "126", "1280 万", "100%", "-", "起点"],
      ["审批通过", "96", "1024 万", "76%", "审批驳回", "正常"],
      ["冻结成功", "79", "836 万", "63%", "冻结未执行", "需关注"],
      ["实际消耗", "65", "654 万", "51%", "释放和核销偏慢", "需跟进"],
    ],
  },
  visual: {
    chartLabel: "阶段转化",
    insights: [
      "审批到冻结阶段流失最大，说明执行环节是主要问题点。",
      "冻结成功率虽然不低，但释放和核销速度仍影响最终消耗。",
      "后续适合继续让 Agent 追加驳回原因或冻结说明字段。",
    ],
    series: [
      { label: "申请", value: "100%", percent: 100 },
      { label: "审批通过", value: "76%", percent: 76 },
      { label: "冻结成功", value: "63%", percent: 63 },
      { label: "实际消耗", value: "51%", percent: 51 },
    ],
    distribution: [
      { label: "已转化", percent: 51, tone: "primary" },
      { label: "阶段损耗", percent: 32, tone: "secondary" },
      { label: "待处理", percent: 17, tone: "tertiary" },
    ],
  },
})

const budgetFreezeArtifact = createArtifact({
  scopeLabel: "预算漏斗",
  title: "冻结预算原因追踪",
  description:
    "聚焦冻结超过 14 天仍未释放或消耗的预算记录，适合继续按金额或渠道展开追踪。",
  metrics: [
    { label: "异常笔数", value: "23 笔", helper: "冻结超过 14 天" },
    { label: "高金额", value: "3 笔", helper: "单笔金额超过 120 万" },
    { label: "集中场景", value: "渠道投放", helper: "当前金额占比最高" },
  ],
  table: {
    caption: "建议优先人工复核金额较大和冻结时间较长的预算单。",
    filters: ["状态：冻结 / 待释放", "时长：>14 天", "排序：金额降序"],
    columns: ["预算单号", "渠道", "申请金额", "当前阶段", "冻结时长", "风险级别"],
    rows: [
      ["BDG-021", "渠道 C", "280 万", "冻结中", "19 天", "高"],
      ["BDG-034", "渠道 F", "164 万", "待释放", "16 天", "高"],
      ["BDG-039", "渠道 H", "122 万", "冻结中", "15 天", "中"],
      ["BDG-041", "渠道 A", "96 万", "审批通过", "14 天", "低"],
    ],
  },
  visual: {
    chartLabel: "风险结构",
    insights: [
      "渠道 C 金额最高且冻结最久，适合优先展开单笔追踪。",
      "待释放记录占比较高，说明预算并非没有通过，而是释放和核销偏慢。",
      "继续追问时可以让 Agent 按联运、投放、结算场景分组。",
    ],
    series: [
      { label: "渠道 C", value: "280 万", percent: 100 },
      { label: "渠道 F", value: "164 万", percent: 58 },
      { label: "渠道 H", value: "122 万", percent: 44 },
      { label: "渠道 A", value: "96 万", percent: 34 },
    ],
    distribution: [
      { label: "高风险", percent: 48, tone: "primary" },
      { label: "中风险", percent: 31, tone: "secondary" },
      { label: "低风险", percent: 21, tone: "tertiary" },
    ],
  },
})

const budgetWarningArtifact = createArtifact({
  scopeLabel: "预算漏斗",
  title: "渠道预算消耗预警",
  description:
    "找出消耗进度低于计划 20% 的渠道，方便继续补充渠道负责人和原因说明。",
  metrics: [
    { label: "预警渠道", value: "3 个", helper: "当前低于计划 20%" },
    { label: "最大偏差", value: "渠道 C", helper: "预算大且启动晚" },
    { label: "建议动作", value: "拆原因", helper: "区分启动晚和转化低" },
  ],
  table: {
    caption: "适合继续按渠道展开预算单明细，或让 Agent 输出预警邮件摘要。",
    filters: ["范围：本月", "规则：低于计划 20%", "排序：偏差绝对值降序"],
    columns: ["渠道", "计划进度", "实际进度", "偏差", "预算规模", "状态"],
    rows: [
      ["渠道 C", "65%", "38%", "-27pp", "高", "预警"],
      ["渠道 F", "54%", "31%", "-23pp", "中", "预警"],
      ["渠道 H", "49%", "28%", "-21pp", "中", "预警"],
      ["渠道 A", "52%", "47%", "-5pp", "低", "正常"],
    ],
  },
  visual: {
    chartLabel: "渠道进度差异",
    insights: [
      "渠道 C 预算规模最大，但实际消耗明显落后计划，应优先排查。",
      "渠道 F 和 H 也存在明显偏差，适合继续看启动时间和转化表现。",
      "正常渠道可以作为对比样本，辅助判断问题来自节奏还是效果。",
    ],
    series: [
      { label: "渠道 C", value: "-27pp", percent: 100 },
      { label: "渠道 F", value: "-23pp", percent: 85 },
      { label: "渠道 H", value: "-21pp", percent: 78 },
      { label: "渠道 A", value: "-5pp", percent: 18 },
    ],
    distribution: [
      { label: "严重预警", percent: 41, tone: "primary" },
      { label: "中度预警", percent: 34, tone: "secondary" },
      { label: "正常", percent: 25, tone: "tertiary" },
    ],
  },
})

const executionSlaArtifact = createArtifact({
  scopeLabel: "执行情况",
  title: "需求单执行 SLA",
  description:
    "按部门整理创建到完成的 SLA 达成情况，突出达成率偏低的部门。",
  metrics: [
    { label: "整体达成率", value: "83%", helper: "本期 mock 汇总" },
    { label: "最低部门", value: "数据平台", helper: "当前主要受权限等待影响" },
    { label: "对比部门", value: "4 个", helper: "可继续展开部门明细" },
  ],
  table: {
    caption: "如果继续追问，可以把低 SLA 部门再拆到具体阻塞需求。",
    filters: ["时间：本月", "指标：SLA 达成率", "排序：达成率升序"],
    columns: ["部门", "总单量", "SLA 达成率", "平均耗时", "主要原因", "状态"],
    rows: [
      ["数据平台", "42", "72%", "6.2 天", "权限等待", "需关注"],
      ["项目管理", "27", "79%", "5.4 天", "口径确认", "需关注"],
      ["研发支持", "38", "84%", "4.8 天", "排期冲突", "稳定"],
      ["财务分析", "33", "91%", "3.6 天", "少量返工", "良好"],
    ],
  },
  visual: {
    chartLabel: "达成率对比",
    insights: [
      "数据平台达成率最低，适合继续追问具体卡在哪些权限或上游表。",
      "财务分析达成率最高，可以作为处理流程的对照组。",
      "当前两类主要问题是权限等待和口径确认。",
    ],
    series: [
      { label: "财务分析", value: "91%", percent: 91 },
      { label: "研发支持", value: "84%", percent: 84 },
      { label: "项目管理", value: "79%", percent: 79 },
      { label: "数据平台", value: "72%", percent: 72 },
    ],
    distribution: [
      { label: "达标", percent: 83, tone: "primary" },
      { label: "临界", percent: 11, tone: "secondary" },
      { label: "未达标", percent: 6, tone: "tertiary" },
    ],
  },
})

const executionCompletionArtifact = createArtifact({
  scopeLabel: "执行情况",
  title: "部门完成率对比",
  description:
    "整理各部门完成率、进行中数量和阻塞数量，适合继续生成部门复盘摘要。",
  metrics: [
    { label: "完成率最高", value: "财务分析 91%", helper: "当前表现最佳" },
    { label: "阻塞最高", value: "数据平台 8 条", helper: "需继续拆阻塞原因" },
    { label: "进行中", value: "25 条", helper: "跨部门累计进行中数量" },
  ],
  table: {
    caption: "继续追问时，可以让 Agent 只保留阻塞高的部门，或按负责人展开。",
    filters: ["时间：本月", "视角：部门", "排序：完成率升序"],
    columns: ["部门", "总单量", "完成率", "进行中", "阻塞数", "状态"],
    rows: [
      ["数据平台", "42", "72%", "10", "8", "需关注"],
      ["项目管理", "27", "79%", "5", "3", "需关注"],
      ["研发支持", "38", "84%", "7", "4", "稳定"],
      ["财务分析", "33", "91%", "3", "1", "良好"],
    ],
  },
  visual: {
    chartLabel: "完成率对比",
    insights: [
      "数据平台完成率最低，同时阻塞数量最高，建议作为重点部门继续分析。",
      "项目管理也存在一定积压，但波动不如数据平台明显。",
      "财务分析团队可以作为高完成率样本进行流程对照。",
    ],
    series: [
      { label: "财务分析", value: "91%", percent: 91 },
      { label: "研发支持", value: "84%", percent: 84 },
      { label: "项目管理", value: "79%", percent: 79 },
      { label: "数据平台", value: "72%", percent: 72 },
    ],
    distribution: [
      { label: "已完成", percent: 83, tone: "primary" },
      { label: "进行中", percent: 11, tone: "secondary" },
      { label: "阻塞中", percent: 6, tone: "tertiary" },
    ],
  },
})

const executionBlockArtifact = createArtifact({
  scopeLabel: "执行情况",
  title: "阻塞原因归类",
  description:
    "将阻塞中的需求单按原因归类，并保留可继续追问的原因占比与建议方向。",
  metrics: [
    { label: "阻塞总量", value: "31 条", helper: "当前处于阻塞状态的需求单" },
    { label: "最高原因", value: "权限等待", helper: "占比 38%" },
    { label: "建议动作", value: "权限同步", helper: "适合接到 MCP 权限流" },
  ],
  table: {
    caption: "这份结果可以继续按原因展开具体需求清单，或者直接转成处理建议。",
    filters: ["状态：阻塞中", "视角：原因分类", "排序：占比降序"],
    columns: ["阻塞原因", "需求数", "占比", "典型场景", "建议动作", "状态"],
    rows: [
      ["权限等待", "12", "38%", "上游表开通", "同步权限申请", "优先处理"],
      ["口径未确认", "8", "27%", "指标口径反复确认", "补充 owner", "持续跟进"],
      ["排期冲突", "6", "21%", "开发资源不足", "重新排期", "可协调"],
      ["数据缺失", "5", "14%", "源表字段不全", "补齐数据", "待确认"],
    ],
  },
  visual: {
    chartLabel: "阻塞结构",
    insights: [
      "权限等待是最主要的阻塞原因，适合优先接入自动化流程。",
      "口径未确认比例也不低，说明前置定义和 owner 同步仍需加强。",
      "如果继续追问，可以把每类阻塞再拆到具体部门或需求单。",
    ],
    series: [
      { label: "权限等待", value: "38%", percent: 100 },
      { label: "口径未确认", value: "27%", percent: 71 },
      { label: "排期冲突", value: "21%", percent: 55 },
      { label: "数据缺失", value: "14%", percent: 37 },
    ],
    distribution: [
      { label: "权限等待", percent: 38, tone: "primary" },
      { label: "口径 / 排期", percent: 48, tone: "secondary" },
      { label: "数据缺失", percent: 14, tone: "tertiary" },
    ],
  },
})

function getArtifactContent(session: WorkspaceSession): ArtifactContent {
  const normalizedPrompt = getFirstMessageText(session, "user")

  if (hasKeyword(normalizedPrompt, ["资金", "余额"])) {
    return fundsArtifact
  }

  if (hasKeyword(normalizedPrompt, ["超期", "未闭环"])) {
    return requirementsOverdueArtifact
  }

  if (hasKeyword(normalizedPrompt, ["来源占比", "增长最快"])) {
    return requirementsSourceArtifact
  }

  if (hasKeyword(normalizedPrompt, ["负责人", "待处理"])) {
    return requirementsOwnerArtifact
  }

  if (hasKeyword(normalizedPrompt, ["转化率", "审批", "冻结"])) {
    return budgetConversionArtifact
  }

  if (hasKeyword(normalizedPrompt, ["冻结预算", "未释放", "未消耗"])) {
    return budgetFreezeArtifact
  }

  if (hasKeyword(normalizedPrompt, ["消耗进度", "低于计划"])) {
    return budgetWarningArtifact
  }

  if (hasKeyword(normalizedPrompt, ["SLA", "达成率"])) {
    return executionSlaArtifact
  }

  if (hasKeyword(normalizedPrompt, ["完成率", "阻塞数量"])) {
    return executionCompletionArtifact
  }

  if (hasKeyword(normalizedPrompt, ["阻塞", "归类"])) {
    return executionBlockArtifact
  }

  if (session.projectId === "requirements") {
    return requirementsOverdueArtifact
  }

  if (session.projectId === "budget-funnel") {
    return budgetConversionArtifact
  }

  if (session.projectId === "request-execution") {
    return executionCompletionArtifact
  }

  return fundsArtifact
}

function createArtifact({
  table,
  process,
  ...artifact
}: Omit<ArtifactContent, "table" | "process"> & {
  table: Omit<ArtifactTable, "rows"> & { rows: string[][] }
  process?: {
    flow: Array<ArtifactProcessStep | [string, string]>
    rules: Array<ArtifactProcessStep | [string, string]>
    sql: string
  }
}): ArtifactContent {
  return {
    ...artifact,
    table: {
      ...table,
      rows: table.rows.map((row) =>
        Object.fromEntries(
          table.columns.map((column, index) => [column, row[index] ?? ""])
        )
      ),
    },
    process: {
      flow: (process?.flow ?? createDefaultProcessFlow(artifact.title)).map(
        normalizeProcessStep
      ),
      rules: (process?.rules ?? createDefaultProcessRules(table.filters)).map(
        normalizeProcessStep
      ),
      sql:
        process?.sql ??
        createDefaultProcessSql(artifact.title, table.columns, table.filters),
    },
  }
}

function createDefaultProcessFlow(title: string): [string, string][] {
  return [
    ["提取原始数据", `从与“${title}”相关的明细表中取数，并保留本次分析需要的核心字段。`],
    ["按口径聚合整理", "根据当前问题的筛选条件和分组维度完成聚合、去重和排序。"],
    ["输出结果表格", "将可继续追问的结果字段整理成右侧表格，供后续图示和下钻使用。"],
  ]
}

function createDefaultProcessRules(filters: string[]): [string, string][] {
  return [
    ["筛选条件对齐", `优先使用当前结果上的筛选条件：${filters.join("、")}。`],
    ["同口径计算", "所有占比、环比和聚合指标都按统一时间范围与维度口径计算。"],
    ["结果排序输出", "优先展示风险更高、等待更久或指标波动更明显的记录。"],
  ]
}

function createDefaultProcessSql(
  title: string,
  columns: string[],
  filters: string[]
) {
  const selectColumns = columns
    .map((column) => `  ${toSqlIdentifier(column)}`)
    .join(",\n")
  const filterComment = filters.length
    ? `-- 当前筛选条件：${filters.join("；")}`
    : "-- 当前筛选条件：按默认口径"

  return [
    `-- ${title}`,
    filterComment,
    "SELECT",
    selectColumns,
    "FROM source_dataset",
    "WHERE ds = CURRENT_DATE",
    "ORDER BY 1 ASC;",
  ].join("\n")
}

function getArtifactFlowPreview(artifact: ArtifactContent, index: number) {
  const totalColumns = artifact.table.columns.length
  const totalRows = artifact.table.rows.length
  const columnsByStep = [
    artifact.table.columns.slice(0, Math.min(3, totalColumns)),
    artifact.table.columns.slice(0, Math.min(5, totalColumns)),
    artifact.table.columns,
  ]
  const rowsByStep = [
    artifact.table.rows.slice(0, Math.min(3, totalRows)),
    artifact.table.rows.slice(0, Math.min(4, totalRows)),
    artifact.table.rows.slice(0, Math.min(5, totalRows)),
  ]
  const labels = ["原始筛选", "补充字段", "结果输出"]

  return {
    columns: columnsByStep[index] ?? artifact.table.columns,
    rows: rowsByStep[index] ?? artifact.table.rows,
    label: labels[index] ?? "处理中",
  }
}

function toSqlIdentifier(value: string) {
  return value
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_]/gu, "")
    .toLowerCase()
}

function normalizeProcessStep(
  step: ArtifactProcessStep | [string, string]
): ArtifactProcessStep {
  if (Array.isArray(step)) {
    return { title: step[0], detail: step[1] }
  }

  return step
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.every((keyword) => text.includes(keyword))
}

function getFirstMessageText(
  session: WorkspaceSession,
  role: "user" | "assistant"
) {
  const message = session.messages.find((item) => item.role === role)

  return getMessageText(message) ?? session.title
}

function getMessageText(message: WorkspaceSession["messages"][number] | undefined) {
  const textPart = message?.parts.find((part) => part.type === "text")
  return textPart?.type === "text" ? textPart.text : undefined
}
