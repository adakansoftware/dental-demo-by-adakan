import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import type { SiteSettings } from "@/types";

const LEGACY_BRAND_MARKERS = [
  "dentacare",
  "diş kliniği",
  "dis klinigi",
  "dental clinic",
];

const ADAKAN_INSTAGRAM = "https://instagram.com/adakansoftware";
const ADAKAN_FACEBOOK = "https://facebook.com/adakansoftware";

function normalizeForComparison(value?: string) {
  return (value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasLegacyClinicBrand(value?: string) {
  const normalized = normalizeForComparison(value);
  return LEGACY_BRAND_MARKERS.some((marker) => normalized.includes(normalizeForComparison(marker)));
}

function resolveBrandSocialUrl(value: string | undefined, fallback: string) {
  if (!value || hasLegacyClinicBrand(value)) {
    return fallback;
  }

  return value;
}

function resolveBrandText(value: string | undefined, fallback: string) {
  if (!value || hasLegacyClinicBrand(value)) {
    return fallback;
  }

  return value;
}

const DEFAULT_SETTINGS: SiteSettings = {
  clinicName: "Adakan",
  clinicNameEn: "Adakan",
  phone: "+90 342 000 00 00",
  whatsapp: "+905320000000",
  email: "info@adakan.com",
  address: "Gaziantep, Turkiye",
  addressEn: "Gaziantep, Turkey",
  mapEmbedUrl: "",
  instagram: ADAKAN_INSTAGRAM,
  facebook: ADAKAN_FACEBOOK,
  twitter: "",
  heroTitleTr: "Saglikli Bir Gulus Icin Dogru Adres",
  heroTitleEn: "The Right Address for a Healthy Smile",
  heroSubtitleTr: "Uzman ekibimiz ile agiz ve dis sagliginiz icin buradayiz.",
  heroSubtitleEn: "We are here for your oral and dental health with our expert team.",
  aboutTitleTr: "Hakkimizda",
  aboutTitleEn: "About Us",
  aboutTextTr: "Adakan hakkinda bilgi...",
  aboutTextEn: "About Adakan...",
  seoTitleTr: "Adakan",
  seoTitleEn: "Adakan",
  seoDescTr: "Adakan resmi demo sitesi",
  seoDescEn: "Official Adakan demo site",
  logoUrl: "",
  faviconUrl: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await safeQuery("site settings", () => prisma.siteSetting.findMany(), []);
  const map: Record<string, string> = {};

  for (const row of rows) {
    map[row.key] = row.value;
  }

  return {
    clinicName: DEFAULT_SETTINGS.clinicName,
    clinicNameEn: DEFAULT_SETTINGS.clinicNameEn,
    phone: map.phone ?? DEFAULT_SETTINGS.phone,
    whatsapp: map.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
    email: hasLegacyClinicBrand(map.email) ? DEFAULT_SETTINGS.email : map.email ?? DEFAULT_SETTINGS.email,
    address: map.address ?? DEFAULT_SETTINGS.address,
    addressEn: map.addressEn ?? DEFAULT_SETTINGS.addressEn,
    mapEmbedUrl: map.mapEmbedUrl ?? DEFAULT_SETTINGS.mapEmbedUrl,
    instagram: resolveBrandSocialUrl(map.instagram, DEFAULT_SETTINGS.instagram),
    facebook: resolveBrandSocialUrl(map.facebook, DEFAULT_SETTINGS.facebook),
    twitter: map.twitter ?? DEFAULT_SETTINGS.twitter,
    heroTitleTr: map.heroTitleTr ?? DEFAULT_SETTINGS.heroTitleTr,
    heroTitleEn: map.heroTitleEn ?? DEFAULT_SETTINGS.heroTitleEn,
    heroSubtitleTr: map.heroSubtitleTr ?? DEFAULT_SETTINGS.heroSubtitleTr,
    heroSubtitleEn: map.heroSubtitleEn ?? DEFAULT_SETTINGS.heroSubtitleEn,
    aboutTitleTr: map.aboutTitleTr ?? DEFAULT_SETTINGS.aboutTitleTr,
    aboutTitleEn: map.aboutTitleEn ?? DEFAULT_SETTINGS.aboutTitleEn,
    aboutTextTr: resolveBrandText(map.aboutTextTr, DEFAULT_SETTINGS.aboutTextTr),
    aboutTextEn: resolveBrandText(map.aboutTextEn, DEFAULT_SETTINGS.aboutTextEn),
    seoTitleTr: DEFAULT_SETTINGS.seoTitleTr,
    seoTitleEn: DEFAULT_SETTINGS.seoTitleEn,
    seoDescTr: resolveBrandText(map.seoDescTr, DEFAULT_SETTINGS.seoDescTr),
    seoDescEn: resolveBrandText(map.seoDescEn, DEFAULT_SETTINGS.seoDescEn),
    logoUrl: map.logoUrl ?? DEFAULT_SETTINGS.logoUrl,
    faviconUrl: map.faviconUrl ?? DEFAULT_SETTINGS.faviconUrl,
  };
}
