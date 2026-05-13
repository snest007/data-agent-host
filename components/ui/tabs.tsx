"use client"

import * as React from "react"
import { Tabs as BaseTabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

const Tabs = BaseTabs.Root

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-8 min-w-[84px] items-center justify-center rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-[color,box-shadow,background-color] hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </BaseTabs.Tab>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
