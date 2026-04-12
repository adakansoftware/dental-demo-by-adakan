"use client";

import Image from "next/image";
import { useLang } from "@/context/LangContext";
import SectionIntro from "@/components/shared/SectionIntro";
import { t } from "@/lib/translations";
import PageHero from "@/components/shared/PageHero";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings;
}

const ABOUT_VISUALS = {
  clinic:
    "https://images.pexels.com/photos/15771800/pexels-photo-15771800.jpeg?cs=srgb&dl=pexels-gaspar-osorio-3389569-15771800.jpg&fm=jpg",
  doctor:
    "https://images.pexels.com/photos/12917343/pexels-photo-12917343.jpeg?cs=srgb&dl=pexels-iamluisao-12917343.jpg&fm=jpg",
  treatment:
    "https://images.pexels.com/photos/7422520/pexels-photo-7422520.jpeg?cs=srgb&dl=pexels-emerickalil-7422520.jpg&fm=jpg",
} as const;

export default function AboutClient({ settings }: Props) {
  const { lang } = useLang();

  const title = lang === "tr" ? settings.aboutTitleTr : settings.aboutTitleEn;
  const text = lang === "tr" ? settings.aboutTextTr : settings.aboutTextEn;
  const visualMoments = [
    {
      src: ABOUT_VISUALS.clinic,
      alt: lang === "tr" ? "Klinik bekleme ve tedavi alani" : "Clinic waiting and treatment area",
      label: lang === "tr" ? "Klinik atmosferi" : "Clinic atmosphere",
      className: "lg:col-span-2",
    },
    {
      src: ABOUT_VISUALS.doctor,
      alt: lang === "tr" ? "Uzman hekim portresi" : "Specialist portrait",
      label: lang === "tr" ? "Uzman yaklasim" : "Specialist approach",
      className: "",
    },
    {
      src: ABOUT_VISUALS.treatment,
      alt: lang === "tr" ? "Tedavi detay goruntusu" : "Treatment detail image",
      label: lang === "tr" ? "Tedavi detaylari" : "Treatment details",
      className: "",
    },
  ];

  const values = [
    {
      number: "01",
      title: lang === "tr" ? "Kisiye uygun planlama" : "Personal planning",
      desc:
        lang === "tr"
          ? "Muayene bulgulari ve beklentiler birlikte degerlendirilir."
          : "Clinical findings and patient expectations are reviewed together.",
    },
    {
      number: "02",
      title: lang === "tr" ? "Acik iletisim" : "Clear communication",
      desc:
        lang === "tr"
          ? "Surec boyunca duzenli, sakin ve anlasilir bir dil korunur."
          : "Communication remains calm, consistent, and easy to understand throughout the process.",
    },
    {
      number: "03",
      title: lang === "tr" ? "Hasta konforu" : "Patient comfort",
      desc:
        lang === "tr"
          ? "Hijyen, duzen ve psikolojik rahatlik klinik deneyimin bir parcasi olarak ele alinir."
          : "Hygiene, order, and emotional comfort are treated as part of the clinical experience.",
    },
  ];

  return (
    <>
      <PageHero
        kicker={lang === "tr" ? "Hakkimizda" : "About"}
        title={title}
        subtitle={
          lang === "tr"
            ? "Klinigimiz; dogru teshis, acik bilgilendirme ve kisiye uygun tedavi planlamasini oncelik kabul eder."
            : "Our clinic prioritizes accurate diagnosis, clear communication, and treatment planning tailored to each patient."
        }
        minimal
      >
        <div className="hero-panel hero-panel--compact p-6 text-sm leading-relaxed text-[color:var(--text-secondary)]">
          {lang === "tr" ? "Her hastaya dikkatli takip, anlasilir bilgi ve konforlu bir klinik deneyimi sunmayi hedefliyoruz." : "We aim to offer each patient attentive follow-up, understandable guidance, and a comfortable clinic experience."}
        </div>
      </PageHero>

      <section className="section-block">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="editorial-panel p-8 md:p-10">
              <SectionIntro
                title={
                  lang === "tr"
                    ? "Tedavi surecinde guven ve acik iletisim bizim icin esastir"
                    : "Trust and clear communication are essential throughout treatment"
                }
              />
              <p className="whitespace-pre-line text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">{text}</p>
            </div>

            <div className="grid gap-5">
              {values.map((item) => (
                <article key={item.title} className="card p-7">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-main)]">{item.number}</div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-secondary)]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="soft-section section-block">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <SectionIntro
              kicker={lang === "tr" ? "Mekansal Hissiyat" : "Spatial Feel"}
              title={
                lang === "tr"
                  ? "Klinik ortamini ve tedavi alanlarini onceden gorebilirsiniz"
                  : "You can preview the clinic environment and treatment rooms in advance"
              }
              subtitle={
                lang === "tr"
                  ? "Muayene odalari, hekim kadrosu ve uygulama alanlari hakkinda daha net bir ilk izlenim olusturuyoruz."
                  : "We provide a clearer first impression of treatment rooms, clinicians, and care spaces."
              }
            />

            <div className="grid gap-4 sm:grid-cols-3">
              {visualMoments.map((item) => (
                <div key={item.src} className={`ambient-card overflow-hidden ${item.className}`}>
                  <div className="relative aspect-[4/4.1] overflow-hidden rounded-[1.4rem]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="image-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,31,27,0.26)] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full border border-white/35 bg-[rgba(28,28,25,0.36)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="soft-section section-block">
        <div className="section-shell">
          <SectionIntro
            align="center"
            kicker={t("about", "whyUs", lang)}
            title={
              lang === "tr"
                ? "Tedavi surecini saglik, konfor ve takip butunlugu icinde ele aliyoruz"
                : "We approach treatment as a complete balance of health, comfort, and follow-up"
            }
            subtitle={
              lang === "tr"
                ? "Hastalarimizin kendini guvende hissetmesi icin muayene oncesinden kontrol randevusuna kadar duzenli bir surec sunuyoruz."
                : "We offer a structured process from first consultation to follow-up visits so patients feel informed and secure."
            }
          />
        </div>
      </section>
    </>
  );
}
