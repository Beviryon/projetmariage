"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVisitorName,
  setVisitorName as saveVisitorName,
  hasVisitorName,
} from "@/lib/visitor";

export function useVisitorName() {
  const [name, setName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setName(getVisitorName());
  }, []);

  const setVisitorName = useCallback((newName: string) => {
    saveVisitorName(newName);
    setName(newName.trim() || null);
  }, []);

  return {
    name,
    hasName: mounted && hasVisitorName(),
    setVisitorName,
    mounted,
  };
}
