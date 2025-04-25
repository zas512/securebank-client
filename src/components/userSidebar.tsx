"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, CreditCard, ArrowRightLeft, BarChart3, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import type { RootState } from "@/redux/store";

const links = [
  { href: "/dashboard", label: "Overview", icon: <BarChart3 className="mr-2 h-4 w-4" /> },
  { href: "/accounts", label: "Accounts", icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { href: "/transactions", label: "Transactions", icon: <ArrowRightLeft className="mr-2 h-4 w-4" /> },
  { href: "/profile", label: "Profile", icon: <User className="mr-2 h-4 w-4" /> }
];

const UserSidebar = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <aside className="hidden w-64 border-r bg-gray-50 md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="text-lg font-semibold">{user?.name ?? "Test User"}</h2>
          <p className="text-sm text-gray-500">{user?.email ?? "test@mail.com"}</p>
        </div>
        <div className="space-y-1 py-3">
          {links.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link href={href} key={href}>
                <Button variant={isActive ? "default" : "ghost"} className="my-1 w-full justify-start">
                  {icon}
                  {label}
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
