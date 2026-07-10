"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import HamburgerButton from "./HamburgerButton";

interface MobileNavProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrolled: boolean;
}

export default function MobileNav({
  menuOpen,
  setMenuOpen,
  scrolled,
}: MobileNavProps) {
  return (
    <div className="xl:hidden flex items-center space-x-3">
      {/* Tablet Only Controls: Visible only on tablet viewports (768px - 1023px) */}
      <div className="hidden md:flex items-center space-x-4 mr-2">
        <LanguageSwitcher />
        <ThemeToggle
          className={
            scrolled ? "text-navy-750 dark:text-gray-300 hover:text-blue-600" : "text-gray-300 hover:text-gold-500"
          }
        />
      </div>

      {/* Hamburger menu trigger */}
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        scrolled={scrolled}
      />
    </div>
  );
}
