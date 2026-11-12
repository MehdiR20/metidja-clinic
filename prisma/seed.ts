/**
 * Seed data for Clinique Metidja.
 *
 * ⚠️ CONTENT TO VERIFY BEFORE GOING LIVE
 *  - Dr Fares, Dr Benamane and Dr Hassen are named in public patient reviews; their specialties for
 *    Benamane (surgery) is an assumption, and every bio/qualification below is placeholder text.
 *  - Doctors marked `PLACEHOLDER` are fictional demo profiles so the booking flow works in every
 *    department — replace them with the clinic's real staff (Admin → Doctors) or delete them.
 *  - Prices are indicative examples in DZD and must be confirmed by the clinic.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type L = { fr: string; ar: string; en: string };
const l = (fr: string, ar: string, en: string): L => ({ fr, ar, en });

const DEPARTMENTS = [
  { slug: "medecine-generale", icon: "stethoscope", name: l("Médecine générale", "الطب العام", "General practice"), description: l("Consultations, bilans de santé, certificats et orientation vers le bon spécialiste.", "استشارات، فحوصات شاملة، شهادات وتوجيه نحو المختص المناسب.", "Consultations, check-ups, certificates and referral to the right specialist.") },
  { slug: "cardiologie", icon: "heart-pulse", name: l("Cardiologie", "أمراض القلب", "Cardiology"), description: l("Dépistage et suivi des maladies cardiovasculaires : ECG, échocardiographie, holter.", "الكشف عن أمراض القلب والشرايين ومتابعتها: تخطيط القلب، الإيكو، الهولتر.", "Screening and follow-up of cardiovascular disease: ECG, echocardiography, Holter.") },
  { slug: "pediatrie", icon: "baby", name: l("Pédiatrie", "طب الأطفال", "Paediatrics"), description: l("Suivi de la croissance, vaccinations et soins des nourrissons et des enfants.", "متابعة النمو، التلقيحات ورعاية الرضع والأطفال.", "Growth monitoring, vaccinations and care for infants and children.") },
  { slug: "gynecologie-obstetrique", icon: "flower", name: l("Gynécologie-obstétrique & maternité", "أمراض النساء والتوليد", "Obstetrics, gynaecology & maternity"), description: l("Suivi de grossesse, échographies, accouchement et séjour maternité.", "متابعة الحمل، الفحص بالصدى، الولادة والإقامة في قسم التوليد.", "Pregnancy follow-up, ultrasound, delivery and maternity stay.") },
  { slug: "chirurgie", icon: "scissors", name: l("Chirurgie générale", "الجراحة العامة", "General surgery"), description: l("Chirurgie viscérale et digestive programmée ou en urgence, dans nos blocs opératoires.", "الجراحة الباطنية والهضمية المبرمجة أو الاستعجالية في قاعات عملياتنا.", "Scheduled and emergency visceral and digestive surgery in our operating theatres.") },
  { slug: "orl", icon: "ear", name: l("ORL", "أمراض الأنف والأذن والحنجرة", "ENT"), description: l("Ronflements, baisse de l'audition, nez bouché, sinusites et chirurgie ORL.", "الشخير، ضعف السمع، انسداد الأنف، التهاب الجيوب وجراحة الأنف والأذن والحنجرة.", "Snoring, hearing loss, blocked nose, sinusitis and ENT surgery.") },
  { slug: "anesthesie-reanimation", icon: "activity", name: l("Anesthésie-réanimation", "التخدير والإنعاش", "Anaesthesia & intensive care"), description: l("Consultation pré-anesthésique et surveillance continue des patients en réanimation.", "استشارة ما قبل التخدير والمراقبة المستمرة للمرضى في الإنعاش.", "Pre-anaesthetic consultation and continuous monitoring in intensive care.") },
  { slug: "hemodialyse", icon: "droplets", name: l("Néphrologie & hémodialyse", "أمراض الكلى وتصفية الدم", "Nephrology & haemodialysis"), description: l("Unité d'hémodialyse équipée de générateurs récents, suivi néphrologique.", "وحدة تصفية الدم مجهزة بأجهزة حديثة ومتابعة أمراض الكلى.", "Haemodialysis unit with recent machines and nephrology follow-up.") },
  { slug: "laboratoire", icon: "microscope", name: l("Laboratoire d'analyses médicales", "مخبر التحاليل الطبية", "Medical laboratory"), description: l("Précision, fiabilité et expertise : biochimie, hématologie, hormonologie. Sans rendez-vous.", "دقة وموثوقية وخبرة: الكيمياء الحيوية، أمراض الدم، الهرمونات. دون موعد.", "Precision, reliability and expertise: biochemistry, haematology, hormones. Walk-in.") },
];

const SERVICES: Record<string, { name: L; price: number; duration: number }[]> = {
  "medecine-generale": [
    { name: l("Consultation de médecine générale", "استشارة طب عام", "General consultation"), price: 2000, duration: 20 },
    { name: l("Certificat médical", "شهادة طبية", "Medical certificate"), price: 1000, duration: 10 },
  ],
  cardiologie: [
    { name: l("Consultation de cardiologie", "استشارة أمراض القلب", "Cardiology consultation"), price: 3500, duration: 30 },
    { name: l("Électrocardiogramme (ECG)", "تخطيط القلب الكهربائي", "Electrocardiogram (ECG)"), price: 1500, duration: 15 },
    { name: l("Échocardiographie", "الفحص بالصدى للقلب", "Echocardiography"), price: 5000, duration: 30 },
  ],
  pediatrie: [{ name: l("Consultation de pédiatrie", "استشارة طب الأطفال", "Paediatric consultation"), price: 2500, duration: 30 }],
  "gynecologie-obstetrique": [
    { name: l("Consultation de gynécologie", "استشارة أمراض النساء", "Gynaecology consultation"), price: 3000, duration: 30 },
    { name: l("Échographie obstétricale", "فحص بالصدى للحمل", "Obstetric ultrasound"), price: 3000, duration: 20 },
    { name: l("Forfait accouchement voie basse", "باقة الولادة الطبيعية", "Vaginal delivery package"), price: 60000, duration: 0 },
  ],
  chirurgie: [{ name: l("Consultation de chirurgie", "استشارة جراحية", "Surgical consultation"), price: 3000, duration: 30 }],
  orl: [
    { name: l("Consultation ORL", "استشارة الأنف والأذن والحنجرة", "ENT consultation"), price: 3000, duration: 30 },
    { name: l("Audiogramme", "قياس السمع", "Audiogram"), price: 2500, duration: 20 },
  ],
  "anesthesie-reanimation": [{ name: l("Consultation pré-anesthésique", "استشارة ما قبل التخدير", "Pre-anaesthetic consultation"), price: 2500, duration: 20 }],
  hemodialyse: [{ name: l("Séance d'hémodialyse", "حصة تصفية الدم", "Haemodialysis session"), price: 12000, duration: 240 }],
  laboratoire: [
    { name: l("Formule numération sanguine (FNS)", "تعداد الدم الكامل", "Complete blood count (CBC)"), price: 800, duration: 10 },
    { name: l("Glycémie à jeun", "نسبة السكر في الدم صائمًا", "Fasting glucose"), price: 300, duration: 10 },
    { name: l("Bilan lipidique", "تحليل الدهون", "Lipid panel"), price: 1800, duration: 10 },
    { name: l("TSH", "هرمون TSH", "TSH"), price: 1500, duration: 10 },
    { name: l("Bilan prénatal", "تحاليل ما قبل الولادة", "Prenatal panel"), price: 4500, duration: 15 },
  ],
};

const weekdays = (days: number[], start: string, end: string) => days.map((day) => ({ day, start, end }));
const SUN_THU = [0, 1, 2, 3, 4];

const DOCTORS = [
  {
    slug: "dr-fares",
    name: "Dr. Fares",
    department: "gynecologie-obstetrique",
    title: l("Gynécologue-obstétricien", "طبيب أمراض النساء والتوليد", "Obstetrician-gynaecologist"),
    bio: l(
      "Le Dr Fares accompagne les patientes tout au long de leur grossesse, de la première échographie à l'accouchement, au sein de la maternité de la clinique.",
      "يرافق الدكتور فارس المريضات طوال فترة الحمل، من أول فحص بالصدى إلى الولادة، في قسم التوليد بالعيادة.",
      "Dr Fares supports patients throughout pregnancy, from the first scan to delivery, in the clinic's maternity unit.",
    ),
    qualifications: { fr: ["Docteur en médecine", "Spécialiste en gynécologie-obstétrique"], ar: ["دكتور في الطب", "مختص في أمراض النساء والتوليد"], en: ["Doctor of Medicine", "Specialist in obstetrics & gynaecology"] },
    languages: ["fr", "ar"],
    hours: [...weekdays(SUN_THU, "09:00", "13:00"), ...weekdays([6], "09:00", "12:00")],
    fee: 3000,
    telehealth: true,
  },
  {
    slug: "dr-benamane",
    name: "Dr. Benamane",
    department: "chirurgie",
    title: l("Chirurgien", "جرّاح", "Surgeon"),
    bio: l(
      "Le Dr Benamane prend en charge les interventions chirurgicales programmées et urgentes, avec un suivi post-opératoire attentif.",
      "يتكفل الدكتور بن عمان بالعمليات الجراحية المبرمجة والاستعجالية، مع متابعة دقيقة بعد العملية.",
      "Dr Benamane performs scheduled and emergency surgery, with careful post-operative follow-up.",
    ),
    qualifications: { fr: ["Docteur en médecine", "Spécialiste en chirurgie"], ar: ["دكتور في الطب", "مختص في الجراحة"], en: ["Doctor of Medicine", "Surgical specialist"] },
    languages: ["fr", "ar"],
    hours: weekdays([0, 2, 4], "14:00", "17:00"),
    fee: 3000,
    telehealth: false,
  },
  {
    slug: "dr-hassen",
    name: "Dr. Hassen",
    department: "anesthesie-reanimation",
    title: l("Anesthésiste-réanimateur", "طبيب التخدير والإنعاش", "Anaesthetist & intensivist"),
    bio: l(
      "Le Dr Hassen assure les consultations pré-anesthésiques et la surveillance des patients en réanimation.",
      "يضمن الدكتور حسان استشارات ما قبل التخدير ومراقبة المرضى في الإنعاش.",
      "Dr Hassen runs pre-anaesthetic consultations and monitors patients in intensive care.",
    ),
    qualifications: { fr: ["Docteur en médecine", "Spécialiste en anesthésie-réanimation"], ar: ["دكتور في الطب", "مختص في التخدير والإنعاش"], en: ["Doctor of Medicine", "Specialist in anaesthesia & intensive care"] },
    languages: ["fr", "ar", "en"],
    hours: weekdays([1, 3], "10:00", "13:00"),
    fee: 2500,
    telehealth: false,
  },
  // PLACEHOLDER profiles below — replace with real staff
  {
    slug: "medecin-generaliste",
    name: "Dr. S. Mansouri",
    department: "medecine-generale",
    title: l("Médecin généraliste", "طبيب عام", "General practitioner"),
    bio: l("Profil de démonstration à remplacer.", "ملف تجريبي يجب استبداله.", "Demo profile — replace."),
    qualifications: { fr: ["Docteur en médecine"], ar: ["دكتور في الطب"], en: ["Doctor of Medicine"] },
    languages: ["fr", "ar", "kab"],
    hours: [...weekdays([0, 1, 2, 3, 4, 6], "08:00", "12:00"), ...weekdays([0, 1, 2, 3, 4], "13:00", "16:00")],
    fee: 2000,
    telehealth: true,
  },
  {
    slug: "cardiologue",
    name: "Dr. N. Belkacem",
    department: "cardiologie",
    title: l("Cardiologue", "طبيب أمراض القلب", "Cardiologist"),
    bio: l("Profil de démonstration à remplacer.", "ملف تجريبي يجب استبداله.", "Demo profile — replace."),
    qualifications: { fr: ["Spécialiste en cardiologie"], ar: ["مختص في أمراض القلب"], en: ["Cardiology specialist"] },
    languages: ["fr", "ar"],
    hours: weekdays([0, 2, 4], "09:00", "13:00"),
    fee: 3500,
    telehealth: true,
  },
  {
    slug: "pediatre",
    name: "Dr. A. Haddad",
    department: "pediatrie",
    title: l("Pédiatre", "طبيب أطفال", "Paediatrician"),
    bio: l("Profil de démonstration à remplacer.", "ملف تجريبي يجب استبداله.", "Demo profile — replace."),
    qualifications: { fr: ["Spécialiste en pédiatrie"], ar: ["مختص في طب الأطفال"], en: ["Paediatrics specialist"] },
    languages: ["fr", "ar"],
    hours: [...weekdays(SUN_THU, "09:00", "12:30"), ...weekdays([6], "09:00", "12:00")],
    fee: 2500,
    telehealth: false,
  },
  {
    slug: "orl",
    name: "Dr. R. Zerrouki",
    department: "orl",
    title: l("Médecin ORL", "طبيب الأنف والأذن والحنجرة", "ENT specialist"),
    bio: l("Profil de démonstration à remplacer.", "ملف تجريبي يجب استبداله.", "Demo profile — replace."),
    qualifications: { fr: ["Spécialiste en ORL"], ar: ["مختص في الأنف والأذن والحنجرة"], en: ["ENT specialist"] },
    languages: ["fr", "ar"],
    hours: weekdays([1, 3], "13:00", "17:00"),
    fee: 3000,
    telehealth: false,
  },
];

async function main() {
  console.log("Seeding…");

  const deptIds: Record<string, string> = {};
  for (const [i, d] of DEPARTMENTS.entries()) {
    const dept = await prisma.department.upsert({
      where: { slug: d.slug },
      update: { name: d.name, description: d.description, icon: d.icon, order: i },
      create: { slug: d.slug, name: d.name, description: d.description, icon: d.icon, order: i },
    });
    deptIds[d.slug] = dept.id;

    const existing = await prisma.service.count({ where: { departmentId: dept.id } });
    if (!existing) {
      await prisma.service.createMany({
        data: (SERVICES[d.slug] ?? []).map((s, order) => ({
          departmentId: dept.id,
          name: s.name,
          priceDzd: s.price,
          durationMin: s.duration,
          order,
        })),
      });
    }
  }

  const doctorIds: Record<string, string> = {};
  for (const d of DOCTORS) {
    const data = {
      name: d.name,
      title: d.title,
      bio: d.bio,
      qualifications: d.qualifications,
      languages: d.languages,
      consultationHours: d.hours,
      consultationFee: d.fee,
      acceptsTelehealth: d.telehealth,
      departmentId: deptIds[d.department]!,
    };
    const doc = await prisma.doctor.upsert({ where: { slug: d.slug }, update: data, create: { slug: d.slug, ...data } });
    doctorIds[d.slug] = doc.id;
  }

  // Admin account
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@clinique-metidja.dz").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrateur",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      consentAt: new Date(),
    },
  });

  // Demo patient with a prescription and lab results
  const patient = await prisma.user.upsert({
    where: { email: "patient@demo.dz" },
    update: {},
    create: {
      email: "patient@demo.dz",
      name: "Patient Démo",
      phone: "+213560000000",
      role: "PATIENT",
      passwordHash: await bcrypt.hash("Patient2026", 12),
      consentAt: new Date(),
    },
  });

  if (!(await prisma.prescription.count({ where: { userId: patient.id } }))) {
    await prisma.prescription.create({
      data: {
        userId: patient.id,
        doctorId: doctorIds["medecin-generaliste"]!,
        items: [
          { drug: "Paracétamol 1 g", dosage: "1 comprimé 3 fois par jour", duration: "5 jours" },
          { drug: "Amoxicilline 1 g", dosage: "1 comprimé matin et soir", duration: "7 jours" },
        ],
        notes: "Repos, bonne hydratation. Revoir si fièvre persistante au-delà de 48 h.",
      },
    });
    await prisma.labResult.createMany({
      data: [
        {
          userId: patient.id,
          testName: l("Formule numération sanguine", "تعداد الدم الكامل", "Complete blood count"),
          collectedAt: new Date(Date.now() - 3 * 86_400_000),
          status: "AVAILABLE",
          results: [
            { analyte: "Hémoglobine", value: "13.8", unit: "g/dL", range: "12 – 16", flag: "normal" },
            { analyte: "Leucocytes", value: "11.2", unit: "10³/µL", range: "4 – 10", flag: "high" },
            { analyte: "Plaquettes", value: "250", unit: "10³/µL", range: "150 – 400", flag: "normal" },
          ],
        },
        {
          userId: patient.id,
          testName: l("Bilan lipidique", "تحليل الدهون", "Lipid panel"),
          collectedAt: new Date(),
          status: "PENDING",
        },
      ],
    });
  }

  console.log(`Done. Admin: ${adminEmail} · Demo patient: patient@demo.dz / Patient2026`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
