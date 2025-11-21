import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border-2 p-5 pr-12 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top-full sm:slide-in-from-bottom-full hover:shadow-3xl",
  {
    variants: {
      variant: {
        default:
          "border-purple-200/70 bg-gradient-to-br from-white/98 via-white/95 to-purple-50/30 text-gray-900 shadow-purple-200/40 ring-1 ring-purple-100/50",
        destructive:
          "destructive group border-red-300/70 bg-gradient-to-br from-red-50/98 via-red-50/95 to-red-100/40 text-red-900 shadow-red-300/40 ring-1 ring-red-200/50",
        success:
          "success group border-green-300/70 bg-gradient-to-br from-green-50/98 via-green-50/95 to-emerald-50/40 text-green-900 shadow-green-300/40 ring-1 ring-green-200/50"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, open = true, onOpenChange, ...props }, ref) => {
    React.useEffect(() => {
      if (!open && onOpenChange) {
        const timer = setTimeout(() => onOpenChange(false), 300)
        return () => clearTimeout(timer)
      }
    }, [open, onOpenChange])

    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 opacity-0 transition-all duration-200 hover:text-gray-700 hover:bg-gray-100/70 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 group-hover:opacity-100 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-600 group-[.destructive]:hover:bg-red-100/70 group-[.success]:text-green-500 group-[.success]:hover:text-green-700 group-[.success]:hover:bg-green-100/70 hover:scale-110 active:scale-95",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-bold leading-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed mt-1.5", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = "ToastViewport"

type ToastPropsType = React.ComponentPropsWithoutRef<typeof Toast>

const getIcon = (variant?: "default" | "destructive" | "success") => {
  switch (variant) {
    case "success":
      return (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 ring-2 ring-white/50">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
      )
    case "destructive":
      return (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 ring-2 ring-white/50">
          <AlertCircle className="h-5 w-5 text-white" />
        </div>
      )
    default:
      return (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-white/50">
          <Info className="h-5 w-5 text-white" />
        </div>
      )
  }
}

interface ToastItemProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  cancel?: React.ReactNode
  variant?: "default" | "destructive" | "success"
  duration?: number
  hideProgress?: boolean
  onOpenChange?: (open: boolean) => void
  toastProps: Omit<ToastPropsType, "variant" | "open" | "onOpenChange">
}

const ToastItem: React.FC<ToastItemProps> = ({ 
  id, 
  title, 
  description, 
  action, 
  cancel, 
  variant, 
  duration, 
  hideProgress = false,
  onOpenChange, 
  toastProps 
}) => {
  const [progress, setProgress] = React.useState(100)
  
  React.useEffect(() => {
    if (duration && duration > 0) {
      const interval = 50 // Update every 50ms for smooth animation
      const steps = duration / interval
      const decrement = 100 / steps
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev - decrement
          if (next <= 0) {
            clearInterval(timer)
            return 0
          }
          return next
        })
      }, interval)
      
      return () => clearInterval(timer)
    }
  }, [duration])

  return (
    <Toast 
      key={id} 
      variant={variant} 
      open={true}
      onOpenChange={onOpenChange}
      {...toastProps}
    >
      {/* Progress bar */}
      {duration && duration > 0 && !hideProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full transition-all duration-50 ease-linear rounded-b-2xl"
            style={{
              width: `${progress}%`,
              background: variant === "success" 
                ? "linear-gradient(to right, #10b981, #059669)"
                : variant === "destructive"
                ? "linear-gradient(to right, #ef4444, #dc2626)"
                : "linear-gradient(to right, #9333ea, #14b8a6)"
            }}
          />
        </div>
      )}
      
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon(variant)}
        </div>
        
        {/* Content */}
        <div className="grid gap-1 flex-1 min-w-0">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && (
            <ToastDescription>{description}</ToastDescription>
          )}
        </div>
      </div>
      {action}
      {cancel}
      <ToastClose onClick={() => onOpenChange?.(false)} />
    </Toast>
  )
}

function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastViewport>
      {toasts.map(({ id, title, description, action, cancel, variant, duration, hideProgress, onOpenChange, ...toastProps }) => (
        <ToastItem
          key={id}
          id={id}
          title={title}
          description={description}
          action={action}
          cancel={cancel}
          variant={variant}
          duration={duration}
          hideProgress={hideProgress}
          onOpenChange={onOpenChange}
          toastProps={toastProps}
        />
      ))}
    </ToastViewport>
  )
}

export {
  type ToastPropsType,
  Toast,
  ToastViewport,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastAction,
  Toaster,
}
