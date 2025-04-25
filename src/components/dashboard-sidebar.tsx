"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, CreditCard, ArrowRightLeft, User, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: BarChart3,
      current: pathname === "/dashboard"
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: CreditCard,
      current: pathname === "/accounts"
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: ArrowRightLeft,
      current: pathname === "/transactions"
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      current: pathname === "/profile"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings"
    }
  ];

  return (
    <aside className="hidden w-64 border-r bg-gray-50 md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="text-lg font-semibold">{user?.name ?? "User"}</h2>
          <p className="text-sm text-gray-500">{user?.email ?? "user@example.com"}</p>
        </div>
        <div className="space-y-1 py-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
        <div className="mt-auto pt-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium">Security Center</h3>
                <p className="text-xs text-gray-500">Protect your account</p>
              </div>
            </div>
            <Button size="sm" className="mt-3 w-full" asChild>
              <Link href="/settings/security">Security Settings</Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
