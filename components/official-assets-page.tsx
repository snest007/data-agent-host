"use client"

import { useMemo, useState } from "react"
import {
  ChevronRightIcon,
  DatabaseIcon,
  DownloadIcon,
  EllipsisIcon,
  SearchIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type CategoryId = "all" | "finance" | "growth" | "general"

type AssetRecord = {
  id: string
  name: string
  categoryId: Exclude<CategoryId, "all">
  categoryLabel: string
  groupLabel: string
  topicLabel: string
  refreshLabel: string
  fieldCount: number
  source: string
  status: "已订阅" | "待接入"
  description: string
}

type AssetGroup = {
  id: string
  title: string
  items: { id: string; title: string }[]
}

type CategoryDefinition = {
  id: CategoryId
  title: string
  groups: AssetGroup[]
}

const officialAssets: AssetRecord[] = [
  {
    id: "revenue-overview",
    name: "经营总览模板",
    categoryId: "finance",
    categoryLabel: "财务",
    groupLabel: "经营分析",
    topicLabel: "收入成本",
    refreshLabel: "每日 08:00 更新",
    fieldCount: 6,
    source: "财务中台",
    status: "已订阅",
    description: "围绕收入、成本、ROI 与趋势异动，快速生成可继续追问的数据分析对话。",
  },
  {
    id: "purchase-receipt-detail",
    name: "采购接收单明细-uat",
    categoryId: "finance",
    categoryLabel: "财务",
    groupLabel: "采购核算",
    topicLabel: "验收",
    refreshLabel: "每 30 分钟同步",
    fieldCount: 8,
    source: "采购共享服务",
    status: "已订阅",
    description: "支持按接收单、业务期间、单据状态和入账状态筛选采购验收明细。",
  },
  {
    id: "growth-overview",
    name: "用户增长模板",
    categoryId: "growth",
    categoryLabel: "增长",
    groupLabel: "活动复盘",
    topicLabel: "拉新增长",
    refreshLabel: "每小时同步",
    fieldCount: 5,
    source: "增长分析团队",
    status: "已订阅",
    description: "适合拉新、留存、渠道对比等场景，支持继续让 Agent 改口径或重组视图。",
  },
  {
    id: "project-health",
    name: "项目健康度模板",
    categoryId: "general",
    categoryLabel: "综合",
    groupLabel: "项目管理",
    topicLabel: "项目健康",
    refreshLabel: "实时查询",
    fieldCount: 6,
    source: "PMO",
    status: "待接入",
    description: "聚合任务、风险、预算与里程碑，适合持续跟踪项目推进状态。",
  },
]

const categoryDefinitions: CategoryDefinition[] = [
  {
    id: "all",
    title: "全部数据资产",
    groups: [],
  },
  {
    id: "finance",
    title: "财务",
    groups: [
      {
        id: "finance-ops",
        title: "经营分析",
        items: [{ id: "revenue-overview", title: "经营总览模板" }],
      },
      {
        id: "finance-procurement",
        title: "采购核算",
        items: [{ id: "purchase-receipt-detail", title: "采购接收单明细-uat" }],
      },
    ],
  },
  {
    id: "growth",
    title: "增长",
    groups: [
      {
        id: "growth-review",
        title: "活动复盘",
        items: [{ id: "growth-overview", title: "用户增长模板" }],
      },
    ],
  },
  {
    id: "general",
    title: "综合",
    groups: [
      {
        id: "general-project",
        title: "项目管理",
        items: [{ id: "project-health", title: "项目健康度模板" }],
      },
    ],
  },
]

export function OfficialAssetsPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all")
  const [focusedAssetId, setFocusedAssetId] = useState<string | null>(null)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredAssets = useMemo(() => {
    return officialAssets.filter((asset) => {
      const matchesCategory =
        activeCategory === "all" || asset.categoryId === activeCategory
      const matchesQuery =
        !normalizedQuery ||
        [
          asset.name,
          asset.categoryLabel,
          asset.groupLabel,
          asset.topicLabel,
          asset.refreshLabel,
          asset.source,
          asset.description,
        ].some((value) => value.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, normalizedQuery])

  const highlightedAssetId =
    focusedAssetId && filteredAssets.some((asset) => asset.id === focusedAssetId)
      ? focusedAssetId
      : null

  const subscribedCount = officialAssets.filter(
    (asset) => asset.status === "已订阅"
  ).length

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DatabaseIcon className="size-4" />
            数据中心
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">官方数据资产</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            汇总已沉淀的官方数据资产与模板入口。你可以先按分类或关键词筛选，再从表格中查看资产说明、更新频率和来源系统。
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span>资产总数：{officialAssets.length}</span>
            <span>已订阅：{subscribedCount}</span>
            <span>当前结果：{filteredAssets.length}</span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid min-h-full w-full max-w-7xl grid-cols-1 gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-r border-border px-4 py-6">
            <div className="space-y-4">
              <div className="px-2 text-sm font-medium text-muted-foreground">
                资产分类
              </div>
              <div className="space-y-1">
                {categoryDefinitions.map((category) => {
                  const categoryCount =
                    category.id === "all"
                      ? officialAssets.length
                      : officialAssets.filter(
                          (asset) => asset.categoryId === category.id
                        ).length

                  const isActive = activeCategory === category.id

                  return (
                    <div key={category.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span className="font-medium">{category.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {categoryCount}
                        </span>
                      </button>

                      {category.groups.length > 0 && isActive ? (
                        <div className="space-y-3 border-l border-border pl-4">
                          {category.groups.map((group) => (
                            <div key={group.id} className="space-y-1">
                              <div className="px-2 pt-1 text-sm font-medium text-foreground">
                                {group.title}
                              </div>
                              {group.items.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => setFocusedAssetId(item.id)}
                                  className={cn(
                                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                                    highlightedAssetId === item.id
                                      ? "bg-muted text-foreground"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
                                >
                                  <span className="truncate">{item.title}</span>
                                  <ChevronRightIcon className="size-3.5" />
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          <main className="min-w-0 px-6 py-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索数据资产名称、字段或业务说明"
                    className="pl-9"
                  />
                </div>
                <Button type="button" size="xs">
                  <DownloadIcon data-icon="inline-start" />
                  导出
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>数据资产</TableHead>
                      <TableHead>业务主题</TableHead>
                      <TableHead>订阅状态</TableHead>
                      <TableHead>更新频率</TableHead>
                      <TableHead>字段数</TableHead>
                      <TableHead>来源系统</TableHead>
                      <TableHead className="w-14" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.length ? (
                      filteredAssets.map((asset) => {
                        const isHighlighted = highlightedAssetId === asset.id

                        return (
                          <TableRow
                            key={asset.id}
                            className={cn(
                              "cursor-pointer",
                              isHighlighted && "bg-muted/60"
                            )}
                            onClick={() => setFocusedAssetId(asset.id)}
                          >
                            <TableCell className="align-top">
                              <div className="space-y-1">
                                <div className="font-medium">{asset.name}</div>
                                <p className="max-w-md whitespace-normal text-xs leading-5 text-muted-foreground">
                                  {asset.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{asset.topicLabel}</Badge>
                                <Badge variant="outline">{asset.groupLabel}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  asset.status === "已订阅" ? "default" : "secondary"
                                }
                              >
                                {asset.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{asset.refreshLabel}</TableCell>
                            <TableCell>{asset.fieldCount}</TableCell>
                            <TableCell>{asset.source}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon-sm"
                                      aria-label="更多操作"
                                      onClick={(event) => event.stopPropagation()}
                                    />
                                  }
                                >
                                  <EllipsisIcon />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>查看字段</DropdownMenuItem>
                                  <DropdownMenuItem>发起查询</DropdownMenuItem>
                                  <DropdownMenuItem>查看来源说明</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={7} className="py-10 text-center">
                          <div className="space-y-2">
                            <p className="font-medium">没有匹配的数据资产</p>
                            <p className="text-sm text-muted-foreground">
                              可以切换左侧分类，或者换一个关键词继续搜索。
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
