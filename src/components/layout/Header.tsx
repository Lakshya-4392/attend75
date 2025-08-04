import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColorCustomizer } from "./ColorCustomizer";
import { useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [showColorCustomizer, setShowColorCustomizer] = useState(false);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-none bg-background/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/10",
      className
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Attend 75</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center">
          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorCustomizer(!showColorCustomizer)}
            className="h-9 w-9"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Customize colors</span>
          </Button>
          
          {showColorCustomizer && (
            <ColorCustomizer onClose={() => setShowColorCustomizer(false)} />
          )}
        </div>
      </div>
    </header>
  );
}