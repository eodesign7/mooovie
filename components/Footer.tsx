"use client";

import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="py-6 bg-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Sociálne siete */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/eodesign7/mooovie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://x.com/erik_ondrus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">X (Twitter)</span>
            </Link>
            <Link
              href="https://www.instagram.com/erik_ondrus/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>

            {/* Theme Toggler */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Copyright text */}
          <p className="text-center text-sm text-muted-foreground">
            ©2025 Mooovie. Created with{" "}
            <span role="img" aria-label="love">
              💖
            </span>{" "}
            by{" "}
            <Link
              href="https://eodev.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              eoDev
            </Link>
            . | All rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
