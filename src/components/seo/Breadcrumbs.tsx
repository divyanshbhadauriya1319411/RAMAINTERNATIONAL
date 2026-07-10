import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations("navbar");

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 bg-luxury-light border-b border-gray-150 text-xs font-semibold text-gray-500">
      <ol className="max-w-7xl mx-auto flex items-center space-x-2">
        <li className="flex items-center">
          <Link href="/" className="hover:text-gold-600 flex items-center space-x-1">
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("home")}</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center space-x-2">
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              {isLast ? (
                <span className="text-navy-900 font-bold" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-gold-600">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
