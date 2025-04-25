"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import UserSidebar from "@/components/userSidebar";
import Nav from "@/components/nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user.id) {
      router.replace("/login");
    }
  }, [user.id, router]);

  return (
    <div className="w-full">
      <Nav />
      <div className="flex h-[calc(100vh-5rem)]">
        <UserSidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
