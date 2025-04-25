import Link from "next/link";
import { Shield } from "lucide-react";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="z-10 w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
            <Shield className="h-6 w-6" />
            <span>SecureBank</span>
          </Link>
        </div>
        <Image src="/user.png" alt="" width={20} height={10} />
      </div>
    </nav>
  );
};

export default Nav;
