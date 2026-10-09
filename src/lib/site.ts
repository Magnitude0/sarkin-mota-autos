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
export const MIN_DEPOSIT_PCT = 40;


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

