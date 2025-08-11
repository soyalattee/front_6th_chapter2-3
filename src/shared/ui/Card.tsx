// 카드 컴포넌트
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const Card = ({ className = "", ref, ...props }: CardProps) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} ref={ref} {...props} />
)

// 카드 헤더 컴포넌트
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const CardHeader = ({ className = "", ref, ...props }: CardHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} ref={ref} {...props} />
)

// 카드 타이틀 컴포넌트
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  ref?: React.Ref<HTMLHeadingElement>
}

export const CardTitle = ({ className = "", ref, ...props }: CardTitleProps) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} ref={ref} {...props} />
)

// 카드 컨텐츠 컴포넌트
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const CardContent = ({ className = "", ref, ...props }: CardContentProps) => (
  <div className={`p-6 pt-0 ${className}`} ref={ref} {...props} />
)
