"use client";

import { Menu, X } from "lucide-react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  scrolled: boolean;
  className?: string;
}

export default function HamburgerButton({
  isOpen,
  onClick,
  scrolled,
  className = "",
}: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
      className={`p-2.5 cursor-pointer border rounded-lg transition-colors duration-200 ${
        scrolled
          ? "border-navy-900/20 text-navy-900 dark:border-white/20 dark:text-white"
          : "border-white/25 text-white"
      } ${className}`}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
