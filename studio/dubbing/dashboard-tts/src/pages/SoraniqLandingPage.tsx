import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoraniqLandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState<"ckb" | "ar" | "en">("ckb");
  const [isAnnual, setIsAnnual] = useState(false);

  // Audio demo player state
  const [activeAudioTab, setActiveAudioTab] = useState<"kurdish" | "iraqi">("iraqi");
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [audioProgress, setAudioProgress] = useState(42);

  // ROI Calculator state (IQD Direct Architecture)
  const [avgProfitPerCustomer, setAvgProfitPerCustomer] = useState(10000); // 10,000 IQD default
  const [touristCustomers, setTouristCustomers] = useState(10); // 10 customers default

  // 1. Passive Pattern Interrupt Banner (Tactic #28)
  const [showPassiveBanner, setShowPassiveBanner] = useState(false);
  const hasTriggeredInterrupt = useRef(false);
  const pageLoadedTime = useRef(Date.now());

  // 2. Anchor First Sequential Load (Tactics #10 & #12)
  const pricingSectionRef = useRef<HTMLElement | null>(null);
  const [pricingInView, setPricingInView] = useState(false);
  const [tiersRevealed, setTiersRevealed] = useState(false);

  // Simulated audio progress timer
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Passive Pattern Interrupt Trigger (Scroll Velocity)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);
      const timeSincePageLoad = (currentTime - pageLoadedTime.current) / 1000;

      // Trigger if user scrolls past hero/pain (scrollY > 350) rapidly
      if (
        !hasTriggeredInterrupt.current &&
        currentScrollY > 350 &&
        currentScrollY < 2000 &&
        (timeSincePageLoad < 2.5 || (timeDiff > 0 && scrollDiff / timeDiff > 1.8))
      ) {
        hasTriggeredInterrupt.current = true;
        setShowPassiveBanner(true);
      }

      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Anchor-First Pricing Load
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pricingInView) {
          setPricingInView(true);
          // Anchor ($99) is shown immediately. Exactly 0.8s later, snap $15 Decoy & $20 Target into place
          const timer = setTimeout(() => {
            setTiersRevealed(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.18 }
    );

    if (pricingSectionRef.current) {
      observer.observe(pricingSectionRef.current);
    }
    return () => observer.disconnect();
  }, [pricingInView]);

  const isRTL = lang === "ckb" || lang === "ar";
  const totalCalculatedProfitIQD = touristCustomers * avgProfitPerCustomer;

  const t = {
    ckb: {
      badge: "⚠️ ڕاپۆرتی شیکاری: دۆخی بازاڕی سلێمانی و هەولێر",
      heroHeadlineStart: "١٠,٠٠٠ دۆلار کەلوپەلی سارد لە دووکانەکەتدا.",
      heroHeadlineHighlight: "گەشتیارانی عەرەب ڕۆژانە بە بەردەم دەرگاکەتدا تێدەپەڕن.",
      heroHeadlineEnd: "دووکانەکەت قسە لەگەڵ کام سەرچاوەی پارە دەکات؟",
      heroSub:
        "چاوەڕوانیکردنی مووچەی حکومی کێشەی نەبوونی نەختینە لە دووکانەکەت چارەسەر ناکات. ئەم سیستەمە دەنگی سۆرانیی ڤیدیۆکانت دەکاتە عەرەبی عێراقیی پاراو، بۆ ئەوەی ئەو گەشتیارانەی لە شارەکاندان بێنە ناو پێشانگاکەت.",
      ctaHeroMassive: "دەستپێکردنی تاقیکردنەوە (لینککردنی وەتسئەپ لە ١٠ چرکەدا)",
      inputPlaceholder: "ژمارەی وەتسئەپ بنووسە (+964 7XX...)",
      ctaPrimary: "بەستنەوەی وەتسئەپ لە ١٠ چرکەدا",
      ctaSubtext: "تاقیکردنەوەی ڕاستەوخۆ • بەبێ پێویستی بە کارتی بانکی",

      passiveBannerText: "بوەستە... ئایا دڵنیایت ڕکابەرەکانت لە شەقامی مەولەوی پێش تۆ دەستیان بە ڕاکێشانی ئەم گەشتیارانە نەکردووە؟",
      passiveBannerAction: "سەیری بکە",

      mechanismTag: "میکانیزمی کارکردن بە ٣ هەنگاو",
      mechanismTitle: "چۆن کار دەکات بەبێ ئاڵۆزیی تەکنیکی",
      step1Num: "٠١",
      step1Title: "تۆمارکردنی ڤیدیۆ بە سۆرانی",
      step1Desc: "هەمان ئەو ڤیدیۆیە بە کوردی سۆرانی تۆمار بکە کە هەموو ڕۆژێک بۆ پێناساندنی کەلوپەلەکانت دەیگریت.",
      step2Num: "٠٢",
      step2Title: "ناردن لە ڕێگەی وەتسئەپ",
      step2Desc: "ڤیدیۆکە بنێرە بۆ بۆتەکەی ئێمە. لە ١٠ چرکەدا دەنگەکە دەبێتە شێوەزاری عەرەبی عێراقی بە پاراستنی میوزیک و دەنگی شوێنەکە.",
      step3Num: "٠٣",
      step3Title: "بڵاوکردنەوە بۆ گەشتیاران",
      step3Desc: "ڤیدیۆ دۆبلاژکراوەکە لە تیکتۆک و ئینستاگرام دابنێ و گەشتیارانی بەغدا و بەسرە ڕاستەوخۆ بهێنە دووکانەکەت.",

      audioTitle: "گوێ لە جیاوازیی دەنگ و شێوەزارەکە بگرە",
      audioSubtitle: "بەراوردی دەنگی سۆرانیی سەرەکی و دۆبلاژی عەرەبی عێراقی بە شێوەزاری ڕەسەنی بەغدایی.",
      kurdishAudioLabel: "دەنگی سەرەکی بە سۆرانی",
      iraqiAudioLabel: "دەنگی دۆبلاژکراو بە عەرەبی عێراقی (Doblaj AI)",
      kurdishTranscript: "«بەخێربێن بۆ پێشانگاکەمان، نوێترین مۆدێلی جلوبەرگی هاوینەمان بۆ گەیشتووە بە داشکاندنی تایبەت بۆ ئەم هەفتەیە.»",
      iraqiTranscript: "«أهلاً وسهلاً بيكم بمعرضنا، وصلتنا أرقى الموديلات الصيفية بتخفيضات خاصة كلش لهالاسبوع، لتفوتكم الفرصة وتعالوا زورونا.»",

      splitLeftTitle: "(دۆخی ئێستای دووکانەکەت)",
      splitLeftStatus: "سارد و کەڵەکەبوو 🥀",
      splitLeftItem1: "❌ زیاتر لە ١٠,٠٠٠ دۆلار کەلوپەلی نەفرۆشراو لەسەر ڕەفەکان",
      splitLeftItem2: "❌ وەستانی بازاڕ بەهۆی دواکەوتنی مووچەی فەرمانبەران 📉",
      splitLeftItem3: "❌ گەشتیاری عەرەب بە بەردەمتدا تێدەپەڕێت و دەنگت تێناگات",
      splitLeftMetric: "$0 داهات لە گەشتیار 📉",

      splitRightTitle: "(دۆخی دووکانەکەت بە Doblaj AI)",
      splitRightStatus: "فرۆشی بەردەوام بە نەختینە 💰",
      splitRightItem1: "✅ ڤیدیۆی سۆرانی دەبێتە عەرەبی عێراقیی پاراو",
      splitRightItem2: "✅ گەشتیار لە تیکتۆک دەتبینێت و دێتە پێشانگاکەت 📈",
      splitRightItem3: "✅ تەنها یەک فرۆش لە مانگێکدا تێچووی تەواوی سیستەم دەردێنێتەوە 💰",
      splitRightMetric: "+١,٥٠٠,٠٠٠ دینار تێکڕای قازانجی کۆتایی هەفتە 📈",
      splitBottomNote: "(بیرکاریی ڕاستەقینە: تەنها یەک فرۆش بە گەشتیارێکی عەرەب لە مانگێکدا، تێچووی $20ی ئەم سیستەمە پڕ دەکاتەوە. باقی فرۆشەکانی تر قازانجی تەواون بۆ خۆت).",

      calcTitle: "ژمێرەری داهاتی لەدەستچووی گەشتیاران",
      calcSubtitle: "ئەم دوو خلیسکێنەرە بەپێی قازانجی دووکانەکەت دیاری بکە بۆ بینینی ئەو داهاتەی لەدەستت دەچێت.",
      calcSlider1Label: "قازانجی مامناوەند لە هەر گەشتیارێک:",
      calcSlider2Label: "ژمارەی ئەو کڕیارە عەرەبانەی لە مانگێکدا دەتوانن بکڕن:",
      calcResultProfit: "داهاتی مانگانەی لەدەستچووی گەشتیاران:",
      calcCostNote: "تێچووی تەواوی سیستەم: $20 لە مانگێکدا. بەبێ هیچ بڕە پارەیەکی شاراوە.",
      calcCtaBtn: "زیادکردنی ئەم داهاتە بۆ دووکانەکەم 💰",

      guaranteeTag: "دڵنیایی ڕوون و شایەنی تاقیکردنەوە",
      guaranteeTitle: "دڵنیایی ٧ ڕۆژی گەڕاندنەوەی تەواوی پارە",
      guaranteeBody: "ئەگەر لە ماوەی ٧ ڕۆژدا تێبینیی سروشتیبوونی شێوەزارە عێراقییەکە یان سوودی سیستەمەکەت نەکرد، بە ناردنی تەنها یەک نامەی وەتسئەپ تەواوی ٢٠ دۆلارەکەت دەگەڕێنینەوە بەبێ هیچ پرسیار و مەرجێکی ئاڵۆز.",

      pricingAnchor: "تێچووی وەرگێڕ و بێژەری دەنگی عەرەبی:",
      pricingAnchorOld: "$500 / مانگانە",
      pricingAnchorSave: "٩٦٪ پاشەکەوت بە Doblaj AI",
      pricingTitle: "پلانەکانی بەشداریکردن",
      pricingSubtitle: "تەنها یەک فرۆش بە گەشتیارێکی عەرەب، تێچووی تەواوی مانگێکی ئەم سیستەمە دەردێنێتەوە.",
      billingMonthly: "مانگانە",
      billingAnnual: "ساڵانە (٢ مانگ بە دیاری) ✅",

      decoyTitle: "پلانی تاقیکاریی سنووردار",
      decoyPrice: isAnnual ? "$12" : "$15",
      decoyPeriod: "/مانگ",
      decoyLimit: "تەنها یەک ڤیدیۆ لە مانگێکدا ⚠️",
      decoyItem1: "❌ ڕیزبەندیی هێواش لە ڕاڕەوی سێرڤەر",
      decoyItem2: "❌ کواڵێتی ئاسایی 720p",
      decoyItem3: "❌ دەنگی سادە و بێ هەست",
      decoyCta: "پلانی تاقیکاری ($15)",

      targetBadge: "✅ پەسەندکراو بۆ دووکاندار",
      targetTitle: "پلانی گەشەی بێسنوور",
      targetPrice: isAnnual ? "$16" : "$20",
      targetPeriod: "/مانگ",
      targetLimit: "ڤیدیۆی بێسنوور (تا ١٥ خولەک) 📈",
      targetItem1: "✅ خێرایی دەستبەجێ بەبێ وەستان لە ڕیزدا",
      targetItem2: "✅ شێوەزاری عێراقیی پاراو و هەستی سروشتی",
      targetItem3: "✅ کواڵێتی 4K Ultra-HD بۆ ئینستاگرام و تیکتۆک",
      targetItem4: "✅ جیاکردنەوەی خۆکارانەی دەنگ و پاراستنی میوزیک",
      targetMicroCopy: "کەمترە لە قازانجی فرۆشتنی تەنها یەک تیشێرت لە مانگێکدا.",
      targetCta: "دەستپێکردنی پلانی $20ی بێسنوور 💰",

      anchorTitle: "پلانی ئاژانس و کۆمپانیا",
      anchorPrice: isAnnual ? "$79" : "$99",
      anchorPeriod: "/مانگ",
      anchorLimit: "١٢٠ خولەک بۆ فرە-لق",
      anchorItem1: "✅ ڕاڕەوی خێرای VIP بەرزترین لەپێشینە",
      anchorItem2: "✅ ناسینەوەی فرە-قسەکەر لە یەک کاتدا",
      anchorItem3: "✅ کڵۆنکردنی دەنگی تایبەتی کارمەندانت",
      anchorItem4: "✅ بەستنەوە بە API و پشتگیریی بەردەوام",
      anchorCta: "پلانی کۆمپانیا ($99)",

      paymentTrust: "پارەدان لە ڕێگەی فاستپەی (FastPay)، FIB، زین کاش، ئاسیاحەواڵە، ڤیزا و ماستەرکارت.",

      faqTitle: "وەڵامی دوو پرسیاری بنەڕەتی",
      faqSubtitle: "بەر لە بڕیاردان، ئەم دوو خاڵە بە ڕوونی بخوێنەرەوە.",

      faq1Q: "ناتوانم تەنها نووسینی عەرەبی (ژێرنووس) لەسەر ڤیدیۆکەم دابنێم؟",
      faq1A:
        "گەشتیار لە کاتی پیاسەکردن لە بازاڕدا یان سەیرکردنی تیکتۆکدا چاوی ناخاتە سەر نووسینی ژێرنووس. کڕیار کاتێک بڕیاری کڕین دەدات کە گوێی لە دەنگێکی گەرمی بەغدایی یان بەسراوی بێت کە بە شێوەزاری خۆی بەخێرهاتنی دەکات. ژێرنووس دەپەڕێنرێت، بەڵام دەنگی ڕەسەن سەرنج ڕادەکێشێت.",

      faq2Q: "من کاسبکارم و شارەزایی پرۆگرامسازیم نییە، ئایا ئەمە بۆ من ئاڵۆزە؟",
      faq2A:
        "نەخێر. ئەگەر بتوانیت لە وەتسئەپ ڤیدیۆیەک بنێریت، دەتوانیت ئەم سیستەمە بەکاربهێنیت. تەنها ڤیدیۆکەت لە وەتسئەپ دەنێریت، سیستەمەکە بە شێوەزاری عێراقی وەریدەگێڕێت و دەیداتەوە دەستت.",

      respectedExitQuote: "ئەگەر ئەمڕۆ ئامادە نیت، هیچ کێشەیەک نییە. کاتێک کەلوپەلەکەت پێویستی بە فرۆشتن بوو، ئێمە لێرەین.",
      footerLegal: "دروستکراوە بە ❤️ لە کوردستان بۆ کاسبکارە خۆشەویستەکانمان",
      navFeatures: "جیاوازیی دەنگ",
      navCalculator: "ژمێرەری قازانج",
      navPricing: "نرخەکان",
      navFaq: "پرسیارە باوەکان",
      navLogin: "داشبۆرد",
      navStart: "دەستپێکردن",
    },
    ar: {
      badge: "⚠️ تقرير تحليلي: واقع أسواق السليمانية وأربيل",
      heroHeadlineStart: "١٠,٠٠٠$ بضاعة صيفية راكدة في محلك.",
      heroHeadlineHighlight: "السياح العرب يمرون يومياً أمام بابك.",
      heroHeadlineEnd: "محلك يتحدث مع أي مصدر سيولة؟",
      heroSub:
        "انتظار الرواتب الحكومية لن يحل مشكلة نقص الكاش في محلك. هذا النظام يحول صوت فيديوهاتك من الكردية إلى اللهجة العراقية البغدادية بطلاقة، لجذب السياح الموجودين في مدينتك إلى معرضك.",
      ctaHeroMassive: "بدء التجربة المباشرة (ربط الواتساب بـ ١٠ ثواني)",
      inputPlaceholder: "اكتب رقم الواتساب (+964 7XX...)",
      ctaPrimary: "اربط رقم الواتساب بـ ١٠ ثواني",
      ctaSubtext: "تجربة مباشرة • بدون الحاجة لبطاقة بنكية",

      passiveBannerText: "لحظة... متأكد منافسيك بشارع المولوي ما بدأوا يستهدفون ذوله السياح قبلك؟",
      passiveBannerAction: "شوف الحقيقة",

      mechanismTag: "آلية العمل بـ ٣ خطوات",
      mechanismTitle: "كيف يعمل النظام بدون أي تعقيد تقني",
      step1Num: "٠١",
      step1Title: "تسجيل الفيديو بالسۆراني",
      step1Desc: "سجل نفس الفيديو الترويجي المعتاد باللغة الكردية لعرض بضائع محلك.",
      step2Num: "٠٢",
      step2Title: "الإرسال عبر الواتساب",
      step2Desc: "أرسل الفيديو للبوت، وخلال ١٠ ثوانٍ يتحول الصوت إلى لهجة عراقية طبيعية مع الحفاظ على الموسيقى الأصلية.",
      step3Num: "٠٣",
      step3Title: "النشر لجذب السياح",
      step3Desc: "انشر الفيديو المدبلج على تيك توك وإنستغرام واستقبل سياح بغداد والبصرة في محلك مباشرة.",

      audioTitle: "اسمع الفرق بين الصوت الأصلي والدبلجة العراقية",
      audioSubtitle: "مقارنة دقيقة بين الصوت الكردي الأصلي والدبلجة البغدادية الطبيعية.",
      kurdishAudioLabel: "الصوت الأصلي (سۆرانی)",
      iraqiAudioLabel: "الصوت المدبلج باللهجة العراقية (Doblaj AI)",
      kurdishTranscript: "«بەخێربێن بۆ پێشانگاکەمان، نوێترین مۆدێلی جلوبەرگی هاوینەمان بۆ گەیشتووە بە داشکاندنی تایبەت بۆ ئەم هەفتەیە.»",
      iraqiTranscript: "«أهلاً وسهلاً بيكم بمعرضنا، وصلتنا أرقى الموديلات الصيفية بتخفيضات خاصة كلش لهالاسبوع، لتفوتكم الفرصة وتعالوا زورونا.»",

      splitLeftTitle: "(وضع محلك الحالي)",
      splitLeftStatus: "سوق راكد وبضاعة مكدسة 🥀",
      splitLeftItem1: "❌ أكثر من ١٠,٠٠٠$ بضاعة غير مباعة على الرفوف",
      splitLeftItem2: "❌ ركود السوق المحلي بسبب تأخر الرواتب 📉",
      splitLeftItem3: "❌ السائح العربي يمر من أمام محلك دون فهم لغتك",
      splitLeftMetric: "$0 مبيعات من السياح 📉",

      splitRightTitle: "(وضع محلك مع Doblaj AI)",
      splitRightStatus: "مبيعات نقدية مستمرة 💰",
      splitRightItem1: "✅ فيديوهاتك تدبلج فوراً إلى لهجة عراقية طبيعية",
      splitRightItem2: "✅ السائح يراك على تيك توك ويأتي مباشرة لمعرضك 📈",
      splitRightItem3: "✅ بيعة واحدة شهرياً تغطي كامل اشتراك النظام 💰",
      splitRightMetric: "+١,٥٠٠,٠٠٠ دينار متوسط أرباح الويكند 📈",
      splitBottomNote: "(حسابات رياضية واقعية: بيعة واحدة لسائح عربي في الشهر تغطي تكلفة الـ 20$ للنظام. بقية المبيعات أرباح صافية لك).",

      calcTitle: "حاسبة الأرباح الضائعة من السياح",
      calcSubtitle: "حدد المؤشرات حسب هوامش ربح محلك لترى حجم السيولة النقدية الضائعة.",
      calcSlider1Label: "متوسط الربح الصافي من كل سائح:",
      calcSlider2Label: "عدد المشترين السياح المحتملين شهرياً:",
      calcResultProfit: "الأرباح الشهرية الضائعة من السياح:",
      calcCostNote: "تكلفة النظام الإجمالية: 20$ شهرياً فقط. بدون أي رسوم خفية.",
      calcCtaBtn: "إضافة هذه الأرباح لمحلي 💰",

      guaranteeTag: "ضمان واضح وقابل للاختبار",
      guaranteeTitle: "ضمان استرجاع كامل المبلغ لمدة ٧ أيام",
      guaranteeBody: "إذا لم تلاحظ طبيعية اللهجة العراقية وفائدتها لمتجرك خلال أول ٧ أيام، بنقرة رسالة واحدة عبر الواتساب نسترجع لك كامل الـ 20$ بدون أي أسئلة.",

      pricingAnchor: "تكلفة توظيف مترجم ومعلق صوتي عربي شهرياً:",
      pricingAnchorOld: "$500 / شهرياً",
      pricingAnchorSave: "توفير ٩٦٪ مع Doblaj AI",
      pricingTitle: "باقات الاشتراك",
      pricingSubtitle: "بيعة واحدة لسائح عربي تكفي لتغطية اشتراك شهر كامل.",
      billingMonthly: "شهرياً",
      billingAnnual: "سنوياً (شهران مجاناً) ✅",

      decoyTitle: "الباقة التجريبية المحدودة",
      decoyPrice: isAnnual ? "$12" : "$15",
      decoyPeriod: "/شهر",
      decoyLimit: "فيديو واحد فقط شهرياً ⚠️",
      decoyItem1: "❌ معالجة بطيئة في السيرفرات",
      decoyItem2: "❌ دقة عادية 720p",
      decoyItem3: "❌ صوت آلي بسيط",
      decoyCta: "الباقة التجريبية ($15)",

      targetBadge: "✅ الخطة الموصى بها للمحلات",
      targetTitle: "باقة النمو غير المحدودة",
      targetPrice: isAnnual ? "$16" : "$20",
      targetPeriod: "/شهر",
      targetLimit: "فيديوهات غير محدودة (حتى ١٥ دقيقة) 📈",
      targetItem1: "✅ معالجة فورية فائقة السرعة",
      targetItem2: "✅ لهجة عراقية بغدادية أصلية بمشاعر طبيعية",
      targetItem3: "✅ تصدير بدقة 4K Ultra-HD لمنصات التواصل",
      targetItem4: "✅ عزل صوتي تلقائي مع الحفاظ على الموسيقى",
      targetMicroCopy: "تكلفتها أقل من ربح بيع قطعة ملابس واحدة في الشهر.",
      targetCta: "بدء خطة الـ 20$ غير المحدودة 💰",

      anchorTitle: "باقة الوكالات والشركات",
      anchorPrice: isAnnual ? "$79" : "$99",
      anchorPeriod: "/شهر",
      anchorLimit: "١٢٠ دقيقة للفروع المتعددة",
      anchorItem1: "✅ أولوية VIP قصوى في المعالجة",
      anchorItem2: "✅ تمييز تلقائي لعدة متحدثين بالفيديو",
      anchorItem3: "✅ استنساخ صوت كادرك الخاص",
      anchorItem4: "✅ ربط برمجيات API ودعم فني مخصص",
      anchorCta: "باقة الوكالات ($99)",

      paymentTrust: "الدفع متاح عبر فاست باي (FastPay)، FIB، زين كاش، آسيا حوالة، فيزا وماستركارد.",

      faqTitle: "إجابة على سؤالين أساسيين",
      faqSubtitle: "اقرأ هذين البندين بوضوح قبل اتخاذ قرارك.",

      faq1Q: "لماذا لا أكتفي بوضع ترجمة كتابية (Subtitles) مجانية على الفيديو؟",
      faq1A:
        "السائح أثناء تجوله في السوق أو تصفحه السريع للتيك توك لا يركز على قراءة نصوص الترجمة. قرار الشراء يتولد عندما يسمع صوتاً بغدادياً أو بصرياً يرحب به بلهجته المألوفة. الترجمة الكتابية يتم تخطيها، بينما الصوت الطبيعي يجذب الانتباه.",

      faq2Q: "أنا صاحب متجر ولست مبرمجاً، هل استخدام النظام معقد؟",
      faq2A:
        "لا إطلاقاً. إذا كنت تستطيع إرسال فيديو عبر الواتساب، فأنت قادر على استخدام النظام. ترسل الفيديو للواتساب، والنظام يعيده مدبلجاً بالعراقية فوراً.",

      respectedExitQuote: "إذا مو مستعد اليوم، ماكو أي مشكلة. إحنا هنا شوكت ما تحتاج تحرّك بضاعتك وتبيعها للسياح.",
      footerLegal: "صُنع بـ ❤️ في كوردستان من أجل محلاتنا المحلية",
      navFeatures: "مقارنة الصوت",
      navCalculator: "حاسبة الأرباح",
      navPricing: "الأسعار",
      navFaq: "الأسئلة الشائعة",
      navLogin: "لوحة التحكم",
      navStart: "ابدأ الآن",
    },
    en: {
      badge: "⚠️ MARKET REPORT: SULAIMANIYAH & ERBIL RETAIL REALITY",
      heroHeadlineStart: "$10,000 in frozen seasonal inventory.",
      heroHeadlineHighlight: "Arab tourists walk past your store every single day.",
      heroHeadlineEnd: "Which pool of capital is your store marketing to?",
      heroSub:
        "Waiting for government payroll does not solve local cash flow shortages. Our AI dubs your promotional videos into natural Iraqi Arabic, bringing tourists in your city directly into your showroom.",
      ctaHeroMassive: "Start Direct Trial (Link WhatsApp in 10 Seconds)",
      inputPlaceholder: "Enter WhatsApp number (+964 7XX...)",
      ctaPrimary: "Link WhatsApp in 10 Seconds",
      ctaSubtext: "Instant Trial • No credit card required",

      passiveBannerText: "Wait... are you sure your competitors on Mawlawi Street aren't already targeting these tourists?",
      passiveBannerAction: "See Why",

      mechanismTag: "3-Step Mechanism",
      mechanismTitle: "How It Works Without Technical Complexity",
      step1Num: "01",
      step1Title: "Record in Kurdish Sorani",
      step1Desc: "Record the exact same everyday product walkthrough video in Kurdish Sorani as you normally do.",
      step2Num: "02",
      step2Title: "Send via WhatsApp",
      step2Desc: "Send the video to our bot. In 10 seconds, it dubs the audio into natural Iraqi Arabic while keeping original music and room tone.",
      step3Num: "03",
      step3Title: "Publish for Tourist Traffic",
      step3Desc: "Post to TikTok and Instagram to bring Baghdad and Basra tourists straight into your store.",

      audioTitle: "Compare Original Kurdish vs. Iraqi Arabic Dub",
      audioSubtitle: "Verifiable side-by-side comparison between original Kurdish Sorani and native Baghdad cadence.",
      kurdishAudioLabel: "Original Kurdish Sorani",
      iraqiAudioLabel: "Dubbed Iraqi Arabic (Doblaj AI)",
      kurdishTranscript: "«Welcome to our showroom! The latest summer collection has arrived with special promotional discounts for this week.»",
      iraqiTranscript: "«Welcome everyone to our showroom! Top summer collections have arrived with huge discounts just for this week, don't miss out.»",

      splitLeftTitle: "(Your Store Right Now)",
      splitLeftStatus: "Cold & Stagnant Inventory 🥀",
      splitLeftItem1: "❌ Over $10,000+ in unsold inventory sitting on shelves",
      splitLeftItem2: "❌ Local retail slowdown due to delayed government salaries 📉",
      splitLeftItem3: "❌ Arab tourists walk right past without understanding your audio",
      splitLeftMetric: "$0 Tourist Revenue 📉",

      splitRightTitle: "(Your Store With Doblaj AI)",
      splitRightStatus: "Consistent Cash Sales 💰",
      splitRightItem1: "✅ Kurdish videos converted to fluent Iraqi dialect",
      splitRightItem2: "✅ Tourists find you on TikTok and walk directly inside 📈",
      splitRightItem3: "✅ Just one sale per month covers the full $20 software fee 💰",
      splitRightMetric: "+1,500,000 IQD Avg. Weekend Profit 📈",
      splitBottomNote: "(Mathematical Fact: Just ONE tourist purchase covers the entire $20 monthly cost. All remaining sales are 100% pure profit).",

      calcTitle: "Missed Tourist Cash Flow Calculator",
      calcSubtitle: "Adjust the sliders based on your actual profit margins to calculate missed tourist revenue.",
      calcSlider1Label: "Average Profit per Arab Customer:",
      calcSlider2Label: "Potential Arab Tourist Buyers per Month:",
      calcResultProfit: "Monthly Missed Tourist Revenue:",
      calcCostNote: "Total System Cost: $20/month flat. Zero hidden fees.",
      calcCtaBtn: "Capture This Missed Revenue 💰",

      guaranteeTag: "Falsifiable Guarantee",
      guaranteeTitle: "100% 7-Day Money-Back Guarantee",
      guaranteeBody: "If within the first 7 days you are not satisfied with dialect naturalness or business utility, send a single WhatsApp message and we will refund your $20 immediately with zero questions asked.",

      pricingAnchor: "Hiring a human Arabic voice translator:",
      pricingAnchorOld: "$500 / month",
      pricingAnchorSave: "Save 96% with Doblaj AI",
      pricingTitle: "Subscription Plans",
      pricingSubtitle: "Just one tourist sale covers the full monthly system fee.",
      billingMonthly: "Monthly",
      billingAnnual: "Annual (2 Months Free) ✅",

      decoyTitle: "Limited Trial Tier",
      decoyPrice: isAnnual ? "$12" : "$15",
      decoyPeriod: "/mo",
      decoyLimit: "Strict Limit: 1 Video / month ⚠️",
      decoyItem1: "❌ Slower server queue processing",
      decoyItem2: "❌ Standard 720p export",
      decoyItem3: "❌ Basic synthetic voice model",
      decoyCta: "Trial Plan ($15)",

      targetBadge: "✅ Recommended Retail Plan",
      targetTitle: "Unlimited Retail Growth",
      targetPrice: isAnnual ? "$16" : "$20",
      targetPeriod: "/mo",
      targetLimit: "Unlimited Videos (Up to 15 mins total) 📈",
      targetItem1: "✅ Instant priority processing queue",
      targetItem2: "✅ Authentic Iraqi dialect with natural pacing",
      targetItem3: "✅ 4K Ultra-HD export for social channels",
      targetItem4: "✅ Background audio separation & music preservation",
      targetMicroCopy: "Costs less than the profit of selling one clothing item in a month.",
      targetCta: "Start $20 Unlimited Access 💰",

      anchorTitle: "Agency & Enterprise",
      anchorPrice: isAnnual ? "$79" : "$99",
      anchorPeriod: "/mo",
      anchorLimit: "120 Minutes Multi-Branch Capacity",
      anchorItem1: "✅ Dedicated VIP server infrastructure",
      anchorItem2: "✅ Unlimited multi-speaker detection",
      anchorItem3: "✅ Custom voice cloning for showroom staff",
      anchorItem4: "✅ Direct API integration & priority support",
      anchorCta: "Agency Plan ($99)",

      paymentTrust: "Secure payment via FastPay, FIB, ZainCash, AsiaHawala, Visa, or Mastercard.",

      faqTitle: "Two Core Practical Questions",
      faqSubtitle: "Read these two points clearly before making any decision.",

      faq1Q: "Why not simply put free Arabic text subtitles on my video?",
      faq1A:
        "Tourists walking through busy bazaars or scrolling TikTok do not stop to read subtitle text. Purchasing intent triggers when they hear a warm, native Baghdad or Basra voice addressing them in their own dialect. Subtitles are easily skipped, while native audio captures immediate attention.",

      faq2Q: "I am a shop owner, not a software engineer. Is this complicated?",
      faq2A:
        "Not at all. If you know how to send a video on WhatsApp, you can use this system. You send the video to WhatsApp, and the system returns it dubbed in Iraqi Arabic in seconds.",

      respectedExitQuote: "Not ready today? That is completely fine. We are here whenever you need to move inventory.",
      footerLegal: "Built with ❤️ in Kurdistan for our local retail markets",
      navFeatures: "Voice Demo",
      navCalculator: "ROI Calculator",
      navPricing: "Pricing",
      navFaq: "FAQ",
      navLogin: "Dashboard",
      navStart: "Start Now",
    },
  }[lang];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen ${isRTL ? "font-kurdish" : "font-sans"} antialiased selection:bg-emerald-500/25 selection:text-emerald-800 relative overflow-x-hidden`}
    >
      {/* PASSIVE PATTERN INTERRUPT STICKY BANNER */}
      <AnimatePresence>
        {showPassiveBanner && (
          <motion.div
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed top-20 inset-x-0 z-40 bg-[#0b0e17]/95 backdrop-blur-xl border-b border-emerald-500/30 text-zinc-200 py-3 px-4 sm:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                </span>
                <span className="text-zinc-200 font-medium leading-normal">
                  {t.passiveBannerText}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    const el = document.getElementById("contrast-hero");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors"
                >
                  {t.passiveBannerAction}
                </button>
                <button
                  onClick={() => setShowPassiveBanner(false)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Dismiss banner"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-[#06070a]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 p-0.5 shadow-[0_0_25px_rgba(16,185,129,0.45)] group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#06070a] rounded-[14px] flex items-center justify-center">
                  <span className="text-emerald-400 font-black text-xl tracking-tighter">DB</span>
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#06070a] animate-ping"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#fafafa] tracking-tight group-hover:text-emerald-400 transition-colors">
                  Doblaj
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  AI v2.4
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 font-bold">
                Retail Growth System
              </span>
            </div>
          </Link>

          {/* Action Buttons & Language Switcher */}
          <div className="flex items-center gap-3.5">
            {/* Language Switch */}
            <div className="flex items-center bg-[#0d0e14] border border-white/[0.08] rounded-xl p-1 text-xs shadow-inner">
              <button
                onClick={() => setLang("ckb")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  lang === "ckb"
                    ? "bg-emerald-500 text-[#040407] shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                سۆرانی
              </button>
              <button
                onClick={() => setLang("ar")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  lang === "ar"
                    ? "bg-emerald-500 text-[#040407] shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  lang === "en"
                    ? "bg-emerald-500 text-[#040407] shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            <Link
              to={isSignedIn ? "/dubbing" : `/sign-up?redirect_url=${encodeURIComponent('/dubbing')}`}
              className="relative group overflow-hidden px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-[#040407] text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="relative z-10 font-black">
                {isSignedIn ? t.navLogin : t.navStart}
              </span>
              <div className="absolute inset-0 bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          SECTION 1: THE CLINICAL DIAGNOSIS (HERO SECTION)
          Flat reality of unsold inventory vs Arab tourist capital
          ========================================================================= */}
      <div className="bg-[#040407] text-[#cfcfd3] transition-colors duration-1000 relative">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[15%] w-[650px] h-[650px] rounded-full bg-emerald-500/[0.08] blur-[150px]"></div>
          <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] rounded-full bg-rose-600/[0.08] blur-[170px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_70%,transparent_100%)] opacity-70"></div>
        </div>

        <section id="contrast-hero" className="relative pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span>{t.badge}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto mb-12 space-y-5"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.35]">
              <span className="text-[#a1a1aa] block mb-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal">
                {t.heroHeadlineStart}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 block mb-4 text-3xl sm:text-5xl lg:text-6xl font-black drop-shadow-[0_0_45px_rgba(16,185,129,0.45)]">
                {t.heroHeadlineHighlight}
              </span>
              <span className="text-white block text-2xl sm:text-4xl lg:text-5xl font-black">
                {t.heroHeadlineEnd}
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto font-medium leading-[2.1] sm:leading-[2.3] pt-4 px-2">
              {t.heroSub}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="grid lg:grid-cols-2 gap-8 items-stretch"
          >
            {/* Clinical Diagnosis: Stagnant Inventory Reality */}
            <div className="bg-gradient-to-b from-[#140b10] via-[#0d070b] to-[#070407] border border-rose-900/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-rose-800 to-rose-500"></div>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-2">
                    <span>{t.splitLeftStatus}</span>
                  </span>
                  <span className="text-xs font-mono text-rose-400/60 uppercase font-bold">STATUS: FROZEN</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#fafafa] mb-6">
                  {t.splitLeftTitle}
                </h3>
                <ul className="space-y-4 text-sm sm:text-base text-[#cfcfd3] mb-8 font-medium">
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-rose-900/20">
                    <span className="leading-snug">{t.splitLeftItem1}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-rose-900/20">
                    <span className="leading-snug">{t.splitLeftItem2}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-rose-900/20">
                    <span className="leading-snug">{t.splitLeftItem3}</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-black/70 border border-rose-900/50 text-center">
                <div className="text-xs uppercase font-bold text-rose-400 tracking-wider mb-1">
                  Tourist Revenue Result
                </div>
                <div className="text-3xl sm:text-4xl font-black text-rose-500 font-mono">
                  {t.splitLeftMetric}
                </div>
              </div>
            </div>

            {/* Falsifiable Math: Incremental Tourist Revenue */}
            <div className="bg-gradient-to-b from-[#0a2016] via-[#06170f] to-[#030d08] border-2 border-emerald-500/90 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.25)]">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                    <span>{t.splitRightStatus}</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400/90 uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>INCREMENTAL CASH</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#fafafa] mb-6">
                  {t.splitRightTitle}
                </h3>
                <ul className="space-y-4 text-sm sm:text-base text-[#fafafa] mb-8 font-semibold">
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="leading-snug">{t.splitRightItem1}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="leading-snug">{t.splitRightItem2}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="leading-snug">{t.splitRightItem3}</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-[#040a07]/90 border border-emerald-500/60 text-center shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-1">
                  Incremental Tourist Revenue Added
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  {t.splitRightMetric}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col items-center justify-center text-center max-w-3xl mx-auto z-20"
          >
            <Link
              to={isSignedIn ? "/dubbing" : `/sign-up?redirect_url=${encodeURIComponent('/dubbing')}`}
              className="w-full sm:w-auto relative group overflow-hidden px-8 sm:px-14 py-5 sm:py-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 text-[#040407] text-lg sm:text-2xl font-black shadow-[0_0_60px_rgba(16,185,129,0.55)] hover:shadow-[0_0_80px_rgba(16,185,129,0.75)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 border-2 border-emerald-300/60"
            >
              <span className="relative z-10 font-black">
                {t.ctaHeroMassive}
              </span>
              <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>

            <p className="mt-5 text-sm sm:text-base lg:text-lg font-bold text-emerald-300/95 max-w-2xl mx-auto leading-relaxed px-4">
              {t.splitBottomNote}
            </p>
          </motion.div>
        </section>
      </div>

      {/* =========================================================================
          SECTION 2: FALSIFIABLE AUTHORITY (THE 3-STEP MECHANISM & VOICE DEMO)
          Clean, jargon-free step explanation with audio spectrum verification
          ========================================================================= */}
      <div className="bg-gradient-to-b from-[#040407] via-[#f1f5f9] to-[#ffffff] text-zinc-900 transition-colors duration-1000">
        <section id="mechanism" className="py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-600 text-white shadow-md">
              {t.mechanismTag}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
              {t.mechanismTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border-2 border-zinc-200 shadow-lg relative">
              <div className="text-4xl font-black font-mono text-emerald-600 mb-4">{t.step1Num}</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{t.step1Title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{t.step1Desc}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl relative">
              <div className="text-4xl font-black font-mono text-emerald-600 mb-4">{t.step2Num}</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{t.step2Title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{t.step2Desc}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border-2 border-zinc-200 shadow-lg relative">
              <div className="text-4xl font-black font-mono text-emerald-600 mb-4">{t.step3Num}</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{t.step3Title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{t.step3Desc}</p>
            </div>
          </div>
        </section>

        {/* Live Audio Comparison Console */}
        <section id="voice-demo" className="py-16 px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                {t.audioTitle}
              </h3>
              <p className="text-base text-zinc-600 font-medium">
                {t.audioSubtitle}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-zinc-200 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-zinc-100 p-2 rounded-2xl border border-zinc-200 relative">
                <button
                  onClick={() => { setActiveAudioTab("kurdish"); setAudioProgress(0); }}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-3 relative z-10 ${
                    activeAudioTab === "kurdish"
                      ? "bg-rose-50 text-rose-700 border-2 border-rose-300 shadow-md"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <span>{t.kurdishAudioLabel}</span>
                </button>
                <button
                  onClick={() => { setActiveAudioTab("iraqi"); setAudioProgress(0); }}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-3 relative z-10 ${
                    activeAudioTab === "iraqi"
                      ? "bg-emerald-600 text-white shadow-lg scale-[1.01]"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <span>{t.iraqiAudioLabel}</span>
                </button>
              </div>

              <div className="bg-zinc-900 text-white p-6 sm:p-8 rounded-2xl border border-zinc-800 mb-8 space-y-6 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-lg transform active:scale-95 ${
                        activeAudioTab === "iraqi"
                          ? "bg-emerald-400 text-zinc-950 hover:bg-emerald-300 shadow-emerald-500/40"
                          : "bg-rose-500 text-white hover:bg-rose-400 shadow-rose-500/40"
                      }`}
                    >
                      {isPlayingAudio ? "⏸" : "▶"}
                    </button>
                    <div>
                      <div className="text-sm font-extrabold text-white">
                        {activeAudioTab === "iraqi" ? "Iraqi Dialect Stream (AI Synthesized)" : "Kurdish Original Audio"}
                      </div>
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        24-bit 48kHz • Natural Iraqi Cadence Engine
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-zinc-300 font-bold bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    00:0{Math.floor(audioProgress / 20)} / 00:05
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 sm:gap-1.5 h-16 px-2">
                  {[18, 35, 60, 85, 45, 90, 75, 40, 65, 95, 80, 50, 70, 100, 85, 60, 45, 80, 65, 40, 90, 75, 55, 30, 65, 85, 45, 20].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: isPlayingAudio ? `${Math.max(15, (h * (0.45 + Math.sin((audioProgress + i * 8) / 8) * 0.55)))}%` : `${h * 0.25}%`,
                      }}
                      className={`flex-1 rounded-full transition-all duration-150 ${
                        activeAudioTab === "iraqi"
                          ? i * 3.5 <= audioProgress ? "bg-gradient-to-t from-emerald-500 via-teal-300 to-emerald-200 shadow-[0_0_10px_#10b981]" : "bg-emerald-950/60"
                          : i * 3.5 <= audioProgress ? "bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_10px_#f43f5e]" : "bg-rose-950/60"
                      }`}
                    ></div>
                  ))}
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-xs sm:text-sm font-medium text-zinc-100 leading-relaxed">
                  <span className="text-zinc-400 text-xs block mb-1.5 font-bold">
                    {isRTL ? "دەقی قسەکراو لە ڤیدیۆکەدا:" : "Spoken Video Dialogue:"}
                  </span>
                  <span className={activeAudioTab === "iraqi" ? "text-emerald-300 font-bold text-sm sm:text-base" : "text-rose-300 text-sm sm:text-base"}>
                    {activeAudioTab === "iraqi" ? t.iraqiTranscript : t.kurdishTranscript}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: THE ROI REALITY CHECK (CALCULATOR UI)
            Direct input of profit margin and volume with flat $20 footnote
            ========================================================================= */}
        <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-600 text-white shadow-md">
              {isRTL ? "داهات و قازانجی ڕاستەقینە" : "PROFIT PROJECTION"}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
              {t.calcTitle}
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 font-bold leading-relaxed max-w-2xl mx-auto">
              {t.calcSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl p-6 sm:p-10 border-2 border-zinc-200/90 shadow-2xl">
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
              <div className="space-y-3 bg-zinc-50 p-5 sm:p-6 rounded-2xl border border-zinc-200">
                <div className="flex justify-between items-center text-sm sm:text-base font-bold text-zinc-900">
                  <span>{t.calcSlider1Label}</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono bg-white px-3.5 py-1 rounded-xl border border-emerald-300 shadow-sm">
                    {avgProfitPerCustomer.toLocaleString()} {isRTL ? "دینار" : "IQD"}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={avgProfitPerCustomer}
                  onChange={(e) => setAvgProfitPerCustomer(Number(e.target.value))}
                  className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs font-mono font-bold text-zinc-500">
                  <span>{isRTL ? "١٠,٠٠٠ دینار" : "10,000 IQD"}</span>
                  <span>{isRTL ? "٥٠,٠٠٠ دینار" : "50,000 IQD"}</span>
                  <span>{isRTL ? "١٠٠,٠٠٠ دینار" : "100,000 IQD"}</span>
                </div>
              </div>

              <div className="space-y-3 bg-zinc-50 p-5 sm:p-6 rounded-2xl border border-zinc-200">
                <div className="flex justify-between items-center text-sm sm:text-base font-bold text-zinc-900">
                  <span>{t.calcSlider2Label}</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono bg-white px-3.5 py-1 rounded-xl border border-emerald-300 shadow-sm">
                    {touristCustomers} {isRTL ? "کڕیار" : "customers"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={touristCustomers}
                  onChange={(e) => setTouristCustomers(Number(e.target.value))}
                  className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs font-mono font-bold text-zinc-500">
                  <span>{isRTL ? "١ کڕیار" : "1 customer"}</span>
                  <span>{isRTL ? "٢٥ کڕیار" : "25 customers"}</span>
                  <span>{isRTL ? "٥٠ کڕیار" : "50 customers"}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-b from-emerald-900 via-emerald-950 to-zinc-950 text-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col justify-between text-center space-y-6">
              <div className="space-y-3">
                <div className="text-sm sm:text-base font-bold text-emerald-200 tracking-normal">
                  {t.calcResultProfit}
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-300 font-mono tracking-tight drop-shadow-[0_0_35px_rgba(16,185,129,0.55)]">
                  +{totalCalculatedProfitIQD.toLocaleString()} {isRTL ? "دینار" : "IQD"}
                </div>
                <p className="text-xs sm:text-sm font-medium text-emerald-100/90 leading-relaxed pt-2">
                  {t.calcCostNote}
                </p>
              </div>

              <Link
                to={isSignedIn ? "/dubbing" : `/sign-up?redirect_url=${encodeURIComponent('/dubbing')}`}
                className="block w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-zinc-950 font-black text-base sm:text-lg shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.calcCtaBtn}
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: THE FALSIFIABLE GUARANTEE (TRUST & LOCAL RISK REVERSAL)
            Concrete 7-day refund guarantee with local payment verification
            ========================================================================= */}
        <section id="guarantee" className="py-16 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto z-10">
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-md">
            <div className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-700 text-white">
              {t.guaranteeTag}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
              {t.guaranteeTitle}
            </h3>
            <p className="text-base sm:text-lg text-emerald-900 font-medium max-w-3xl mx-auto leading-relaxed">
              {t.guaranteeBody}
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: THE "OPEN DOOR" CHECKOUT (PRICING ARCHITECTURE)
            $20 Flat fee anchored against human translator ($500/mo)
            ========================================================================= */}
        <section ref={pricingSectionRef} id="pricing" className="py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 p-3.5 sm:px-6 sm:py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-sm font-bold shadow-sm">
              <span className="text-zinc-600">{t.pricingAnchor}</span>
              <span className="line-through text-rose-600 font-extrabold text-base">{t.pricingAnchorOld}</span>
              <span className="text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full text-xs font-black">
                {t.pricingAnchorSave}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-base sm:text-lg text-emerald-800 font-extrabold">
              {t.pricingSubtitle}
            </p>

            <div className="flex justify-center items-center gap-3 pt-4">
              <span className={`text-xs font-bold ${!isAnnual ? "text-zinc-900 font-black" : "text-zinc-400"}`}>{t.billingMonthly}</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-7 bg-zinc-200 rounded-full p-1 border border-zinc-300 transition-colors relative"
              >
                <div className={`w-5 h-5 rounded-full bg-emerald-600 shadow-md transition-transform transform ${isAnnual ? (isRTL ? "-translate-x-7" : "translate-x-7") : ""}`}></div>
              </button>
              <span className={`text-xs font-bold ${isAnnual ? "text-emerald-800 font-black" : "text-zinc-400"}`}>{t.billingAnnual}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto min-h-[580px]">
            {/* Card 1: The Anchor ($99 - Agency) -> Far Right in RTL */}
            <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 border border-zinc-700 flex flex-col justify-between shadow-2xl transition-all h-full">
              <div>
                <div className="text-xs uppercase font-mono text-zinc-400 font-bold mb-2">
                  {t.anchorTitle}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">{t.anchorPrice}</span>
                  <span className="text-xs text-zinc-400">{t.anchorPeriod}</span>
                </div>
                <div className="text-xs font-bold text-zinc-300 mb-6 bg-zinc-800 px-3 py-1 rounded-lg inline-block">
                  {t.anchorLimit}
                </div>
                <ul className="space-y-3 text-xs text-zinc-300 mb-8 font-medium">
                  <li className="flex items-center gap-2">{t.anchorItem1}</li>
                  <li className="flex items-center gap-2">{t.anchorItem2}</li>
                  <li className="flex items-center gap-2">{t.anchorItem3}</li>
                  <li className="flex items-center gap-2">{t.anchorItem4}</li>
                </ul>
              </div>
              <Link
                to={isSignedIn ? "/pricing?plan=creator" : `/sign-up?redirect_url=${encodeURIComponent('/pricing?plan=creator')}`}
                className="w-full py-3.5 rounded-xl border border-zinc-600 text-center text-xs font-bold text-white hover:bg-zinc-800 transition-colors block"
              >
                {t.anchorCta}
              </Link>
            </div>

            {/* Card 2: The Target ($20 - Most Popular) -> Middle Child */}
            <div
              className={`bg-gradient-to-b from-emerald-900 via-emerald-950 to-zinc-950 text-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-400 flex flex-col justify-between relative shadow-[0_0_60px_rgba(16,185,129,0.35)] transform lg:-translate-y-4 h-full ${
                tiersRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-300 text-zinc-950 text-xs font-black uppercase rounded-full shadow-lg whitespace-nowrap">
                {t.targetBadge}
              </div>
              <div>
                <div className="text-xs uppercase font-mono text-emerald-300 font-black tracking-wider mb-2">
                  {t.targetTitle}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black text-white tracking-tight">{t.targetPrice}</span>
                  <span className="text-sm font-bold text-emerald-200">{t.targetPeriod}</span>
                </div>
                <div className="text-sm font-black text-emerald-200 mb-6 bg-emerald-800/50 px-3.5 py-1.5 rounded-xl inline-block border border-emerald-600">
                  {t.targetLimit}
                </div>
                <ul className="space-y-3.5 text-sm font-semibold text-white mb-6">
                  <li className="flex items-center gap-2.5">{t.targetItem1}</li>
                  <li className="flex items-center gap-2.5">{t.targetItem2}</li>
                  <li className="flex items-center gap-2.5">{t.targetItem3}</li>
                  <li className="flex items-center gap-2.5">{t.targetItem4}</li>
                </ul>
                <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/40 text-xs font-bold text-emerald-300 text-center mb-6">
                  {t.targetMicroCopy}
                </div>
              </div>
              <Link
                to={isSignedIn ? "/pricing?plan=pro" : `/sign-up?redirect_url=${encodeURIComponent('/pricing?plan=pro')}`}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 text-center text-base font-black uppercase tracking-wider shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all transform hover:scale-[1.03] active:scale-[0.98] block"
              >
                {t.targetCta}
              </Link>
            </div>

            {/* Card 3: The Decoy ($15) -> Far Left in RTL */}
            <div
              className={`bg-zinc-100 rounded-3xl p-6 sm:p-8 border border-zinc-200 flex flex-col justify-between text-zinc-800 h-full ${
                tiersRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div>
                <div className="text-xs uppercase font-mono text-zinc-500 font-bold mb-2">
                  {t.decoyTitle}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-zinc-700">{t.decoyPrice}</span>
                  <span className="text-xs text-zinc-500">{t.decoyPeriod}</span>
                </div>
                <div className="text-xs font-bold text-rose-700 mb-6 bg-rose-50 px-3 py-1 rounded-lg inline-block border border-rose-200">
                  {t.decoyLimit}
                </div>
                <ul className="space-y-3 text-xs text-zinc-600 mb-8 font-medium">
                  <li className="flex items-center gap-2">{t.decoyItem1}</li>
                  <li className="flex items-center gap-2">{t.decoyItem2}</li>
                  <li className="flex items-center gap-2">{t.decoyItem3}</li>
                </ul>
              </div>
              <Link
                to={isSignedIn ? "/pricing?plan=starter" : `/sign-up?redirect_url=${encodeURIComponent('/pricing?plan=starter')}`}
                className="w-full py-3.5 rounded-xl border border-zinc-300 text-center text-xs font-bold text-zinc-700 hover:bg-zinc-200 transition-colors block"
              >
                {t.decoyCta}
              </Link>
            </div>
          </div>

          <div className="text-center mt-14 space-y-4">
            <div className="text-xs sm:text-sm font-semibold text-zinc-600">
              {t.paymentTrust}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-xs font-mono font-bold text-zinc-800 shadow-sm">FastPay</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-xs font-mono font-bold text-zinc-800 shadow-sm">FIB (First Iraqi Bank)</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-xs font-mono font-bold text-zinc-800 shadow-sm">ZainCash</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-xs font-mono font-bold text-zinc-800 shadow-sm">AsiaHawala</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-xs font-mono font-bold text-zinc-800 shadow-sm">Visa / Mastercard</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: THE RESPECTED EXIT (FAQ & DIGNIFIED TIMELINE FOOTER)
            Logically resolves objections and ends with an open, unforced statement
            ========================================================================= */}
        <section id="faq" className="py-24 px-4 sm:px-6 lg:px-10 bg-zinc-50 border-t border-zinc-200 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-600 text-white shadow-md">
                {t.navFaq}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
                {t.faqTitle}
              </h2>
              <p className="text-base sm:text-xl font-bold text-amber-700 max-w-2xl mx-auto leading-relaxed">
                ⚠️ {t.faqSubtitle}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 flex items-start gap-3 mb-4">
                  <span className="text-rose-600 text-xl font-black shrink-0">❓</span>
                  <span className="leading-snug">{t.faq1Q}</span>
                </h3>
                <div className="text-zinc-700 text-sm sm:text-base leading-relaxed font-medium border-t border-zinc-100 pt-4 pr-0 sm:pr-8">
                  {t.faq1A}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 flex items-start gap-3 mb-4">
                  <span className="text-rose-600 text-xl font-black shrink-0">❓</span>
                  <span className="leading-snug">{t.faq2Q}</span>
                </h3>
                <div className="text-zinc-700 text-sm sm:text-base leading-relaxed font-medium border-t border-zinc-100 pt-4 pr-0 sm:pr-8">
                  {t.faq2A}
                </div>
              </div>
            </div>

            {/* The Respected Exit Statement (Unforced, Dignified) */}
            <div className="mt-14 p-6 rounded-2xl bg-zinc-100 border border-zinc-300 text-center max-w-2xl mx-auto">
              <p className="text-sm sm:text-base font-bold text-zinc-700 leading-relaxed">
                «{t.respectedExitQuote}»
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                to={isSignedIn ? "/dubbing" : `/sign-up?redirect_url=${encodeURIComponent('/dubbing')}`}
                className="inline-block w-full max-w-lg py-5 px-8 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-lg sm:text-xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isRTL ? "ئێستا دەست پێبکە (لینککردنی وەتسئەپ لە ١٠ چرکەدا)" : "Start Now (Link WhatsApp in 10s)"}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 w-full py-16 px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-4 pr-0 md:pr-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-[#06070a] rounded-[8px] flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-sm">DB</span>
                  </div>
                </div>
                <span className="text-xl font-black text-white">Doblaj</span>
              </div>
              <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-medium">
                Transforming Kurdish retail videos into Iraqi Arabic tourist magnets with state-of-the-art synthetic voice AI.
              </p>
              <div className="pt-2 text-xs text-zinc-300">
                <p className="font-bold text-emerald-400">{t.footerLegal}</p>
              </div>
              <p className="text-xs text-zinc-500 pt-1">© 2026 Doblaj AI. All rights reserved.</p>
            </div>
            <div className="col-span-1 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product Features</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <a href="#voice-demo" className="text-zinc-400 hover:text-emerald-400 transition-colors">{t.navFeatures}</a>
                </li>
                <li>
                  <a href="#roi-calculator" className="text-zinc-400 hover:text-emerald-400 transition-colors">{t.navCalculator}</a>
                </li>
                <li>
                  <a href="#pricing" className="text-zinc-400 hover:text-emerald-400 transition-colors">{t.navPricing}</a>
                </li>
                <li>
                  <a href="#faq" className="text-zinc-400 hover:text-emerald-400 transition-colors">{t.navFaq}</a>
                </li>
              </ul>
            </div>
            <div className="col-span-1 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Security</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <Link to="/privacy" className="text-zinc-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-zinc-400 hover:text-emerald-400 transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-zinc-400 hover:text-emerald-400 transition-colors">Refund Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
