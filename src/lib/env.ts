"use client";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Rough device-capability tier, used to scale particle counts and blur
 * layers down on weak hardware instead of shipping one heavy setting.
 */
export function perfTier(): "low" | "mid" | "high" {
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const small = window.matchMedia("(max-width: 767px)").matches;
  if (cores <= 4 || mem <= 4) return small ? "low" : "mid";
  if (small) return "mid";
  return "high";
}
