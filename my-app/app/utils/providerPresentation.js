const FALLBACK_IMAGES = {
  sport: [
    "/images/Sport.png",
    "/images/Trn 1.png",
    "/images/Trn 2.png",
    "/images/Trn 3.png",
    "/images/Trn 4.png",
    "/images/Al-Ahly-SC-1500x1000.jpg",
  ],
  clinic: [
    "/images/Clinic.png",
    "/images/about1.png",
    "/images/about2.png",
    "/images/about3.png",
  ],
  school: [
    "/images/School.png",
    "/images/csc-campus-view.jpg",
    "/images/about1.png",
    "/images/about2.png",
    "/images/about3.png",
  ],
};

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const NAME_BASED_IMAGES = [
  { match: /ahly|al ahly/i,    image: "/images/Al_Ahly_SC_logo.svg.png" },
  { match: /zamalek/i,         image: "/images/zamalek.png" },
  { match: /wadi debla/i,      image: "/images/Wadi Debla.jpg" },
  { match: /tennis/i,          image: "/images/Egytennis-el-Ahly-nasrcity-courts-02.png" },
  { match: /hope/i,            image: "/images/621c175954c1fe4ab610f948_hope-logo.png" },
  { match: /nasser|nasr/i,     image: "/images/Trn 1.png" },
  { match: /shooting/i,        image: "/images/Trn 2.png" },
  { match: /smouha/i,          image: "/images/Trn 3.png" },
  { match: /ittihad/i,         image: "/images/Trn 4.png" },
];

const socialKeywords = {
  whatsapp: /(wa\.me|whatsapp)/i,
  facebook: /facebook/i,
  instagram: /instagram/i,
};

function normalizeUploadsPath(value) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http") || value.startsWith("data:") || value.startsWith("/")) {
    return value;
  }

  return `http://localhost:5000/uploads/${value}`;
}

// Uses the provider's own ID as a stable fallback selector so the same
// provider always gets the same placeholder image regardless of where in
// a list it appears (card grid vs. details page vs. profile page).
export function resolveProviderImage(provider = {}, providerType = "sport", index = 0) {
  const directImage =
    provider.image ||
    provider.logo ||
    provider.school_image ||
    provider.clinic_image ||
    provider.sport_center_image ||
    provider.file_name ||
    "";

  console.log("Provider image source:", directImage || "(none — using fallback)", "type:", providerType);

  if (directImage) {
    return normalizeUploadsPath(directImage);
  }

  const providerName =
    provider.name ||
    provider.school_name ||
    provider.clinic_name ||
    provider.sport_center_name ||
    "";

  const matchedImage = NAME_BASED_IMAGES.find((entry) => entry.match.test(providerName));
  if (matchedImage) {
    return matchedImage.image;
  }

  // Use the provider's own stable ID so the fallback image is the same on
  // every page (card grid, details page, profile). Falls back to array index
  // only when no ID exists (e.g. static/seeded data without an ID).
  const stableId =
    provider.sport_center_id ??
    provider.clinic_id ??
    provider.school_id ??
    provider.id ??
    index;

  const fallbacks = FALLBACK_IMAGES[providerType] || ["/images/logo.jpeg"];
  return fallbacks[Number(stableId) % fallbacks.length];
}

export function buildProviderDetailsHref(providerType, providerId) {
  return `/clubdetails?type=${providerType}&id=${providerId}`;
}

export function buildProviderAppointmentHref(providerType, providerId, providerName) {
  return `/appointment?type=${providerType}&id=${providerId}&name=${encodeURIComponent(providerName || "")}`;
}

export function parseSocialLinks(provider = {}) {
  const rawLinks = provider.social_media_links || provider.socials || provider.social_links || "";
  const phone = provider.phone_number || provider.tel_no || provider.phone || "";
  const email = provider.email_address || provider.email || "";
  const normalized = {
    whatsapp: phone ? `https://wa.me/${String(phone).replace(/\D/g, "")}` : "",
    facebook: "",
    instagram: "",
    call: phone ? `tel:${phone}` : "",
    email: email ? `mailto:${email}` : "",
  };

  if (!rawLinks) {
    return normalized;
  }

  if (typeof rawLinks === "object") {
    return { ...normalized, ...rawLinks };
  }

  const parts = String(rawLinks)
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  parts.forEach((part) => {
    if (socialKeywords.whatsapp.test(part)) {
      normalized.whatsapp = part;
    } else if (socialKeywords.facebook.test(part)) {
      normalized.facebook = part;
    } else if (socialKeywords.instagram.test(part)) {
      normalized.instagram = part;
    } else if (part.startsWith("mailto:")) {
      normalized.email = part;
    } else if (part.startsWith("tel:")) {
      normalized.call = part;
    }
  });

  return normalized;
}

export function normalizeProviderDetails(provider = {}, providerType = "sport") {
  const name =
    provider.sport_center_name ||
    provider.clinic_name ||
    provider.school_name ||
    provider.name ||
    "Provider";

  const category =
    provider.sport_center_type ||
    provider.clinic_type ||
    provider.special_type ||
    provider.category_of_school ||
    provider.type ||
    "Support Provider";

  const phone = provider.phone_number || provider.tel_no || provider.phone || "";
  const email = provider.email_address || provider.email || "";
  const location = provider.location || provider.city || provider.government || "";
  const price =
    provider.session_price_range ||
    [provider.session_price_min, provider.session_price_max].filter(Boolean).join(" - ") ||
    provider.annual_fees ||
    provider.registration_fees ||
    "";

  return {
    ...provider,
    providerType,
    id:
      provider.sport_center_id ||
      provider.clinic_id ||
      provider.school_id ||
      provider.id,
    name,
    category,
    phone,
    email,
    location,
    price,
    image: resolveProviderImage(provider, providerType),
    socials: parseSocialLinks(provider),
    appointmentHref: buildProviderAppointmentHref(
      providerType,
      provider.sport_center_id || provider.clinic_id || provider.school_id || provider.id,
      name
    ),
  };
}
