import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ open, onOpenChange }) => {
  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["⌘", "K"], description: "Open command palette" },
        { keys: ["⌘", "/"], description: "Show keyboard shortcuts" },
        { keys: ["Esc"], description: "Close modals/dialogs" },
      ],
    },
    {
      category: "Quick Actions",
      items: [
        { keys: ["⌘", "N"], description: "Create new item (context-aware)" },
        { keys: ["V"], description: "Go to Visions" },
        { keys: ["G"], description: "Go to Goals" },
        { keys: ["T"], description: "Go to Tasks" },
        { keys: ["I"], description: "Go to Ideas" },
        { keys: ["N"], description: "Go to Notes" },
        { keys: ["J"], description: "Go to Journal" },
      ],
    },
    {
      category: "Search",
      items: [
        { keys: ["⌘", "K"], description: "Global search" },
        { keys: ["↑", "↓"], description: "Navigate results" },
        { keys: ["Enter"], description: "Select result" },
      ],
    },
  ];

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${glassClass} rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Keyboard className="h-6 w-6" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                            {key}
                          </kbd>
                          {keyIndex < item.keys.length - 1 && (
                            <span className="text-gray-400 mx-1">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
          <p>Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">Esc</kbd> to close</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;

