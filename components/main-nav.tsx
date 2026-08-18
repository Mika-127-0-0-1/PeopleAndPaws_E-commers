'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            lable: 'Overview',
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            lable: 'Billboards',
            active: pathname === `/${params.storeId}/billboards` || pathname ===`/${params.storeId}/billboards/new`,
        },
        {
            href: `/${params.storeId}/categories`,
            lable: 'Categories',
            active: pathname === `/${params.storeId}/categories` || pathname ===`/${params.storeId}/categories/new`,
        },
        {
            href: `/${params.storeId}/sizes`,
            lable: 'Sizes',
            active: pathname === `/${params.storeId}/sizes` || pathname ===`/${params.storeId}/sizes/new`,
        },
        // {
        //     href: `/${params.storeId}/colors`,
        //     lable: 'Colors',
        //     active: pathname === `/${params.storeId}/colors` || pathname ===`/${params.storeId}/colors/new`,
        // },
        {
            href: `/${params.storeId}/products`,
            lable: 'Products',
            active: pathname.startsWith(`/${params.storeId}/products`),
        },
        {
            href: `/${params.storeId}/physical-therapy`,
            lable: 'Physical Therapy',
            active: pathname.startsWith(`/${params.storeId}/physical-therapy`),
        },
        {
            href: `/${params.storeId}/orders`,
            lable: 'Orders',
            active: pathname === `/${params.storeId}/orders`,
        },
        {
            href: `/${params.storeId}/settings`,
            lable: 'Settings',
            active: pathname === `/${params.storeId}/settings`|| pathname ===`/${params.storeId}/settings/term`|| pathname ===`/${params.storeId}/settings/ship`|| pathname ===`/${params.storeId}/settings/privacy`,
        }
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
                <Link
                key={route.href}
                href={route.href}
                className={cn("text-sm font-medium transition-colors hover:text-primary", 
                    route.active ? "text-black dark:text-white" : "text-muted-foreground")}
                >
                {route.lable}
                </Link>
            ))}
        </nav>
    )
};
