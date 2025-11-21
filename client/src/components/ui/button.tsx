import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-4 focus-visible:ring-purple-300/50 focus-visible:ring-offset-2 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white shadow-lg shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.03] hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 active:scale-[0.97] ring-1 ring-white/20 hover:ring-white/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
        outline:
          "border-2 border-purple-300/70 bg-white/95 backdrop-blur-md text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/90 hover:to-teal-50/90 hover:border-purple-400/80 hover:text-purple-800 shadow-md hover:shadow-xl hover:shadow-purple-200/40 hover:scale-[1.02] active:scale-[0.98] font-medium ring-1 ring-purple-100/50 hover:ring-purple-200/70 transition-all duration-300",
        ghost: 
          "text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/90 hover:to-teal-50/90 hover:shadow-lg hover:shadow-purple-100/30 active:scale-[0.98] font-medium rounded-lg transition-all duration-300",
        link: 
          "text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline font-medium transition-colors duration-200",
        destructive:
          "bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white shadow-lg shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/60 hover:scale-[1.03] hover:from-red-700 hover:via-red-600 hover:to-rose-600 active:scale-[0.97] ring-1 ring-white/20 hover:ring-white/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
      },
      size: {
        default: "h-11 px-6 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children, {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props,
      } as any)
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
