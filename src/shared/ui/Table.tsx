import * as React from "react"

// 테이블 컴포넌트
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  ref?: React.Ref<HTMLTableElement>
}

export const Table = ({ className = "", ref, ...props }: TableProps) => (
  <div className="w-full overflow-auto">
    <table className={`table-fixed w-full caption-bottom text-sm ${className}`} ref={ref} {...props} />
  </div>
)
Table.displayName = "Table"

// 테이블 헤더 컴포넌트
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  ref?: React.Ref<HTMLTableSectionElement>
}

export const TableHeader = ({ className = "", ref, ...props }: TableHeaderProps) => (
  <thead className={`[&_tr]:border-b ${className}`} ref={ref} {...props} />
)
TableHeader.displayName = "TableHeader"

// 테이블 바디 컴포넌트
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  ref?: React.Ref<HTMLTableSectionElement>
}

export const TableBody = ({ className = "", ref, ...props }: TableBodyProps) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} ref={ref} {...props} />
)
TableBody.displayName = "TableBody"

// 테이블 로우 컴포넌트
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
  ref?: React.Ref<HTMLTableRowElement>
}

export const TableRow = ({ className = "", ref, ...props }: TableRowProps) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    ref={ref}
    {...props}
  />
)
TableRow.displayName = "TableRow"

// 테이블 헤드 컴포넌트
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
  ref?: React.Ref<HTMLTableCellElement>
}

export const TableHead = ({ className = "", ref, ...props }: TableHeadProps) => (
  <th
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    ref={ref}
    {...props}
  />
)
TableHead.displayName = "TableHead"

// 테이블 셀 컴포넌트
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
  ref?: React.Ref<HTMLTableCellElement>
}

export const TableCell = ({ className = "", ref, ...props }: TableCellProps) => (
  <td className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} ref={ref} {...props} />
)
TableCell.displayName = "TableCell"
