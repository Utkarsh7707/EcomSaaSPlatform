'use client';
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const param = useParams();
  const routes = [
    {
      href: `/${param.storeId}`,
      label: "Dashboard",
      active: pathname === `/${param.storeId}`,
    },
    {
      href: `/${param.storeId}/billboards`,
      label: "Billboards", 
      active: pathname === `/${param.storeId}/billboards`,
    },
    {
      href: `/${param.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${param.storeId}/categories`,
    },
    {
      href: `/${param.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${param.storeId}/sizes`,
    },
    {
      href: `/${param.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${param.storeId}/colors`,
    },
    {
      href: `/${param.storeId}/products`,
      label: "Products",
      active: pathname === `/${param.storeId}/products`,
    },
    {
      href: `/${param.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${param.storeId}/orders`,
    },
    {
      href: `/${param.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${param.storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("ml-5 flex items-center space-x-4 lg:space-x-6")}>
      {routes.map((route) => (
        <Link key={route.href}  href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary",
          route.active ? "text-black dark:text-white": "text-muted-foreground" )} >{route.label} </Link>
      ))}
    </nav>
  );
}
