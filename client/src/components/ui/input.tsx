import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-[#6A0DAD] selection:text-white border-2 border-purple-200/50 h-11 w-full min-w-0 rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 hover:border-purple-300/70 hover:shadow-md hover:scale-[1.01]",
        "focus-visible:border-[#6A0DAD] focus-visible:ring-[#6A0DAD]/30 focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:shadow-lg focus-visible:shadow-purple-500/20 focus-visible:scale-[1.02]",
        "aria-invalid:border-red-400 aria-invalid:ring-red-400/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
