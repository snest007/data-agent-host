"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, type ReactNode } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { appRoutes, getRouteByPath } from "@/lib/navigation"

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const route = getRouteByPath(pathname)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    render={<Link href={appRoutes.newSession.path} />}
                  >
                    数据中心
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {route.breadcrumbs.map((item, index) => {
                  const isLast = index === route.breadcrumbs.length - 1

                  return (
                    <Fragment key={`${item}-${index}`}>
                      <BreadcrumbSeparator className="hidden md:block" />
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
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
