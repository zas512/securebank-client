"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Nav from "@/components/nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user.id && user.role !== "admin") {
      router.replace("/login");
    }
  }, [user.id, user.role, router]);

  return (
    <div className="w-full">
      <Nav />
      <div className="h-[calc(100vh-5rem)]">{children}</div>
    </div>
  );
};

export default Layout;
