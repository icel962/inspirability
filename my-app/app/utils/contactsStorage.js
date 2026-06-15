import { contacts as staticContacts } from "../contact-details/contacts-data";

const STORAGE_KEY = "contactsData";
const SEEDED_KEY  = "contactsSeeded";

export function initContacts() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;
  // Preserve any dynamic contacts already in storage, prepend the 12 static ones
  const existing = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  })();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...staticContacts, ...existing]));
  localStorage.setItem(SEEDED_KEY, "1");
}

export function loadContacts() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveContacts(list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getImgSrc(image) {
  if (!image) return "/images/1.jpg";
  if (image.startsWith("data:") || image.startsWith("http")) return image;
  return `/${image}`;
}
