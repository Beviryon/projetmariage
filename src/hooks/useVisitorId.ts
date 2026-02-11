"use client";

import { useState, useEffect } from "react";
import { getVisitorId } from "@/lib/visitor";

export function useVisitorId(): string {
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  return visitorId;
}
