"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export function TablePaginationFooter({
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
}: {
  currentPage: number
  onPageChange: (page: number) => void
  pageSize: number
  totalItems: number
}) {
  const pageCount = Math.max(Math.ceil(totalItems / pageSize), 1)
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), pageCount)

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-4 py-3">
      <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-muted-foreground">
        <span>共 {totalItems} 条</span>
        <span>每页 {pageSize} 条</span>
        <span className="font-medium text-foreground">
          第 {safeCurrentPage} / {pageCount} 页
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="第一页"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeftIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="上一页"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="下一页"
          disabled={safeCurrentPage >= pageCount}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="最后一页"
          disabled={safeCurrentPage >= pageCount}
          onClick={() => onPageChange(pageCount)}
        >
          <ChevronsRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
