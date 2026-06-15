// ─── Lookup tables ─────────────────────────────────────────────────────────

export const EGYPT_GOVERNORATES = [
  "Alexandria","Aswan","Asyut","Beheira","Beni Suef","Cairo",
  "Dakahlia","Damietta","Faiyum","Gharbia","Giza","Ismailia",
  "Kafr El Sheikh","Luxor","Matruh","Minya","Monufia","New Valley",
  "North Sinai","Port Said","Qalyubia","Qena","Red Sea","Sharqia",
  "Sohag","South Sinai","Suez",
];

export const SPECIAL_TYPES = [
  "Autism","ADHD","Down Syndrome","Hearing Impairment","Visual Impairment",
  "Learning Disabilities","Cerebral Palsy","Physical Disabilities",
  "Multiple Disabilities","Mixed / All",
];

export const SCHOOL_CATEGORIES = [
  "Pre-School","Primary","Preparatory","Secondary","Mixed",
];

export const CURRICULUM_TYPES = [
  "National","British","American","IB (Intl. Baccalaureate)","French","German","Islamic",
];

export const EDUCATIONAL_LEVELS = [
  "Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7 (Prep 1)","Grade 8 (Prep 2)","Grade 9 (Prep 3)",
  "Grade 10 (Sec 1)","Grade 11 (Sec 2)","Grade 12 (Sec 3)","Other",
];

export const CLINIC_TYPES = [
  "Physical Therapy","Occupational Therapy","Speech Therapy","Psychology",
  "Behavioral Therapy","Educational Therapy","General Rehabilitation","Mixed",
];

export const SPECIALIZATION_TYPES = [
  "Autism","ADHD","Down Syndrome","Hearing Impairment","Visual Impairment",
  "Cerebral Palsy","Learning Disabilities","Multiple Disabilities","General",
];

export const SPORT_CENTER_TYPES = [
  "Sports Academy","Sports Club","Gym & Fitness Center",
  "Rehabilitation Center","Swimming Academy","Mixed",
];

export const SPORTS_TYPES = [
  "Football","Basketball","Swimming","Tennis","Gymnastics",
  "Athletics","Martial Arts","Adaptive Sports","Multiple Sports",
];

export const SUPPORTED_CONDITIONS = [
  "Autism","ADHD","Down Syndrome","Physical Disabilities",
  "Hearing Impairment","Visual Impairment","Multiple Disabilities","All Conditions",
];

// ─── Field validators ───────────────────────────────────────────────────────

export function validateEmail(email) {
  if (!email?.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Enter a valid email address (e.g. name@example.com).";
  return null;
}

export function validatePhone(phone) {
  if (!phone?.trim()) return "Phone number is required.";
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");
  // Normalize country code prefix: +20 or 0020 → 0
  if (cleaned.startsWith("+20")) cleaned = "0" + cleaned.slice(3);
  if (cleaned.startsWith("0020")) cleaned = "0" + cleaned.slice(4);
  // Egyptian mobile: 01[0125] + 8 digits = 11 digits total
  if (!/^01[0125]\d{8}$/.test(cleaned))
    return "Enter a valid Egyptian mobile number starting with 010, 011, 012, or 015 (11 digits total).";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter (A–Z).";
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter (a–z).";
  if (!/[0-9]/.test(password)) return "Password needs at least one number (0–9).";
  return null;
}

export function validateName(name, label = "Name") {
  if (!name?.trim()) return `${label} is required.`;
  if (name.trim().length < 2) return `${label} must be at least 2 characters.`;
  if (/^\d+$/.test(name.trim())) return `${label} cannot be numbers only.`;
  return null;
}

export function validateRequired(value, label) {
  if (value === null || value === undefined || (typeof value === "string" && !value.trim()))
    return `${label} is required.`;
  return null;
}

export function validateNationalId(id) {
  if (!id?.trim()) return "National ID is required.";
  if (!/^\d{14}$/.test(id.trim())) return "National ID must be exactly 14 digits.";
  return null;
}

export function validatePositiveNumber(value, label) {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num) || num < 0) return `${label} must be a positive number.`;
  return null;
}

// ─── Appointment validators ─────────────────────────────────────────────────

export function validateAppointmentDate(dateStr) {
  if (!dateStr) return "Preferred date is required.";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Enter a valid date.";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "Appointment date cannot be in the past.";
  const currentYear = today.getFullYear();
  const year = date.getFullYear();
  if (year > currentYear) {
    return `Appointments can only be scheduled within ${currentYear}. Dates in ${year} are not available yet.`;
  }
  return null;
}

export function validateAppointmentTime(timeStr) {
  if (!timeStr) return "Preferred time is required.";
  const [hours] = timeStr.split(":").map(Number);
  if (isNaN(hours)) return "Select a valid time.";
  if (hours < 8) return "Booking opens at 8:00 AM. Please select a later time.";
  if (hours >= 22) return "Booking closes at 10:00 PM. Please select an earlier time.";
  return null;
}

// ─── Payment validators ─────────────────────────────────────────────────────

export function validateCardName(name) {
  if (!name?.trim()) return "Cardholder name is required.";
  if (name.trim().length < 3) return "Enter the full cardholder name.";
  if (/\d/.test(name)) return "Name should not contain numbers.";
  if (/[^a-zA-Z\s\-'.]/.test(name)) return "Name contains invalid characters.";
  return null;
}

export function validateCardNumber(number) {
  const digits = (number || "").replace(/\s/g, "");
  if (!digits) return "Card number is required.";
  if (!/^\d+$/.test(digits)) return "Card number must contain digits only.";
  if (digits.length !== 16) return "Card number must be exactly 16 digits.";
  return null;
}

export function validateCVV(cvv) {
  if (!cvv) return "CVV is required.";
  if (!/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits.";
  return null;
}

export function validateExpiry(expiry) {
  if (!expiry) return "Expiry date is required.";
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Enter expiry as MM/YY (e.g. 08/27).";
  const [mm, yy] = expiry.split("/").map(Number);
  if (mm < 1 || mm > 12) return "Invalid expiry month (must be 01–12).";
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (yy < currentYear || (yy === currentYear && mm < currentMonth))
    return "This card has expired.";
  return null;
}

// ─── Card type detection & type-aware validation ────────────────────────────

export function detectCardType(number) {
  const digits = (number || "").replace(/\s/g, "");
  if (!digits) return null;
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  const first4 = parseInt(digits.substring(0, 4), 10);
  if (first4 >= 2221 && first4 <= 2720) return "mastercard";
  return null;
}

export function validateCardByType(number, selectedType) {
  const digits = (number || "").replace(/\s/g, "");
  if (!digits) return "Card number is required.";
  if (!/^\d+$/.test(digits)) return "Card number must contain digits only.";
  if (digits.length !== 16) return "Card number must be 16 digits.";

  if (selectedType === "visa") {
    if (!digits.startsWith("4"))
      return "Invalid Visa card number. Visa cards must start with 4.";
  } else if (selectedType === "mastercard") {
    const first2 = parseInt(digits.substring(0, 2), 10);
    const first4 = parseInt(digits.substring(0, 4), 10);
    const isOldRange = first2 >= 51 && first2 <= 55;
    const isNewRange = first4 >= 2221 && first4 <= 2720;
    if (!isOldRange && !isNewRange)
      return "Invalid MasterCard format. MasterCard must start with 51–55 or 2221–2720.";
  }

  return null;
}
