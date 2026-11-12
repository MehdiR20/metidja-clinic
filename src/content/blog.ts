import type { Locale } from "@/i18n/routing";

type Block = { h2: string } | { p: string } | { ul: string[] };
type L<T> = Record<Locale, T>;

export type Article = {
  slug: string;
  date: string;
  readingMin: number;
  image: string;
  title: L<string>;
  excerpt: L<string>;
  body: L<Block[]>;
};

// Articles target local search intents: "meilleure clinique à Boufarik", "clinique chirurgicale Blida"…
export const ARTICLES: Article[] = [
  {
    slug: "meilleure-clinique-boufarik",
    date: "2026-11-02",
    readingMin: 4,
    image: "/images/building-day.jpg",
    title: {
      fr: "Comment choisir la meilleure clinique à Boufarik ?",
      ar: "كيف تختار أفضل عيادة في بوفاريك؟",
      en: "How to choose the best clinic in Boufarik",
    },
    excerpt: {
      fr: "Disponibilité 24h/24, plateau technique, transparence des tarifs : les critères qui comptent vraiment pour vous et votre famille.",
      ar: "التوفر 24/24، التجهيزات التقنية، وضوح الأسعار: المعايير المهمة حقًا لك ولعائلتك.",
      en: "24/7 availability, technical facilities, transparent pricing: the criteria that really matter for you and your family.",
    },
    body: {
      fr: [
        { p: "Trouver une clinique de confiance à Boufarik et dans la wilaya de Blida n'est pas toujours simple. Voici les points à vérifier avant de confier votre santé, ou celle de vos proches, à un établissement." },
        { h2: "1. Une permanence 24h/24 et 7j/7" },
        { p: "Les urgences n'attendent pas. Une clinique ouverte jour et nuit, avec un médecin et une équipe de réanimation sur place, fait toute la différence en cas de complication." },
        { h2: "2. Plusieurs spécialités sous un même toit" },
        { p: "Consultation, examens, laboratoire, bloc opératoire et hospitalisation au même endroit : moins de déplacements, un dossier partagé et une prise en charge plus rapide." },
        { ul: ["Laboratoire d'analyses intégré", "Blocs opératoires et salle de réveil", "Maternité et suivi de grossesse", "Hémodialyse"] },
        { h2: "3. Des tarifs clairs en dinars" },
        { p: "Demandez toujours le tarif d'une consultation ou d'un forfait avant votre venue, ainsi que les conventions acceptées (CNAS, CASNOS, mutuelles). À la Clinique Metidja, nos tarifs indicatifs sont publiés en ligne." },
        { h2: "4. Un accès facile" },
        { p: "Située à Boufarik, à proximité de l'autoroute Est-Ouest (A1), la Clinique Metidja Al Djazair est accessible rapidement depuis Blida, Alger, Tipaza et toute la Mitidja." },
      ],
      ar: [
        { p: "ليس من السهل دائمًا إيجاد عيادة موثوقة في بوفاريك وولاية البليدة. إليك النقاط التي يجب التحقق منها قبل أن تأتمن مؤسسة على صحتك أو صحة أقاربك." },
        { h2: "1. مداومة 24/24 و7/7" },
        { p: "الحالات الاستعجالية لا تنتظر. عيادة مفتوحة ليلًا ونهارًا، مع طبيب وفريق إنعاش في عين المكان، تصنع الفرق عند حدوث أي مضاعفات." },
        { h2: "2. عدة تخصصات تحت سقف واحد" },
        { p: "استشارة، فحوصات، مخبر، غرفة عمليات واستشفاء في مكان واحد: تنقلات أقل، ملف مشترك وتكفل أسرع." },
        { ul: ["مخبر تحاليل مدمج", "قاعات عمليات وغرفة إفاقة", "قسم التوليد ومتابعة الحمل", "تصفية الدم"] },
        { h2: "3. أسعار واضحة بالدينار" },
        { p: "اسأل دائمًا عن سعر الاستشارة أو الباقة قبل قدومك، وعن الاتفاقيات المقبولة (CNAS، CASNOS، التعاضديات). في عيادة متيجة، أسعارنا التقديرية منشورة على الإنترنت." },
        { h2: "4. سهولة الوصول" },
        { p: "تقع عيادة متيجة الجزائر في بوفاريك بالقرب من الطريق السيار شرق-غرب (A1)، ويمكن الوصول إليها بسرعة من البليدة والجزائر العاصمة وتيبازة وكامل سهل متيجة." },
      ],
      en: [
        { p: "Finding a trustworthy clinic in Boufarik and the wider Blida province isn't always easy. Here's what to check before trusting a facility with your health, or your family's." },
        { h2: "1. 24/7 cover" },
        { p: "Emergencies don't wait. A clinic open day and night, with a doctor and intensive-care team on site, makes all the difference if complications arise." },
        { h2: "2. Several specialties under one roof" },
        { p: "Consultation, tests, laboratory, operating theatre and inpatient care in one place means less travel, a shared record and faster care." },
        { ul: ["In-house medical laboratory", "Operating theatres and recovery room", "Maternity and pregnancy follow-up", "Haemodialysis"] },
        { h2: "3. Clear prices in dinars" },
        { p: "Always ask for the price of a consultation or package before you visit, and which agreements are accepted (CNAS, CASNOS, mutuals). At Clinique Metidja, our indicative prices are published online." },
        { h2: "4. Easy access" },
        { p: "Located in Boufarik near the East-West motorway (A1), Clinique Metidja Al Djazair is quickly reached from Blida, Algiers, Tipaza and across the Mitidja plain." },
      ],
    },
  },
  {
    slug: "clinique-chirurgicale-blida",
    date: "2026-10-20",
    readingMin: 5,
    image: "/images/corridor.jpg",
    title: {
      fr: "Clinique chirurgicale à Blida : bien préparer son intervention",
      ar: "عيادة جراحية في البليدة: كيف تستعد جيدًا لعمليتك",
      en: "Surgical clinic in Blida: preparing well for your operation",
    },
    excerpt: {
      fr: "Consultation pré-anesthésique, examens, jeûne, documents à apporter : le parcours d'un patient opéré, étape par étape.",
      ar: "استشارة ما قبل التخدير، الفحوصات، الصيام، الوثائق اللازمة: مسار المريض الذي يخضع لعملية، خطوة بخطوة.",
      en: "Pre-anaesthetic consultation, tests, fasting, documents to bring: a surgical patient's journey, step by step.",
    },
    body: {
      fr: [
        { p: "Une intervention chirurgicale se prépare. Une bonne préparation réduit les risques et rend la convalescence plus sereine." },
        { h2: "La consultation chirurgicale" },
        { p: "Le chirurgien pose l'indication, vous explique l'intervention, ses bénéfices et ses risques, et répond à vos questions. N'hésitez pas à noter vos questions à l'avance." },
        { h2: "La consultation pré-anesthésique" },
        { p: "Obligatoire avant toute anesthésie programmée, elle a lieu plusieurs jours avant l'opération. Le médecin anesthésiste-réanimateur évalue vos antécédents, vos traitements et choisit la technique d'anesthésie la plus adaptée." },
        { h2: "Ce qu'il faut apporter" },
        { ul: ["Pièce d'identité et carte Chifa", "Ordonnances et liste de vos médicaments", "Résultats d'analyses et d'imagerie récents", "Le compte rendu de la consultation pré-anesthésique"] },
        { h2: "Le jour J" },
        { p: "Respectez scrupuleusement les consignes de jeûne données par l'équipe. Après l'intervention, vous êtes surveillé en salle de réveil puis en chambre, et une équipe de réanimation reste disponible 24h/24." },
      ],
      ar: [
        { p: "العملية الجراحية تحتاج إلى تحضير. التحضير الجيد يقلل المخاطر ويجعل فترة النقاهة أكثر راحة." },
        { h2: "الاستشارة الجراحية" },
        { p: "يحدد الجراح ضرورة العملية، ويشرح لك طبيعتها وفوائدها ومخاطرها، ويجيب عن أسئلتك. لا تتردد في تدوين أسئلتك مسبقًا." },
        { h2: "استشارة ما قبل التخدير" },
        { p: "إلزامية قبل أي تخدير مبرمج، وتتم قبل العملية بعدة أيام. يقيّم طبيب التخدير والإنعاش سوابقك المرضية وأدويتك ويختار تقنية التخدير الأنسب." },
        { h2: "ما يجب إحضاره" },
        { ul: ["بطاقة التعريف وبطاقة الشفاء", "الوصفات وقائمة أدويتك", "نتائج التحاليل والأشعة الحديثة", "تقرير استشارة ما قبل التخدير"] },
        { h2: "يوم العملية" },
        { p: "احترم بدقة تعليمات الصيام التي يقدمها الفريق. بعد العملية، تتم مراقبتك في غرفة الإفاقة ثم في الغرفة، ويبقى فريق الإنعاش متاحًا 24/24." },
      ],
      en: [
        { p: "Surgery needs preparation. Good preparation reduces risks and makes recovery smoother." },
        { h2: "The surgical consultation" },
        { p: "The surgeon confirms the need for the operation, explains it with its benefits and risks, and answers your questions. Feel free to write your questions down beforehand." },
        { h2: "The pre-anaesthetic consultation" },
        { p: "Mandatory before any planned anaesthesia, it takes place several days before the operation. The anaesthetist reviews your history and medications and chooses the most suitable technique." },
        { h2: "What to bring" },
        { ul: ["ID and Chifa card", "Prescriptions and a list of your medications", "Recent lab and imaging results", "The pre-anaesthetic consultation report"] },
        { h2: "On the day" },
        { p: "Follow the fasting instructions given by the team exactly. After surgery you're monitored in the recovery room, then on the ward, with an intensive-care team available 24/7." },
      ],
    },
  },
  {
    slug: "novembre-bleu-depistage-prostate",
    date: "2026-11-01",
    readingMin: 3,
    image: "/images/consultation-wing.jpg",
    title: {
      fr: "Novembre Bleu : l'importance du dépistage précoce du cancer de la prostate",
      ar: "نوفمبر الأزرق: أهمية الكشف المبكر عن سرطان البروستاتا",
      en: "Blue November: why early prostate cancer screening matters",
    },
    excerpt: {
      fr: "En novembre, la Clinique Metidja se mobilise pour la santé masculine. Qui est concerné, et quand consulter ?",
      ar: "في نوفمبر، تتجند عيادة متيجة من أجل صحة الرجل. من المعني، ومتى يجب الاستشارة؟",
      en: "This November, Clinique Metidja is raising awareness of men's health. Who should get checked, and when?",
    },
    body: {
      fr: [
        { p: "Le cancer de la prostate est l'un des cancers les plus fréquents chez l'homme. Détecté tôt, il se soigne beaucoup mieux." },
        { h2: "Qui est concerné ?" },
        { p: "Parlez-en à votre médecin à partir de 50 ans, ou dès 45 ans en cas d'antécédents familiaux. Le dépistage repose sur un dosage sanguin (PSA) et un examen clinique, discutés au cas par cas." },
        { h2: "Les signes qui doivent alerter" },
        { ul: ["Envies d'uriner fréquentes, surtout la nuit", "Jet urinaire faible ou difficulté à uriner", "Présence de sang dans les urines", "Douleurs persistantes au bas du dos ou au bassin"] },
        { p: "Ces symptômes ne signifient pas forcément un cancer, mais justifient une consultation." },
        { h2: "À la Clinique Metidja" },
        { p: "Notre laboratoire réalise le dosage du PSA, et nos médecins vous orientent vers le spécialiste adapté. Prenez rendez-vous en ligne ou appelez-nous." },
      ],
      ar: [
        { p: "سرطان البروستاتا من أكثر أنواع السرطان شيوعًا عند الرجال. وإذا اكتُشف مبكرًا، يكون علاجه أفضل بكثير." },
        { h2: "من المعني؟" },
        { p: "تحدث مع طبيبك ابتداءً من سن 50، أو من سن 45 في حالة وجود سوابق عائلية. يعتمد الكشف على تحليل دم (PSA) وفحص سريري، يتم تقريرهما حسب كل حالة." },
        { h2: "العلامات التي تستدعي الانتباه" },
        { ul: ["الرغبة المتكررة في التبول خاصة ليلًا", "ضعف تدفق البول أو صعوبة التبول", "وجود دم في البول", "آلام مستمرة أسفل الظهر أو في الحوض"] },
        { p: "هذه الأعراض لا تعني بالضرورة الإصابة بالسرطان، لكنها تستدعي الاستشارة." },
        { h2: "في عيادة متيجة" },
        { p: "يقوم مخبرنا بتحليل PSA، ويوجهك أطباؤنا نحو المختص المناسب. احجز موعدك عبر الإنترنت أو اتصل بنا." },
      ],
      en: [
        { p: "Prostate cancer is one of the most common cancers in men. Caught early, it is far more treatable." },
        { h2: "Who should get checked?" },
        { p: "Talk to your doctor from age 50, or from 45 if there's a family history. Screening relies on a blood test (PSA) and a clinical examination, decided case by case." },
        { h2: "Warning signs" },
        { ul: ["Frequent urge to urinate, especially at night", "Weak stream or difficulty urinating", "Blood in the urine", "Persistent pain in the lower back or pelvis"] },
        { p: "These symptoms don't necessarily mean cancer, but they do warrant a consultation." },
        { h2: "At Clinique Metidja" },
        { p: "Our laboratory performs PSA testing, and our doctors will refer you to the right specialist. Book online or give us a call." },
      ],
    },
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const sortedArticles = () => [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
