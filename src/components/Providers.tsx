"use client";

import { ReactNode } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { CaptureGuard } from "./CaptureGuard";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LoadingScreen message={process.env.NEXT_PUBLIC_LOADING_MESSAGE || "Préparation de votre visite..."}>
      {children}
      <CaptureGuard />
    </LoadingScreen>
  );
}
