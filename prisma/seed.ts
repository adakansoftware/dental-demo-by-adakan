import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@klinik.com" },
    update: {},
    create: {
      email: "admin@klinik.com",
      passwordHash,
      name: "Klinik Yonetici",
    },
  });
  console.log("Admin created:", admin.email);

  const settings = [
    { key: "clinicName", value: "Adakan" },
    { key: "clinicNameEn", value: "Adakan" },
    { key: "phone", value: "+90 342 000 00 00" },
    { key: "whatsapp", value: "+905320000000" },
    { key: "email", value: "info@adakan.com" },
    { key: "address", value: "Gaziantep, Turkiye" },
    { key: "addressEn", value: "Gaziantep, Turkey" },
    { key: "mapEmbedUrl", value: "" },
    { key: "instagram", value: "https://instagram.com/adakansoftware" },
    { key: "facebook", value: "https://facebook.com/adakansoftware" },
    { key: "twitter", value: "" },
    { key: "heroTitleTr", value: "Saglikli ve Guvenli Gulusler Icin Yandayiz" },
    { key: "heroTitleEn", value: "Trusted Dental Care for Healthy Smiles" },
    {
      key: "heroSubtitleTr",
      value: "Genel dis hekimligi, estetik uygulamalar ve koruyucu bakim sureclerinde size ozenli ve anlasilir bir tedavi deneyimi sunuyoruz.",
    },
    {
      key: "heroSubtitleEn",
      value: "We provide attentive and transparent care across general dentistry, aesthetic treatments, and preventive oral health services.",
    },
    { key: "aboutTitleTr", value: "Hakkimizda" },
    { key: "aboutTitleEn", value: "About Us" },
    {
      key: "aboutTextTr",
      value:
        "Klinigimizde her hastayi ayrintili muayene, acik bilgilendirme ve kisinin ihtiyacina uygun tedavi planlamasi ile karsiliyoruz. Amacimiz yalnizca mevcut sikayeti gidermek degil, uzun vadeli agiz ve dis sagligini koruyan guvenli bir bakim sureci sunmaktir.",
    },
    {
      key: "aboutTextEn",
      value:
        "At our clinic, each patient is welcomed with a careful examination, clear communication, and a treatment plan tailored to individual needs. Our goal is not only to solve the current complaint, but also to support long-term oral health through reliable care.",
    },
    { key: "seoTitleTr", value: "Adakan" },
    { key: "seoTitleEn", value: "Adakan" },
    {
      key: "seoDescTr",
      value: "Adakan dis klinigi; muayene, estetik uygulamalar ve koruyucu bakim hizmetleri icin randevu olusturabileceginiz resmi klinik sitesidir.",
    },
    {
      key: "seoDescEn",
      value: "Adakan dental clinic official website for examinations, aesthetic treatments, and preventive care appointments.",
    },
    { key: "primaryColor", value: "#1a6b8a" },
    { key: "accentColor", value: "#f0a500" },
    { key: "logoUrl", value: "" },
    { key: "faviconUrl", value: "" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Settings seeded");

  const services = [
    {
      slug: "implant",
      nameTr: "Implant Tedavisi",
      nameEn: "Implant Treatment",
      shortDescTr: "Eksik disler icin kalici ve guvenli cozum",
      shortDescEn: "A reliable and lasting solution for missing teeth",
      descriptionTr:
        "Dental implant, eksik dislerin yerine yerlestirilen yapay kok yapisidir. Hem estetik gorunumu hem de cigneme fonksiyonunu destekleyen guvenilir bir tedavi secenegidir.",
      descriptionEn:
        "A dental implant is an artificial root structure placed to replace missing teeth. It is a dependable treatment option that supports both aesthetics and chewing function.",
      iconName: "implant",
      durationMinutes: 60,
      order: 1,
    },
    {
      slug: "ortodonti",
      nameTr: "Ortodonti",
      nameEn: "Orthodontics",
      shortDescTr: "Dis teli ve seffaf plak planlamalari",
      shortDescEn: "Braces and clear aligner planning",
      descriptionTr:
        "Ortodonti, dislerin ve cene yapisinin daha duzenli hale gelmesini hedefler. Tel ya da seffaf plak uygulamalariyla hem islev hem gorunum desteklenir.",
      descriptionEn:
        "Orthodontics focuses on improving the alignment of teeth and jaw structure. Braces or clear aligners can support both function and appearance.",
      iconName: "braces",
      durationMinutes: 45,
      order: 2,
    },
    {
      slug: "dis-beyazlatma",
      nameTr: "Dis Beyazlatma",
      nameEn: "Teeth Whitening",
      shortDescTr: "Daha parlak ve temiz gorunum icin klinik uygulama",
      shortDescEn: "In-clinic whitening for a brighter smile",
      descriptionTr:
        "Profesyonel dis beyazlatma uygulamasi, dis rengini daha acik ve temiz bir gorunume tasimayi hedefler. Klinik ortaminda kontrollu sekilde uygulanir.",
      descriptionEn:
        "Professional teeth whitening aims to improve tooth shade for a cleaner and brighter appearance. It is performed in a controlled clinical setting.",
      iconName: "sparkle",
      durationMinutes: 60,
      order: 3,
    },
    {
      slug: "kanal-tedavisi",
      nameTr: "Kanal Tedavisi",
      nameEn: "Root Canal Treatment",
      shortDescTr: "Dogal disi korumaya yonelik tedavi",
      shortDescEn: "Treatment focused on preserving the natural tooth",
      descriptionTr:
        "Kanal tedavisi, disin ic kismindaki enfekte ya da hasarli dokunun temizlenerek disin korunmasini hedefleyen bir islemdir.",
      descriptionEn:
        "Root canal treatment is a procedure designed to preserve the tooth by removing infected or damaged tissue from inside it.",
      iconName: "tooth",
      durationMinutes: 45,
      order: 4,
    },
    {
      slug: "protez",
      nameTr: "Protez Dis",
      nameEn: "Dental Prosthetics",
      shortDescTr: "Eksik disler icin tamamlayici protez cozumleri",
      shortDescEn: "Prosthetic solutions for missing teeth",
      descriptionTr:
        "Protez uygulamalari, eksik dislerin tamamlanmasi ve cigneme konforunun artirilmasi amaciyla planlanir. Tam ve kismi secenekler degerlendirilebilir.",
      descriptionEn:
        "Dental prosthetics are planned to restore missing teeth and improve chewing comfort. Both full and partial options can be evaluated.",
      iconName: "tooth",
      durationMinutes: 30,
      order: 5,
    },
    {
      slug: "cocuk-dis-hekimligi",
      nameTr: "Cocuk Dis Hekimligi",
      nameEn: "Pediatric Dentistry",
      shortDescTr: "Cocuklar icin sakin ve koruyucu dis bakimi",
      shortDescEn: "Calm and preventive dental care for children",
      descriptionTr:
        "Cocuk dis hekimligi, sut dislerinden kalici dislere gecis surecine kadar cocuklarin agiz ve dis sagligini korumaya odaklanir.",
      descriptionEn:
        "Pediatric dentistry focuses on protecting children's oral health from early teeth through the transition to permanent teeth.",
      iconName: "child",
      durationMinutes: 30,
      order: 6,
    },
  ];

  const createdServices: Record<string, string> = {};
  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    createdServices[service.slug] = created.id;
  }
  console.log("Services seeded");

  const specialists = [
    {
      slug: "dr-ayse-kaya",
      nameTr: "Dr. Ayse Kaya",
      nameEn: "Dr. Ayse Kaya",
      titleTr: "Dis Hekimi, Implantoloji Uzmani",
      titleEn: "Dentist, Implantology Specialist",
      biographyTr:
        "Dr. Ayse Kaya, implant ve estetik dis hekimligi alanlarinda deneyimli bir klinik uzmandir. Hastalarina acik bilgilendirme ve planli tedavi sureci sunmayi onceliklendirir.",
      biographyEn:
        "Dr. Ayse Kaya is an experienced clinician in implant and aesthetic dentistry. She prioritizes clear communication and a structured treatment process.",
      photoUrl: "/images/specialists/doctor-ayse.jpg",
      order: 1,
    },
    {
      slug: "dr-mehmet-yilmaz",
      nameTr: "Dr. Mehmet Yilmaz",
      nameEn: "Dr. Mehmet Yilmaz",
      titleTr: "Ortodonti Uzmani",
      titleEn: "Orthodontics Specialist",
      biographyTr:
        "Dr. Mehmet Yilmaz, ortodontik planlama, dis teli ve seffaf plak sureclerinde hastalarina duzenli takip ve anlasilir yonlendirme saglar.",
      biographyEn:
        "Dr. Mehmet Yilmaz provides structured follow-up and clear guidance across orthodontic planning, braces, and clear aligner treatments.",
      photoUrl: "/images/specialists/doctor-mehmet.jpg",
      order: 2,
    },
    {
      slug: "dr-fatma-demir",
      nameTr: "Dr. Fatma Demir",
      nameEn: "Dr. Fatma Demir",
      titleTr: "Cocuk Dis Hekimi",
      titleEn: "Pediatric Dentist",
      biographyTr:
        "Dr. Fatma Demir, cocuk hastalar icin sakin, guven veren ve koruyucu bakim odakli bir yaklasim benimser.",
      biographyEn:
        "Dr. Fatma Demir takes a calm, reassuring, and preventive care-focused approach for pediatric patients.",
      photoUrl: "/images/specialists/doctor-fatma.jpg",
      order: 3,
    },
  ];

  const createdSpecialists: Record<string, string> = {};
  for (const specialist of specialists) {
    const created = await prisma.specialist.upsert({
      where: { slug: specialist.slug },
      update: specialist,
      create: specialist,
    });
    createdSpecialists[specialist.slug] = created.id;
  }
  console.log("Specialists seeded");

  const assignments = [
    { specialist: "dr-ayse-kaya", services: ["implant", "dis-beyazlatma", "kanal-tedavisi", "protez"] },
    { specialist: "dr-mehmet-yilmaz", services: ["ortodonti", "dis-beyazlatma"] },
    { specialist: "dr-fatma-demir", services: ["cocuk-dis-hekimligi", "kanal-tedavisi"] },
  ];

  for (const assignment of assignments) {
    const specialistId = createdSpecialists[assignment.specialist];
    for (const serviceSlug of assignment.services) {
      const serviceId = createdServices[serviceSlug];
      if (specialistId && serviceId) {
        await prisma.specialistService.upsert({
          where: { specialistId_serviceId: { specialistId, serviceId } },
          update: {},
          create: { specialistId, serviceId },
        });
      }
    }
  }
  console.log("Specialist-Service assignments seeded");

  const specialistIds = Object.values(createdSpecialists);
  for (const specialistId of specialistIds) {
    const hours = [
      { dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: 6, startTime: "09:00", endTime: "13:00", isOpen: true },
      { dayOfWeek: 0, startTime: "09:00", endTime: "18:00", isOpen: false },
    ];

    for (const hour of hours) {
      await prisma.workingHour.upsert({
        where: { specialistId_dayOfWeek: { specialistId, dayOfWeek: hour.dayOfWeek } },
        update: hour,
        create: { specialistId, ...hour, slotMinutes: 30 },
      });
    }
  }
  console.log("Working hours seeded");

  const faqs = [
    {
      questionTr: "Randevu nasil alirim?",
      questionEn: "How do I make an appointment?",
      answerTr: "Web sitesi uzerinden online talep olusturabilir, telefonla arayabilir veya WhatsApp ile iletisime gecebilirsiniz.",
      answerEn: "You can create an online request through the website, call by phone, or contact us via WhatsApp.",
      order: 1,
    },
    {
      questionTr: "Randevumu iptal edebilir miyim?",
      questionEn: "Can I cancel my appointment?",
      answerTr: "Evet, aktif randevunuzu telefon numaraniz ve ad-soyad bilginiz ile sistem uzerinden iptal edebilirsiniz.",
      answerEn: "Yes, you can cancel your active appointment through the system using your phone number and full name.",
      order: 2,
    },
    {
      questionTr: "Sigorta kapsaminda tedavi yapiyor musunuz?",
      questionEn: "Do you provide treatment under insurance?",
      answerTr: "Anlasmali kurum ve odeme detaylari icin klinik ile dogrudan iletisime gecebilirsiniz.",
      answerEn: "Please contact the clinic directly for information about insurance and payment details.",
      order: 3,
    },
    {
      questionTr: "Dis beyazlatma kalici midir?",
      questionEn: "Is teeth whitening permanent?",
      answerTr: "Dis beyazlatma kalici bir islem degildir; ancak bakim aliskanliklarina gore etkisi uzun sure korunabilir.",
      answerEn: "Teeth whitening is not permanent, but the effect can be preserved for a long time depending on care habits.",
      order: 4,
    },
    {
      questionTr: "Implant tedavisi agrili midir?",
      questionEn: "Is implant treatment painful?",
      answerTr: "Implant islemleri lokal anestezi altinda planlanir. Surec ve sonrasindaki konfor hakkinda ayrintili bilgilendirme yapilir.",
      answerEn: "Implant procedures are planned under local anesthesia. Detailed guidance is provided about comfort during and after treatment.",
      order: 5,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQItem.create({ data: faq }).catch(() => {});
  }
  console.log("FAQ seeded");

  const reviews = [
    {
      patientName: "Elif Sahin",
      ratingStars: 5,
      contentTr: "Randevu akisi cok duzenliydi. Tedavi sureci oncesinde tum detaylar acikca anlatildi.",
      contentEn: "The appointment flow was very organized. Every step of the treatment was explained clearly beforehand.",
      isApproved: true,
      isVisible: true,
    },
    {
      patientName: "Ahmet Celik",
      ratingStars: 5,
      contentTr: "Klinik ortami sakin ve temizdi. Hekim ve ekip iletisim konusunda cok ilgiliydi.",
      contentEn: "The clinic environment was calm and clean. The clinician and team were very attentive in communication.",
      isApproved: true,
      isVisible: true,
    },
    {
      patientName: "Zeynep Arslan",
      ratingStars: 5,
      contentTr: "Online randevu talebi olusturmak kolaydi. Geri donus hizli ve acik oldu.",
      contentEn: "Creating an online appointment request was easy. The follow-up was quick and clear.",
      isApproved: true,
      isVisible: true,
    },
    {
      patientName: "Mustafa Ozturk",
      ratingStars: 4,
      contentTr: "Tedavi oncesi bilgilendirme guven vericiydi. Surec planli sekilde ilerledi.",
      contentEn: "The pre-treatment guidance was reassuring. The process moved forward in a planned way.",
      isApproved: true,
      isVisible: true,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review }).catch(() => {});
  }
  console.log("Reviews seeded");

  console.log("\nSeed completed successfully!");
  console.log("Admin login: admin@klinik.com / Admin123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
