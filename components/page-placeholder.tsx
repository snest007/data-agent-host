import { appRoutes, type AppRouteKey } from "@/lib/navigation"

export function PagePlaceholder({ routeKey }: { routeKey: AppRouteKey }) {
  const route = appRoutes[routeKey]

  return (
    <section className="flex min-h-[calc(100svh-6.5rem)] flex-col justify-between gap-8 py-8">
      <div className="flex max-w-3xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">数据中心</p>
        <h1 className="text-2xl font-semibold tracking-tight">{route.title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {route.description}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        当前版本只验证 Agent Host 的菜单结构和导航逻辑。
      </p>
    </section>
  )
}
