"use client"

import * as React from "react"
import { Select as BaseSelect } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = BaseSelect.Root

const SelectValue = BaseSelect.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-8 w-full items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-1 text-sm leading-5 text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color,background-color] focus-visible:border-ring focus-visible:bg-accent/30 focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className="ml-auto inline-flex shrink-0 text-muted-foreground">
        <ChevronDownIcon className="size-4" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={6}
        className="z-50 outline-none"
        align="start"
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            "w-[var(--anchor-width)] min-w-40 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md outline-none transition-[opacity,transform] duration-150 ease-out data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98]",
            className
          )}
          {...props}
        >
          <BaseSelect.List className="max-h-80 overflow-auto p-1">
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-7 cursor-default items-center rounded-md py-1 pr-8 pl-2 text-sm leading-5 text-popover-foreground outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        className
      )}
      {...props}
    >
      <BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="absolute right-2 inline-flex size-4 items-center justify-center">
        <CheckIcon className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-2 pt-1 pb-1 text-xs leading-4 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

const SelectGroup = BaseSelect.Group

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
