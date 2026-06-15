const AVATAR_COLORS = [
  "#4f46e5", "#0284c7", "#16a34a", "#dc2626", "#9333ea",
  "#ea580c", "#0891b2", "#65a30d", "#d97706", "#db2777",
  "#1d4ed8", "#0f766e", "#b45309", "#7c3aed", "#be185d",
];

export function getAvatarColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function getInitials(str = "") {
  const words = str.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
}
