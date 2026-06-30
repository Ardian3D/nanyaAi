"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/actions/auth.action";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-light-100 hover:text-destructive-100 transition-colors ml-auto"
    >
      <LogOut size={18} />
      <span className="text-sm">Keluar</span>
    </button>
  );
};

export default LogoutButton;
