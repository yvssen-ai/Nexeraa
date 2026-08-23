"use client";

/**
 * Ready signal handing control from the preloader to the hero, without
 * threading a context through every section (and without the re-render
 * cascade a context would cause mid-animation).
 *
 * Listeners are dispatched on the next animation frame, never synchronously.
 * That matters: `markReady()` is called from inside a GSAP timeline callback,
 * and GSAP keeps that timeline's `gsap.context` active for the duration of
 * the callback. Anything created synchronously from here would be adopted by
 * the preloader's context — including its selector scope, which points at an
 * element that has just been removed from the DOM.
 */
let ready = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  const queue = [...listeners];
  listeners.clear();
  requestAnimationFrame(() => queue.forEach((fn) => fn()));
}

/** Fires on the next frame — immediately if the app is already past the intro. */
export function onReady(fn: () => void): () => void {
  if (ready) {
    const id = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(id);
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
