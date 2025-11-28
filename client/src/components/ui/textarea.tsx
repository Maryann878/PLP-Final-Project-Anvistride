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
          "flex min-h-[80px] w-full rounded-xl border-2 border-purple-200/50 bg-white text-gray-900 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#6A0DAD] focus-visible:ring-[#6A0DAD]/30 focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:shadow-lg focus-visible:shadow-purple-500/20 focus-visible:scale-[1.01] hover:border-purple-300/70 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "aria-invalid:border-red-400 aria-invalid:ring-red-400/20",
          "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!text-gray-900 [&:-webkit-autofill]:!border-purple-200/50 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
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
