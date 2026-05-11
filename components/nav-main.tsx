"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

type NavItem = {
  title: string
  url?: string
  icon?: ReactNode
  collapsedIcon?: ReactNode
  isActive?: boolean
  showAction?: boolean
  items?: {
    title: string
    url: string
    icon?: ReactNode
    isActive?: boolean
  }[]
}

type NavSection = {
  title?: string
  collapsible?: boolean
  defaultOpen?: boolean
  items: NavItem[]
}

export function NavMain({
  sections,
  actionIcon,
}: {
  sections: NavSection[]
  actionIcon?: ReactNode
}) {
  return (
    <>
      {sections.map((section, index) =>
        section.collapsible ? (
          <Collapsible
            key={section.title}
            defaultOpen={section.defaultOpen ?? true}
            className="group/collapsible"
            render={<SidebarGroup />}
          >
            <CollapsibleTrigger
              nativeButton={false}
              render={
                <SidebarGroupLabel className="cursor-pointer justify-between" />
              }
            >
              <span>{section.title}</span>
              <ChevronRightIcon className="transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <NavMenuItem
                    key={item.title}
                    item={item}
                    actionIcon={actionIcon}
                  />
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarGroup key={section.title ?? `section-${index}`}>
            {section.title ? (
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            ) : null}
            <SidebarMenu>
              {section.items.map((item) => (
                <NavMenuItem
                  key={item.title}
                  item={item}
                  actionIcon={actionIcon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )
      )}
    </>
  )
}

function NavMenuItem({
  item,
  actionIcon,
}: {
  item: NavItem
  actionIcon?: ReactNode
}) {
  const hasSubItems = Boolean(item.items?.length)

  if (hasSubItems) {
    return (
      <Collapsible
        defaultOpen
        className="group/project"
        render={<SidebarMenuItem />}
      >
        <CollapsibleTrigger
          render={
            <SidebarMenuButton tooltip={item.title} isActive={item.isActive} />
          }
        >
          {item.collapsedIcon ? (
            <>
              <span className="group-data-open/project:hidden">
                {item.collapsedIcon}
              </span>
              <span className="hidden group-data-open/project:inline-flex">
                {item.icon}
              </span>
            </>
          ) : (
            item.icon
          )}
          <span>{item.title}</span>
        </CollapsibleTrigger>
        {item.showAction ? (
          <ProjectActions itemTitle={item.title} actionIcon={actionIcon} />
        ) : null}
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={subItem.isActive}
                  render={<Link href={subItem.url} />}
                >
                  {subItem.icon}
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={item.isActive}
        render={<Link href={item.url ?? "#"} />}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
      {item.showAction ? (
        <ProjectActions itemTitle={item.title} actionIcon={actionIcon} />
      ) : null}
    </SidebarMenuItem>
  )
}

function ProjectActions({
  itemTitle,
  actionIcon,
}: {
  itemTitle: string
  actionIcon?: ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuAction
            aria-label={`${itemTitle} 更多操作`}
            className="opacity-0 group-hover/menu-item:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
          />
        }
      >
        {actionIcon}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>重命名</DropdownMenuItem>
          <DropdownMenuItem>发布MCP</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
