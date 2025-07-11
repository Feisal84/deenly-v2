"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button 
      variant="outline" 
      size={"sm"} 
      onClick={toggleTheme}
      title={theme === "light" ? "Zum dunklen Modus wechseln" : "Zum hellen Modus wechseln"}
      className="border border-foreground/20 rounded-full h-8 w-8 p-0"
    >
      {theme === "light" ? (
        <Sun
          key="light"
          size={ICON_SIZE}
          className={"text-[hsl(var(--deenly-text-primary))]"}
        />
      ) : (
        <Moon
          key="dark"
          size={ICON_SIZE}
          className={"text-[hsl(var(--deenly-text-primary))]"}
        />
      )}
    </Button>
  );
};

export { ThemeSwitcher };
