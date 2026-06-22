// lib/propertyStore.ts
// In-memory + localStorage backed store for Phase 1 (no backend yet)

export type Configuration = {
  type: string; // e.g. "2BHK", "3BHK"
  carpetArea: string; // e.g. "1200 sqft"
  startingPrice: string; // e.g. "₹1.2 Cr"
};

export type Property = {
  id: string;
  slug: string;
  projectName: string;
  developerName: string;
  city: string;
  sector: string;
  area: string;
  mapsLink: string;
  reraNumber: string;
  propertyType: "Apartment" | "Villa" | "Plot";
  configurations: Configuration[];
  possessionDate: string;
  totalUnits: number;
  floors: number;
  groupSlots: number;
  slotsFilled: number;
  membershipFee: number;
  heroImage: string; // base64 or URL
  gallery: string[];
  amenities: string[];
  tagline: string;
  description: string;
  aboutDeveloper: string;
  locationHighlights: string;
  status: "active" | "inactive" | "soldOut";
  isBestPrice: boolean;
  isFeatured: boolean;
  promotionalTag: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "pw_properties";

const defaultProperties: Property[] = [
  {
    id: "1",
    slug: "county-presidentia-noida",
    projectName: "County Presidentia",
    developerName: "County Group",
    city: "Noida",
    sector: "Sector 102",
    area: "Uttar Pradesh",
    mapsLink: "https://maps.google.com",
    reraNumber: "UPRERAPRJ12345",
    propertyType: "Apartment",
    configurations: [
      { type: "2BHK", carpetArea: "1288 sqft", startingPrice: "₹1.85 Cr" },
      { type: "3BHK", carpetArea: "2100 sqft", startingPrice: "₹2.52 Cr" },
      { type: "4BHK", carpetArea: "3677 sqft", startingPrice: "₹4.10 Cr" },
    ],
    possessionDate: "2026-12-31",
    totalUnits: 480,
    floors: 32,
    groupSlots: 10,
    slotsFilled: 6,
    membershipFee: 5000,
    heroImage: "/property_villa.png",
    gallery: ["/property_villa.png", "/property_apartment.png"],
    amenities: ["Swimming Pool", "Gymnasium", "Clubhouse", "24/7 Security", "Power Backup", "EV Charging"],
    tagline: "Premium living in the heart of Noida",
    description: "County Presidentia is a landmark premium residential project offering spacious 2, 3, and 4 BHK apartments with world-class amenities.",
    aboutDeveloper: "County Group has 20+ years of experience delivering premium real estate projects across Uttar Pradesh.",
    locationHighlights: "2 min from Sector 101 Metro | 5 min from Expressway | Near DPS School | Fortis Hospital 10 min",
    status: "active",
    isBestPrice: true,
    isFeatured: true,
    promotionalTag: "Selling Fast",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "eldeco-whispers-of-wonder",
    projectName: "Eldeco Whispers of Wonder",
    developerName: "Eldeco Group",
    city: "Greater Noida",
    sector: "Sector 22D, YEIDA",
    area: "Greater Noida West",
    mapsLink: "https://maps.google.com",
    reraNumber: "UPRERAPRJ23456",
    propertyType: "Apartment",
    configurations: [
      { type: "2BHK", carpetArea: "1150 sqft", startingPrice: "₹1.10 Cr" },
      { type: "3BHK", carpetArea: "1800 sqft", startingPrice: "₹1.63 Cr" },
    ],
    possessionDate: "2027-06-30",
    totalUnits: 320,
    floors: 24,
    groupSlots: 8,
    slotsFilled: 3,
    membershipFee: 3500,
    heroImage: "/property_apartment.png",
    gallery: ["/property_apartment.png"],
    amenities: ["Swimming Pool", "Gymnasium", "Clubhouse", "Landscaped Gardens", "Jogging Track"],
    tagline: "Whispers of luxury, echoes of value",
    description: "Eldeco Whispers of Wonder offers a unique living experience with green spaces, modern architecture, and group-buying benefits.",
    aboutDeveloper: "Eldeco Group is a SEBI-listed company with 40+ years of real estate expertise.",
    locationHighlights: "Near Yamuna Expressway | 15 min from Jewar Airport | YEIDA Township",
    status: "active",
    isBestPrice: false,
    isFeatured: true,
    promotionalTag: "Limited Units",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "vayu-by-rearco",
    projectName: "Vayu by ReaRCo",
    developerName: "ReaRCo Developers",
    city: "Greater Noida",
    sector: "Techzone 4",
    area: "Greater Noida West",
    mapsLink: "https://maps.google.com",
    reraNumber: "UPRERAPRJ34567",
    propertyType: "Apartment",
    configurations: [
      { type: "2BHK", carpetArea: "950 sqft", startingPrice: "₹65 L" },
      { type: "3BHK", carpetArea: "1450 sqft", startingPrice: "₹96.71 L" },
    ],
    possessionDate: "2026-03-31",
    totalUnits: 240,
    floors: 20,
    groupSlots: 10,
    slotsFilled: 0,
    membershipFee: 2500,
    heroImage: "/property_condo.png",
    gallery: ["/property_condo.png"],
    amenities: ["Gymnasium", "Clubhouse", "24/7 Security", "Power Backup", "Parking"],
    tagline: "Be the first. Shape the group. Save big.",
    description: "Vayu by ReaRCo presents affordable yet premium living in the tech corridor of Greater Noida. Be the founding member of this group buy.",
    aboutDeveloper: "ReaRCo Developers is a fast-growing real estate firm specializing in affordable premium housing.",
    locationHighlights: "Near IT Corridor | 5 min from NH-24 | Upcoming Metro Station 2 km",
    status: "active",
    isBestPrice: false,
    isFeatured: false,
    promotionalTag: "Be First Member",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getProperties(): Property[] {
  if (typeof window === "undefined") return defaultProperties;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProperties));
      return defaultProperties;
    }
    return JSON.parse(stored) as Property[];
  } catch {
    return defaultProperties;
  }
}

export function getPropertyById(id: string): Property | undefined {
  return getProperties().find((p) => p.id === id);
}

export function saveProperty(property: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt">): Property {
  const properties = getProperties();
  const newProp: Property = {
    ...property,
    id: Date.now().toString(),
    slug: property.projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...properties, newProp];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newProp;
}

export function updateProperty(id: string, data: Partial<Property>): Property | null {
  const properties = getProperties();
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...properties[idx], ...data, updatedAt: new Date().toISOString() };
  properties[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  return updated;
}

export function deleteProperty(id: string): boolean {
  const properties = getProperties();
  const filtered = properties.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length < properties.length;
}

export const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gymnasium",
  "Clubhouse",
  "24/7 Security",
  "Power Backup",
  "EV Charging",
  "Landscaped Gardens",
  "Jogging Track",
  "Parking",
  "Kids Play Area",
  "Lift / Elevator",
  "CCTV Surveillance",
  "Intercom",
  "Indoor Games Room",
  "Yoga / Meditation Area",
];
