import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
  type: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  collapsible?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      collapsible = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(() => {
      if (defaultValue === undefined) return []
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    })

    const currentValue = React.useMemo(() => {
      if (value !== undefined) {
        return Array.isArray(value) ? value : [value]
      }
      return internalValue
    }, [value, internalValue])

    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        let newValue: string[]
        if (type === "single") {
          newValue = currentValue.includes(itemValue) && collapsible ? [] : [itemValue]
        } else {
          newValue = currentValue.includes(itemValue)
            ? currentValue.filter((v) => v !== itemValue)
            : [...currentValue, itemValue]
        }

        if (value === undefined) {
          setInternalValue(newValue)
        }

        if (type === "single") {
          onValueChange?.(newValue[0] || "")
        } else {
          onValueChange?.(newValue)
        }
      },
      [type, currentValue, collapsible, value, onValueChange]
    )

    return (
      <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, type }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion")
  }
  return context
}

const AccordionItemContext = React.createContext<string>("")

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <div ref={ref} className={cn("border-b", className)} {...props}>
      {children}
    </div>
  </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const itemValue = React.useContext(AccordionItemContext)
  const { value, onValueChange } = useAccordionContext()
  const isOpen = value.includes(itemValue)

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        onClick={() => onValueChange(itemValue)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&>svg]:transition-transform",
          isOpen && "[&>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    </div>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const itemValue = React.useContext(AccordionItemContext)
  const { value } = useAccordionContext()
  const isOpen = value.includes(itemValue)

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up"
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{isOpen && children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
