"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full">
      <select
        data-slot="native-select"
        className={cn(
          "h-8 w-full appearance-none rounded-lg border border-input bg-background px-2.5 pr-8 text-sm leading-5 text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] focus-visible:border-ring focus-visible:bg-accent/30 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { NativeSelect }
