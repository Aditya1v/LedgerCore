/**
 * Lightweight class name combiner.
 * Accepts strings, arrays, and objects ({ className: boolean }) and joins
 * truthy values with a single space. Avoids pulling in clsx/tailwind-merge
 * as an extra dependency for a small utility need.
 */
export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(input);
      continue;
    }

    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
      continue;
    }

    if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}
