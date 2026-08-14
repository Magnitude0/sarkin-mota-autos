// ─── Sarkin Mota Autos — shared site constants & helpers ────────────────────

export const BRAND_NAME = "Sarkin Mota Autos";
export const BRAND_TAGLINE = "King of Cars — My Bratha 👑";
export const FOUNDER = "Aliyu Mohammad";
export const WHATSAPP_NUMBER = "2347015136111";
export const PHONE_DISPLAY = "0701 513 6111";
export const PHONE_TEL = "+2347015136111";
export const ADDRESS =
  "Olusegun Obasanjo Way, beside NNPC Mega Station, Central Business District, Abuja, Nigeria";
export const TIKTOK_HANDLE = "@sarkinmota";
export const INSTAGRAM_HANDLE = "@sarkinmota";

export const MIN_DEPOSIT_PCT = 40; // %
export const EMI_ANNUAL_RATE = 0.15; // indicative 15% p.a.

export const MACHINE_OPTIONS = [
  "Mercedes G-Wagon",
  "Lexus LX 570",
  "Range Rover",
  "Land Cruiser",
  "BMW X5 / X6",
  "Porsche Cayenne",
  "Other",
];

export const CATEGORIES = [
  { name: "SUVs", type: "SUV", tile: "tile-suv", icon: "Mountain" },
  { name: "Sedans", type: "Sedan", tile: "tile-sedan", icon: "Car" },
  { name: "Luxury / Coupe", type: "Luxury", tile: "tile-luxury", icon: "Crown" },
  { name: "Trucks", type: "Truck", tile: "tile-truck", icon: "Truck" },
  { name: "Electric / Hybrid", type: "Electric", tile: "tile-electric", icon: "Zap" },
  { name: "View All", type: "All", tile: "tile-all", icon: "LayoutGrid" },
] as const;

/** Format a number as Nigerian Naira: ₦1,850,000 */
export function formatNaira(n: number): string {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

/** Build a wa.me link with a pre-filled message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WA_GENERAL = waLink(
  "👑 SARKIN MOTA — My Bratha!\n\nI'm interested in your machines. Please reach out.",
);

export const WA_SOURCE = waLink(
  "👑 SARKIN MOTA — CUSTOM SOURCE REQUEST\n\nI want to source a machine from the USA/Europe. Please contact me.",
);

export const WA_BUDGET_MATCH = waLink(
  "👑 SARKIN MOTA — BUDGET MATCH\n\nHelp me match machines to my budget and payment plan. My Bratha!",
);

/**
 * EMI calculator. Returns the down payment, balance to finance and the
 * indicative monthly payment at a flat annual rate over `months`.
 */
export function calcEMI(
  price: number,
  depositPct: number, // e.g. 40 for 40%
  months: number,
  annualRate = EMI_ANNUAL_RATE,
) {
  const deposit = Math.round(price * (depositPct / 100));
  const balance = Math.max(price - deposit, 0);
  const r = annualRate / 12;
  let monthly = 0;
  if (months > 0 && balance > 0) {
    const factor = Math.pow(1 + r, months);
    monthly = Math.round((balance * r * factor) / (factor - 1));
  }
  return { deposit, balance, monthly };
}

/** Build the WhatsApp pre-fill message for an inquiry. */
export function buildInquiryMsg(data: {
  name: string;
  phone: string;
  machine?: string;
  message?: string;
}): string {
  const lines = [
    "👑 SARKIN MOTA — NEW LEAD",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Machine: ${data.machine?.trim() || "General"}`,
    `Message: ${data.message?.trim() || "None"}`,
    "",
    "— sarkinmota.com",
  ];
  return lines.join("\n");
}

/** Saved-machines (hearts) helpers backed by localStorage. */
const SAVED_KEY = "sarkin-saved";
export function getSavedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}
export function toggleSavedId(id: string): string[] {
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
}
