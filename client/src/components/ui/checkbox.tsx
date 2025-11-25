import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      onCheckedChange?.(newChecked)
      onChange?.(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      e.preventDefault()
      const newChecked = !checked
      onCheckedChange?.(newChecked)
      // Create a synthetic event for onChange
      const syntheticEvent = {
        target: { checked: newChecked },
        currentTarget: { checked: newChecked },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          onClick={handleClick}
          className={cn(
            "h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            checked
              ? "bg-gradient-to-br from-green-500 to-green-600 border-green-600 text-white shadow-md"
              : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/50",
            className
          )}
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled}
        >
          {checked && (
            <Check className="h-4 w-4 text-white stroke-[3]" />
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
