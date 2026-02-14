"use client";

import { useEffect } from "react";
import { initTheme } from "@/lib/theme";

export default function ThemeBoot() {
  useEffect(() => {
    initTheme();
  }, []);
  return null;
}
