/**
 * Converts a hyphenated id into a human-readable, title-cased label.
 *
 * @param id The hyphenated identifier to format (e.g. "modern-art").
 * @returns The formatted label (e.g. "Modern Art").
 */
export function formatLabel(id: string): string {
  const spaced = id.replace(/-/g, " ");

  return spaced
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
