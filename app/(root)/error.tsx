"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Halaman error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-destructive-100">Terjadi Kesalahan</h2>
      <p className="text-light-100 text-center max-w-md">
        Maaf, ada masalah saat memuat halaman. Silakan coba lagi.
      </p>
      <Button className="btn-primary" onClick={reset}>
        Coba Lagi
      </Button>
    </div>
  );
}
