import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import type { SiteSettings } from "@/types";

function hasLegacyClinicBrand(value?: string) {
  if (!value) return false;
  const lower = value.toLowerCase();
  return lower.includes("dentacare") || lower.includes("diş kliniği") || lower.includes("dental clinic");
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
  instagram: "",
  facebook: "",
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
    clinicName: "Adakan",
    clinicNameEn: "Adakan",
    phone: map.phone ?? DEFAULT_SETTINGS.phone,
    whatsapp: map.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
    email: map.email === "info@dentacare.com.tr" ? DEFAULT_SETTINGS.email : map.email ?? DEFAULT_SETTINGS.email,
    address: map.address ?? DEFAULT_SETTINGS.address,
    addressEn: map.addressEn ?? DEFAULT_SETTINGS.addressEn,
    mapEmbedUrl: map.mapEmbedUrl ?? DEFAULT_SETTINGS.mapEmbedUrl,
    instagram:
      !map.instagram || map.instagram.toLowerCase().includes("dentacare")
        ? "https://instagram.com/adakansoftware"
        : map.instagram,
    facebook:
      !map.facebook || map.facebook.toLowerCase().includes("dentacare")
        ? "https://facebook.com/adakansoftware"
        : map.facebook,
    twitter: map.twitter ?? DEFAULT_SETTINGS.twitter,
    heroTitleTr: map.heroTitleTr ?? DEFAULT_SETTINGS.heroTitleTr,
    heroTitleEn: map.heroTitleEn ?? DEFAULT_SETTINGS.heroTitleEn,
    heroSubtitleTr: map.heroSubtitleTr ?? DEFAULT_SETTINGS.heroSubtitleTr,
    heroSubtitleEn: map.heroSubtitleEn ?? DEFAULT_SETTINGS.heroSubtitleEn,
    aboutTitleTr: map.aboutTitleTr ?? DEFAULT_SETTINGS.aboutTitleTr,
    aboutTitleEn: map.aboutTitleEn ?? DEFAULT_SETTINGS.aboutTitleEn,
    aboutTextTr: !map.aboutTextTr || hasLegacyClinicBrand(map.aboutTextTr) ? DEFAULT_SETTINGS.aboutTextTr : map.aboutTextTr,
    aboutTextEn: !map.aboutTextEn || hasLegacyClinicBrand(map.aboutTextEn) ? DEFAULT_SETTINGS.aboutTextEn : map.aboutTextEn,
    seoTitleTr: "Adakan",
    seoTitleEn: "Adakan",
    seoDescTr: !map.seoDescTr || hasLegacyClinicBrand(map.seoDescTr) ? DEFAULT_SETTINGS.seoDescTr : map.seoDescTr,
    seoDescEn: !map.seoDescEn || hasLegacyClinicBrand(map.seoDescEn) ? DEFAULT_SETTINGS.seoDescEn : map.seoDescEn,
    logoUrl: map.logoUrl ?? DEFAULT_SETTINGS.logoUrl,
    faviconUrl: map.faviconUrl ?? DEFAULT_SETTINGS.faviconUrl,
  };
}
