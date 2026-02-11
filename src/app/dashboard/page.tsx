"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/media");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-stone-500">Redirection...</p>
    </div>
  );
}
