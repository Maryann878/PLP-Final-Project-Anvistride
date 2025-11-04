import React from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold">🚀 Tailwind v4 + Vite + Shadcn is working!</h1>

      <Button variant="default">Shadcn Button</Button>

      {/* visible debug helper */}
      <div className="app-debug-visible">
        If you see this pink box, Tailwind + global styles are loaded correctly!
      </div>
    </div>
  );
}
