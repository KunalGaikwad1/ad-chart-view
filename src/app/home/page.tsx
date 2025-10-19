"use client";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function HomePage() {
  useSessionCheck();

  return <div>Welcome home!</div>;
}
