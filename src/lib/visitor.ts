"use client";

import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_KEY = "wedding_visitor_id";
const VISITOR_NAME_KEY = "wedding_visitor_name";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getVisitorName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(VISITOR_NAME_KEY);
}

export function setVisitorName(name: string): void {
  if (typeof window === "undefined") return;
  const trimmed = name.trim().slice(0, 50);
  if (trimmed) {
    localStorage.setItem(VISITOR_NAME_KEY, trimmed);
  }
}

export function hasVisitorName(): boolean {
  const name = getVisitorName();
  return !!name && name.trim().length > 0;
}
