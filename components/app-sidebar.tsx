"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { appRoutes } from "@/lib/navigation"
import {
  EllipsisIcon,
  FolderIcon,
  FolderOpenIcon,
  GalleryVerticalEndIcon,
  HardDriveIcon,
  MessageSquareTextIcon,
  PlugIcon,
  SearchIcon,
  WrenchIcon,
} from "lucide-react"

type SidebarNavItem = {
  title: string
  url?: string
  icon?: React.ReactNode
  collapsedIcon?: React.ReactNode
  showAction?: boolean
  items?: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}

type SidebarNavSection = {
  title?: string
  collapsible?: boolean
  items: SidebarNavItem[]
}

const navSections: SidebarNavSection[] = [
  {
    items: [
      {
        title: appRoutes.newSession.title,
        url: appRoutes.newSession.path,
        icon: <MessageSquareTextIcon />,
      },
      {
        title: appRoutes.search.title,
        url: appRoutes.search.path,
        icon: <SearchIcon />,
      },
      {
        title: appRoutes.officialAssets.title,
        url: appRoutes.officialAssets.path,
        icon: <HardDriveIcon />,
      },
    ],
  },
  {
    title: "我的数据资产",
    collapsible: true,
    items: [
      {
        title: appRoutes.requirements.title,
        url: appRoutes.requirements.path,
        icon: <FolderOpenIcon />,
        collapsedIcon: <FolderIcon />,
        showAction: true,
        items: [
          {
            title: appRoutes.requirementsSession1.title,
            url: appRoutes.requirementsSession1.path,
          },
          {
            title: appRoutes.requirementsSession2.title,
            url: appRoutes.requirementsSession2.path,
          },
          {
            title: appRoutes.requirementsSession3.title,
            url: appRoutes.requirementsSession3.path,
          },
        ],
      },
      {
        title: appRoutes.budgetFunnel.title,
        url: appRoutes.budgetFunnel.path,
        icon: <FolderOpenIcon />,
        collapsedIcon: <FolderIcon />,
        showAction: true,
        items: [
          {
            title: appRoutes.budgetFunnelSession1.title,
            url: appRoutes.budgetFunnelSession1.path,
          },
          {
            title: appRoutes.budgetFunnelSession2.title,
            url: appRoutes.budgetFunnelSession2.path,
          },
          {
            title: appRoutes.budgetFunnelSession3.title,
            url: appRoutes.budgetFunnelSession3.path,
          },
        ],
      },
      {
        title: appRoutes.requestExecution.title,
        url: appRoutes.requestExecution.path,
        icon: <FolderOpenIcon />,
        collapsedIcon: <FolderIcon />,
        showAction: true,
        items: [
          {
            title: appRoutes.requestExecutionSession1.title,
            url: appRoutes.requestExecutionSession1.path,
          },
          {
            title: appRoutes.requestExecutionSession2.title,
            url: appRoutes.requestExecutionSession2.path,
          },
          {
            title: appRoutes.requestExecutionSession3.title,
            url: appRoutes.requestExecutionSession3.path,
          },
        ],
      },
    ],
  },
  {
    title: "会话",
    collapsible: true,
    items: [
      {
        title: appRoutes.tempSession1.title,
        url: appRoutes.tempSession1.path,
      },
      {
        title: appRoutes.tempSession2.title,
        url: appRoutes.tempSession2.path,
      },
      {
        title: appRoutes.tempSession3.title,
        url: appRoutes.tempSession3.path,
      },
    ],
  },
  {
    title: "配置",
    items: [
      {
        title: appRoutes.mcp.title,
        url: appRoutes.mcp.path,
        icon: <PlugIcon />,
      },
      {
        title: appRoutes.skills.title,
        url: appRoutes.skills.path,
        icon: <WrenchIcon />,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const sections = navSections.map((section) => ({
    ...section,
    defaultOpen: section.collapsible ? true : undefined,
    items: section.items.map((item) => {
      const subItems = item.items?.map((subItem) => ({
        ...subItem,
        isActive: pathname === subItem.url,
      }))

      return {
        ...item,
        isActive: pathname === item.url,
        items: subItems,
      }
    }),
  }))
  const fixedTopSections = sections.slice(0, 1)
  const scrollableSections = sections.slice(1, 3)
  const fixedBottomSections = sections.slice(3)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="数据中心"
              render={<Link href={appRoutes.newSession.path} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">数据中心</span>
                <span className="truncate text-xs">Agent Host</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className="shrink-0">
        <NavMain sections={fixedTopSections} actionIcon={<EllipsisIcon />} />
      </div>
      <SidebarContent className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <NavMain sections={scrollableSections} actionIcon={<EllipsisIcon />} />
      </SidebarContent>
      <SidebarFooter className="shrink-0 gap-0 p-0">
        <NavMain sections={fixedBottomSections} actionIcon={<EllipsisIcon />} />
      </SidebarFooter>
    </Sidebar>
  )
}
