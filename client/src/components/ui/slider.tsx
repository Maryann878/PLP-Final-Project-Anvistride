import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  orientation?: "horizontal" | "vertical"
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [isDragging, setIsDragging] = React.useState(false)
    const trackRef = React.useRef<HTMLDivElement>(null)

    const currentValue = value !== undefined ? value : internalValue
    const percentage = ((currentValue[0] - min) / (max - min)) * 100

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return
      setIsDragging(true)
      updateValue(e)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || disabled) return
      updateValue(e)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const updateValue = (e: MouseEvent | React.MouseEvent) => {
      if (!trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const isHorizontal = orientation === "horizontal"
      const pos = isHorizontal ? e.clientX - rect.left : rect.bottom - e.clientY
      const percentage = Math.max(0, Math.min(1, pos / (isHorizontal ? rect.width : rect.height)))
      const newValue = Math.round((min + percentage * (max - min)) / step) * step
      const clampedValue = Math.max(min, Math.min(max, newValue))

      const newValues = [clampedValue]
      if (value === undefined) {
        setInternalValue(newValues)
      }
      onValueChange?.(newValues)
    }

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
        return () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }
      }
    }, [isDragging])

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex touch-none select-none items-center",
          orientation === "horizontal" ? "h-5 w-full" : "h-full w-5 flex-col",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className={cn(
            "relative grow rounded-full bg-primary/20",
            orientation === "horizontal" ? "h-1.5 w-full" : "h-full w-1.5"
          )}
          onMouseDown={handleMouseDown}
        >
          <div
            className={cn(
              "absolute rounded-full bg-primary",
              orientation === "horizontal"
                ? "h-full"
                : "w-full bottom-0"
            )}
            style={
              orientation === "horizontal"
                ? { width: `${percentage}%` }
                : { height: `${percentage}%` }
            }
          />
        </div>
        <div
          className={cn(
            "absolute block h-5 w-5 rounded-full border-2 border-primary bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "pointer-events-none opacity-50",
            orientation === "horizontal"
              ? "left-0 translate-x-[-50%]"
              : "bottom-0 translate-y-[50%]"
          )}
          style={
            orientation === "horizontal"
              ? { left: `${percentage}%` }
              : { bottom: `${percentage}%` }
          }
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

const SliderTrack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", className)}
    {...props}
  />
))
SliderTrack.displayName = "SliderTrack"

const SliderRange = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute h-full rounded-full bg-primary", className)}
    {...props}
  />
))
SliderRange.displayName = "SliderRange"

const SliderThumb = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
SliderThumb.displayName = "SliderThumb"

export { Slider, SliderTrack, SliderRange, SliderThumb }
