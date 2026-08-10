import { useEffect } from "react";

/**
 * Calls `handler` when a pointer event happens outside the given ref's
 * element. Used to close dropdowns/popovers (search, notifications) on an
 * outside click.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    function handlePointerDown(event) {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [ref, handler]);
}
