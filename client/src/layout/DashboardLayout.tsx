import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import BottomBar from "@/components/BottomBar";
import NavbarMobile from "@/components/NavbarMobile";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { useCommandPalette } from "@/hooks/useCommandPalette";

const DashboardLayout: React.FC = () => {
  const { isOpen: isCommandPaletteOpen, setIsOpen: setCommandPaletteOpen } = useCommandPalette();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Handle Cmd+/ for shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* NavbarMobile (Mobile only) */}
      <div className="block md:hidden">
        <NavbarMobile />
      </div>

      {/* Sidebar(Desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto main-content md:ml-64 pb-20 md:pb-6 pt-14 md:pt-0">
        <Outlet />
      </main>

      {/* BottomBar (Mobile only) */}
      <div className="block md:hidden">
        <BottomBar />
      </div>

      {/* Command Palette */}
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen} />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
};

export default DashboardLayout;
