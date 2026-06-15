"use client";
import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    const key = "vt_" + new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("http://localhost:5000/api/admin/track-visit", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
