import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout" suppressHydrationWarning>
      <nav className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-nnyai.png" alt="Logo Nnyai" width={200} height={200} />
        </Link>

        <LogoutButton />
      </nav>

      {children}
    </div>
  );
};

export default Layout;
