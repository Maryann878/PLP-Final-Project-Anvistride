import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <textarea
        style={{ colorScheme: 'light', ...style }}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-white text-gray-900 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!text-gray-900 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
