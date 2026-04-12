import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import type { SiteSettings } from "@/types";

const LEGACY_BRAND_MARKERS = ["dentacare", "dis klinigi", "dental clinic"];

const LEGACY_COPY_MARKERS = [
  "saglikli bir gulus icin dogru adres",
  "the right address for a healthy smile",
  "uzman ekibimiz ve modern teknolojimizle",
  "we offer the best dental care with our expert team and modern technology",
  "gaziantep'in en guvenilir dis klinigi",
  "gaziantep dental clinic",
  "2010 yilindan bu yana gaziantep'te",
  "has been providing dental health services in gaziantep since 2010",
];

const ADAKAN_INSTAGRAM = "https://instagram.com/adakansoftware";
const ADAKAN_FACEBOOK = "https://facebook.com/adakansoftware";

function normalizeForComparison(value?: string) {
  return (value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAnyMarker(value: string | undefined, markers: string[]) {
  const normalized = normalizeForComparison(value);
  return markers.some((marker) => normalized.includes(normalizeForComparison(marker)));
}

function hasLegacyClinicBrand(value?: string) {
  return includesAnyMarker(value, LEGACY_BRAND_MARKERS);
}

function hasLegacyClinicCopy(value?: string) {
  return includesAnyMarker(value, LEGACY_COPY_MARKERS);
}

function resolveBrandSocialUrl(value: string | undefined, fallback: string) {
  if (!value || hasLegacyClinicBrand(value)) {
    return fallback;
  }

  return value;
}

function resolveBrandText(value: string | undefined, fallback: string) {
  if (!value || hasLegacyClinicBrand(value) || hasLegacyClinicCopy(value)) {
    return fallback;
  }

  return value;
}

function resolveClinicCopy(value: string | undefined, fallback: string) {
  if (!value || hasLegacyClinicBrand(value) || hasLegacyClinicCopy(value)) {
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
  heroTitleTr: "Saglikli ve Guvenli Gulusler Icin Yandayiz",
  heroTitleEn: "Trusted Dental Care for Healthy Smiles",
  heroSubtitleTr:
    "Genel dis hekimligi, estetik uygulamalar ve koruyucu bakim sureclerinde size ozenli ve anlasilir bir tedavi deneyimi sunuyoruz.",
  heroSubtitleEn:
    "We provide attentive and transparent care across general dentistry, aesthetic treatments, and preventive oral health services.",
  aboutTitleTr: "Hakkimizda",
  aboutTitleEn: "About Us",
  aboutTextTr:
    "Klinigimizde her hastayi ayrintili muayene, acik bilgilendirme ve kisinin ihtiyacina uygun tedavi planlamasi ile karsiliyoruz. Amacimiz yalnizca mevcut sikayeti gidermek degil, uzun vadeli agiz ve dis sagligini koruyan guvenli bir bakim sureci sunmaktir.",
  aboutTextEn:
    "At our clinic, each patient is welcomed with a careful examination, clear communication, and a treatment plan tailored to individual needs. Our goal is not only to solve the current complaint, but also to support long-term oral health through reliable care.",
  seoTitleTr: "Adakan",
  seoTitleEn: "Adakan",
  seoDescTr:
    "Adakan dis klinigi; muayene, estetik uygulamalar ve koruyucu bakim hizmetleri icin randevu olusturabileceginiz resmi klinik sitesidir.",
  seoDescEn: "Adakan dental clinic official website for examinations, aesthetic treatments, and preventive care appointments.",
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
    heroTitleTr: resolveClinicCopy(map.heroTitleTr, DEFAULT_SETTINGS.heroTitleTr),
    heroTitleEn: resolveClinicCopy(map.heroTitleEn, DEFAULT_SETTINGS.heroTitleEn),
    heroSubtitleTr: resolveClinicCopy(map.heroSubtitleTr, DEFAULT_SETTINGS.heroSubtitleTr),
    heroSubtitleEn: resolveClinicCopy(map.heroSubtitleEn, DEFAULT_SETTINGS.heroSubtitleEn),
    aboutTitleTr: map.aboutTitleTr ?? DEFAULT_SETTINGS.aboutTitleTr,
    aboutTitleEn: map.aboutTitleEn ?? DEFAULT_SETTINGS.aboutTitleEn,
    aboutTextTr: resolveClinicCopy(map.aboutTextTr, DEFAULT_SETTINGS.aboutTextTr),
    aboutTextEn: resolveClinicCopy(map.aboutTextEn, DEFAULT_SETTINGS.aboutTextEn),
    seoTitleTr: DEFAULT_SETTINGS.seoTitleTr,
    seoTitleEn: DEFAULT_SETTINGS.seoTitleEn,
    seoDescTr: resolveClinicCopy(map.seoDescTr, DEFAULT_SETTINGS.seoDescTr),
    seoDescEn: resolveClinicCopy(map.seoDescEn, DEFAULT_SETTINGS.seoDescEn),
    logoUrl: map.logoUrl ?? DEFAULT_SETTINGS.logoUrl,
    faviconUrl: map.faviconUrl ?? DEFAULT_SETTINGS.faviconUrl,
  };
}
