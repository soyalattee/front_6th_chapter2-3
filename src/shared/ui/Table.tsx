import * as React from "react"
import { cn } from "../utils/cn"

// 테이블 컴포넌트
const TableRoot = ({ className = "", ref, ...props }: React.ComponentPropsWithRef<"table">) => (
  <div className="w-full overflow-auto">
    <table className={cn("table-fixed w-full caption-bottom text-sm", className)} ref={ref} {...props} />
  </div>
)

// 테이블 헤더 컴포넌트
const TableHeader = ({ className = "", ref, ...props }: React.ComponentPropsWithRef<"thead">) => (
  <thead className={cn("[&_tr]:border-b", className)} ref={ref} {...props} />
)

// 테이블 바디 컴포넌트
const TableBody = ({ className = "", ref, ...props }: React.ComponentPropsWithRef<"tbody">) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} ref={ref} {...props} />
)

// 테이블 로우 컴포넌트
const TableRow = ({ className = "", ref, ...props }: React.ComponentPropsWithRef<"tr">) => (
  <tr
    className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14", className)}
    ref={ref}
    {...props}
  />
)

// 테이블 헤드 컴포넌트
const TableHead = ({ className = "", ref, ...props }: React.ComponentPropsWithRef<"th">) => (
  <th
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    ref={ref}
    {...props}
  />
)

// 테이블 셀 컴포넌트
const TableCell = ({ className = "", ref, ...props }: React.ComponentPropsWithRef<"td">) => (
  <td className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", className)} ref={ref} {...props} />
)

TableRoot.displayName = "Table"
TableHeader.displayName = "TableHeader"
TableBody.displayName = "TableBody"
TableRow.displayName = "TableRow"
TableHead.displayName = "TableHead"
TableCell.displayName = "TableCell"

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
})
