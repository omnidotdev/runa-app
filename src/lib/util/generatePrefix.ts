/**
 * Generate a project prefix from a project name.
 *
 * Rules:
 * - Multi-word: Take first letter of each word (e.g., "Project Management" → "PM")
 * - Single word: Take first 3-4 characters (e.g., "Backlog" → "BACK")
 * - Always uppercase
 * - Maximum 10 characters (matches DB constraint)
 * - Minimum 3 characters
 */
const generatePrefix = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "";

  // Remove special characters and normalize
  const cleaned = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "");

  const words = cleaned.split(/\s+/).filter(Boolean);

  let prefix: string;

  if (words.length >= 2) {
    // Multi-word: take first letter of each word
    prefix = words
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    // Ensure minimum 3 characters - if acronym is too short, extend from first word
    if (prefix.length < 3 && words[0].length >= 3) {
      prefix = words[0].slice(0, 3).toUpperCase();
    }
  } else if (words.length === 1) {
    // Single word: take first 4 characters (or less if word is shorter)
    prefix = words[0].slice(0, 4).toUpperCase();
  } else {
    return "";
  }

  // Ensure max 10 characters (DB constraint)
  return prefix.slice(0, 10);
};

export default generatePrefix;
