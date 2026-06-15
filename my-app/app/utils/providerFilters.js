function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function toTitleCase(value = "") {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function splitValues(...values) {
  return values
    .flatMap((value) =>
      String(value || "")
        .split(/[,/;|]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    );
}

// Rejects obvious garbage values: pure numbers, repeated chars, emails, too short
function isValidFilterValue(value) {
  if (!value || typeof value !== "string") return false;
  const v = value.trim();
  if (v.length < 3) return false;
  if (v.includes("@")) return false;
  if (/^\d+$/.test(v)) return false;
  if (/^(.)\1{2,}$/i.test(v)) return false;
  if (/^(null|undefined|n\/a|na|none|test|xxx|yyy|zzz)$/i.test(v)) return false;
  return true;
}

export function getSportTypeLabel(provider = {}) {
  const source = `${provider.sport_center_type || ""} ${provider.sports_type_offered || ""}`.toLowerCase();

  if (source.includes("football") || source.includes("soccer")) return "Football";
  if (source.includes("swim")) return "Swimming";
  if (source.includes("adaptive")) return "Adaptive Sports";
  if (source.includes("therapy")) return "Therapy Sports";
  if (source.includes("basketball")) return "Basketball";
  if (source.includes("martial") || source.includes("karate") || source.includes("judo") || source.includes("taekwondo")) return "Martial Arts";
  if (source.includes("tennis")) return "Tennis";
  if (source.includes("gym") || source.includes("fitness")) return "Gym & Fitness";
  if (source.includes("academy")) return "Sports Academy";
  if (source.includes("club")) return "Private Sports Club";
  if (source.includes("athletics") || source.includes("track")) return "Athletics";
  if (source.includes("cycling") || source.includes("bike")) return "Cycling";

  // Never leak raw DB garbage — fall back to generic label
  return "Sports";
}

export function getMedicalTypeLabel(provider = {}) {
  const source = `${provider.clinic_type || ""} ${provider.specialization_type || ""} ${provider.specialized_therapists || ""}`.toLowerCase();

  if (source.includes("speech") || source.includes("language therapy")) return "Speech Therapy";
  if (source.includes("occupational")) return "Occupational Therapy";
  if (source.includes("neuro")) return "Neurology";
  if (source.includes("psy") || source.includes("mental health")) return "Psychiatry";
  if (source.includes("physio") || source.includes("physical therapy")) return "Physiotherapy";
  if (source.includes("autism") || source.includes("asd")) return "Autism Therapy";
  if (source.includes("behavior") || source.includes("aba")) return "Behavioral Therapy";
  if (source.includes("sensory")) return "Sensory Integration";
  if (source.includes("develop")) return "Developmental Therapy";

  return "Medical";
}

export function getSchoolTypeLabel(provider = {}) {
  const source = `${provider.category_of_school || ""} ${provider.special_type || ""} ${provider.curriculum_type || ""}`.toLowerCase();

  if (source.includes("international")) return "International School";
  if (source.includes("language")) return "Language School";
  if (source.includes("special")) return "Special Education";
  if (source.includes("inclusive")) return "Inclusive School";
  if (source.includes("develop")) return "Development Center";
  if (source.includes("therapy") || source.includes("rehab")) return "Therapeutic School";
  if (source.includes("vocational")) return "Vocational Training";

  return "School";
}

export function getAgeGroups(...values) {
  const source = values.join(" ").toLowerCase();
  const groups = [];

  if (/\b[0-3]\b|infant|toddler|early intervention|under.?4|below.?4/.test(source)) groups.push("0–3");
  if (/\b[4-6]\b|preschool|pre.?school|\bkg\b|kindergarten|kinder|nursery/.test(source)) groups.push("4–6");
  if (/\b[7-9]\b|\b1[012]\b|primary|elementary|school.?age|children|\bkids\b/.test(source)) groups.push("7–12");
  if (/teen|adolescent|secondary|prep\b|high.?school|junior|\b1[3-8]\b/.test(source)) groups.push("Teens");
  if (/adult|18\+|all.?age|every.?age|family|\b[2-9]\d\b/.test(source)) groups.push("Adults");

  return uniqueValues(groups);
}

export function getDiagnoses(...values) {
  const source = values.join(" ").toLowerCase();
  const diagnoses = [];

  if (source.includes("autism") || source.includes("asd")) diagnoses.push("Autism");
  if (source.includes("adhd") || source.includes("attention deficit")) diagnoses.push("ADHD");
  if (source.includes("down syndrome") || source.includes("down's")) diagnoses.push("Down Syndrome");
  if (source.includes("speech") || source.includes("language delay")) diagnoses.push("Speech Delay");
  if (source.includes("cerebral palsy") || /\bcp\b/.test(source)) diagnoses.push("Cerebral Palsy");
  if (source.includes("learning disab") || source.includes("learning diff")) diagnoses.push("Learning Disabilities");
  if (source.includes("sensory")) diagnoses.push("Sensory Processing Disorder");
  if (source.includes("physical disab") || source.includes("motor disab")) diagnoses.push("Physical Disability");
  if (source.includes("intellectual")) diagnoses.push("Intellectual Disability");
  if (source.includes("deaf") || source.includes("hearing")) diagnoses.push("Hearing Impairment");
  if (source.includes("visual") || source.includes("blind")) diagnoses.push("Visual Impairment");
  if (source.includes("anxiety") || source.includes("behavioral disorder")) diagnoses.push("Behavioral Disorder");

  return uniqueValues(diagnoses);
}

export function buildSearchText(fields = []) {
  return fields
    .flatMap((field) => (Array.isArray(field) ? field : [field]))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getDynamicOptions(data, key) {
  return uniqueValues(
    data.flatMap((item) => (Array.isArray(item[key]) ? item[key] : [item[key]]))
  )
    .filter(isValidFilterValue)
    .map((value) => ({ value, label: value }));
}

// maxCap prevents slider from showing absurd values from bad DB data
export function getMaxValue(data, key, fallback, maxCap = Infinity) {
  const values = data
    .map((item) => Number(item[key]))
    .filter((value) => Number.isFinite(value) && value > 0 && value <= maxCap);

  if (values.length === 0) {
    return fallback;
  }

  return Math.max(...values);
}

// Parses "200", "200-500", "from 300", etc. → returns the highest number found
export function parsePriceRange(value) {
  if (!value) return null;
  const nums = String(value).match(/\d+(\.\d+)?/g);
  if (!nums) return null;
  const parsed = nums.map(Number).filter((n) => n > 0 && n < 1000000);
  return parsed.length > 0 ? Math.max(...parsed) : null;
}

export function roundBudget(value) {
  if (value <= 1000)  return Math.ceil(value / 100) * 100;
  if (value <= 5000)  return Math.ceil(value / 500) * 500;
  if (value <= 20000) return Math.ceil(value / 1000) * 1000;
  if (value <= 100000) return Math.ceil(value / 5000) * 5000;
  return Math.ceil(value / 10000) * 10000;
}

export function createServicesList(...values) {
  return uniqueValues(splitValues(...values)).map((value) => toTitleCase(value));
}
