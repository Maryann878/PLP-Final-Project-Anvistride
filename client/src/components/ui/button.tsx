import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-100 focus-visible:ring-purple-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        outline:
          "border-2 border-purple-300 bg-white text-purple-700 shadow-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:border-purple-400 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 active:scale-100 focus-visible:ring-purple-400/50 transition-all",
        ghost: 
          "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 active:bg-purple-100 focus-visible:ring-purple-400/50 hover:scale-105 transition-all",
        link: 
          "text-[#6A0DAD] hover:text-[#8B5CF6] underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-0 hover:scale-105 transition-all",
        destructive:
          "bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-100 focus-visible:ring-red-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
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
