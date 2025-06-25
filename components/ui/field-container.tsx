import * as React from "react"

interface FieldContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const FieldContainer = React.forwardRef<HTMLDivElement, FieldContainerProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        // className={cn("space-y-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FieldContainer.displayName = "FieldContainer"

export { FieldContainer } 