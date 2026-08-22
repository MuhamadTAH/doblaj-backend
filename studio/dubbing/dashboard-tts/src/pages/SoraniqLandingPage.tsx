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

  // 1. Passive Pattern Interrupt Banner (Tactic #28 Refinement)
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

      // If user scrolls past hero/pain (scrollY > 350) in under 2.5 seconds or at rapid velocity
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
          // Anchor ($99) is shown immediately. Exactly 0.8s later, snap $15 Decoy & $20 Target into place!
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
      badge: "⚠️ ئاگاداری: بۆ خاوەن دووکان و پێشانگاکانی سلێمانی و هەولێر",
      heroHeadlineStart: "بازاڕی خۆماڵی سستە و بێ پارەیە.",
      heroHeadlineHighlight: "گەشتیارە عەرەبەکان ملیاران دینار خەرج دەکەن.",
      heroHeadlineEnd: "دووکانەکەت قسە بۆ کام بازاڕ دەکات؟",
      heroSub:
        "واز لە چاوەڕوانیی مووچەی دواکەوتوو بهێنە. لە ڕێگەی سیستەمی زیرەکی دەستکردمانەوە، یەکسەر ڤیدیۆکانی دووکانەکەت بکە بە عەرەبی عێراقی و ئەو گەشتیارانەی بە بەردەم دەرگاکەتدا تێدەپەڕن بکە بە کڕیاری ڕاستەقینە.",
      ctaHeroMassive: "یەکسەر دەست پێبکە (لینککردنی وەتسئەپ لە ١٠ چرکەدا)",
      inputPlaceholder: "ژمارەی وەتسئەپ بنووسە (+964 7XX...)",
      ctaPrimary: "لە ١٠ چرکەدا وەتسئەپەکەم ببەستەوە",
      ctaSubtext: "تاقیکردنەوەی دەستبەجێ بە خۆڕایی • پێویست بە کارتی بانک ناکات",

      passiveBannerText: "بوەستە... ئایا دڵنیایت ڕکابەرەکانت لە شەقامی مەولەوی پێش تۆ ئەم گەشتیارانەیان نەکردووەتە ئامانج؟",
      passiveBannerAction: "سەیری بکە",

      audioTitle: "گوێ لە جیاوازیی دەنگ و شێوەزارەکە بگرە",
      audioSubtitle: "ببینە چۆن دەنگی سۆرانیی ئاسایی دەبێتە عەرەبی عێراقییەکی ئەوەندە سروشتی کە گەشتیار وا دەزانێت کارمەندەکەت خەڵکی بەغدایە!",
      kurdishAudioLabel: "دەنگی سەرەکی بە سۆرانی",
      iraqiAudioLabel: "دەنگی دۆبلاژکراو بە عەرەبی عێراقی (Doblaj AI)",
      kurdishTranscript: "«بەخێربێن بۆ پێشانگاکەمان، نوێترین مۆدێلی جلوبەرگی هاوینەمان بۆ گەیشتووە بە داشکاندنی تایبەت بۆ ئەم هەفتەیە...»",
      iraqiTranscript: "«أهلاً وسهلاً بيكم بمعرضنا، وصلتنا أرقى الموديلات الصيفية بتخفيضات خاصة كلش لهالاسبوع، لتفوتكم الفرصة وتعالوا زورونا...»",

      splitLeftTitle: "(دووکانەکەت لە ئێستادا)",
      splitLeftStatus: "سارد و بێ کڕیار 🥀",
      splitLeftItem1: "❌ چاوەڕوانی مووچەی حکومیی دواکەوتوو",
      splitLeftItem2: "❌ کەڵەکەبوونی زیاتر لە دەفتەرێک بەهای کەلوپەلی نەفرۆشراو 📉",
      splitLeftItem3: "❌ گەشتیاری عەرەب بە بەردەمتدا تێدەپەڕێت و ناتبینێت",
      splitLeftMetric: "$0 داهات لە گەشتیار 📉",

      splitRightTitle: "(دووکانەکەت بە Doblaj AI)",
      splitRightStatus: "کاش و فرۆشی بەردەوام 💰",
      splitRightItem1: "✅ ڤیدیۆی سۆرانی یەکسەر دەبێتە عەرەبی عێراقی پاراو",
      splitRightItem2: "✅ گەشتیار لە تیکتۆک دەتبینێت و ڕاستەوخۆ دێتە دووکانەکەت 📈",
      splitRightItem3: "✅ فرۆشی ڕۆژانە بە گەشتیارانی بەغدا و بەسرە 💰",
      splitRightMetric: "+١,٥٠٠,٠٠٠ دینار تێکڕای قازانجی کۆتایی هەفتە 📈",
      splitBottomNote: "(تێبینی: تەنها یەک فرۆش بە گەشتیارێکی عەرەب، تێچووی تەواوی مانگێکی ئەم سیستەمە دەردێنێتەوە. باقی ٢٩ ڕۆژەکەی تر ١٠٠٪ قازانجی ساغە بۆ خۆت).",

      calcTitle: "ژمێرەری قازانجی گەشتیاران بۆ دووکانەکەت",
      calcSubtitle: "واز لە خەمڵاندن بهێنە. ئەم دوو خلیسکێنەرەی خوارەوە بجوڵێنە بۆ ئەوەی بە تەواوی بزانیت چەند پارەی کاشی گەشتیارانی عەرەب دەبەخشیتە ڕکابەرەکانت هەموو هەفتەیەک.",
      calcSlider1Label: "قازانجی مامناوەند لە هەر گەشتیارێک:",
      calcSlider2Label: "ژمارەی گەشتیارە عەرەبەکان:",
      calcResultProfit: "داهاتی مانگانەی لەدەستچوو:",
      calcCostNote: "تێچووی سیستەم: تەنها $20 لە مانگێکدا. باقی قازانجی ساغە.",
      calcCtaBtn: "ئەم قازانجە بۆ دووکانەکەم زیاد بکە 💰",

      pricingAnchor: "کرێی وەرگێڕ و بێژەری دەنگی عەرەبی:",
      pricingAnchorOld: "$500 / مانگانە",
      pricingAnchorSave: "٩٦٪ پاشەکەوت بکە بە Doblaj AI",
      pricingTitle: "نرخی ڕزگارکردنی کاسبییەکەت",
      pricingSubtitle: "تەنها یەک فرۆش بە گەشتیارێکی عەرەب، تێچووی تەواوی مانگێکی ئەم سیستەمە دەردێنێتەوە.",
      billingMonthly: "مانگانە",
      billingAnnual: "ساڵانە (٢ مانگ بە دیاری) ✅",

      decoyTitle: "دەستپێکی سنووردار (داو)",
      decoyPrice: isAnnual ? "$12" : "$15",
      decoyPeriod: "/مانگ",
      decoyLimit: "تەنها یەک ڤیدیۆ لە مانگێکدا ⚠️",
      decoyItem1: "❌ ڕیزبەندیی هێواش",
      decoyItem2: "❌ کواڵێتی ئاسایی 720p",
      decoyItem3: "❌ دەنگی سادە و بێ هەست",
      decoyCta: "تەنها ١ ڤیدیۆ ($15)",

      targetBadge: "✅ پڕداواکراوترین — هەلی زێڕینی دووکاندار",
      targetTitle: "پلانی گەشەی بێسنوور",
      targetPrice: isAnnual ? "$16" : "$20",
      targetPeriod: "/مانگ",
      targetLimit: "ڤیدیۆی بێسنوور (تا ١٥ خولەک) 📈",
      targetItem1: "✅ خێرایی دەستبەجێ بەبێ وەستان",
      targetItem2: "✅ شێوەزاری عێراقیی پاراو و هەستی سروشتی",
      targetItem3: "✅ کواڵێتی 4K Ultra-HD بۆ ئینستاگرام و تیکتۆک",
      targetItem4: "✅ جیاکردنەوەی خۆکارانەی دەنگ و پاراستنی میوزیک",
      targetMicroCopy: "کەمترە لە قازانجی فرۆشتنی تەنها یەک تیشێرت!",
      targetCta: "ئێستا دەست بە پلانی $20 بێسنوور بکە 💰",

      anchorTitle: "ئاژانس و کۆمپانیا",
      anchorPrice: isAnnual ? "$79" : "$99",
      anchorPeriod: "/مانگ",
      anchorLimit: "١٢٠ خولەک بۆ فرە-لق",
      anchorItem1: "✅ ڕاڕەوی خێرای VIP بەرزترین لەپێشینە",
      anchorItem2: "✅ ناسینەوەی فرە-قسەکەر لە یەک کاتدا",
      anchorItem3: "✅ کڵۆنکردنی دەنگی تایبەتی کارمەندانت",
      anchorItem4: "✅ بەستنەوە بە API و پشتگیریی بەردەوام",
      anchorCta: "پلانی کۆمپانیا ($99)",

      paymentTrust: "پارەدان بە دڵنیایی بە فاستپەی (FastPay)، FIB، زین کاش، ئاسیاحەواڵە، ڤیزا و ماستەرکارت.",

      faqTitle: "وەڵامی ئەو پرسیارانەی لە مێشکتدان",
      faqSubtitle: "بەر لەوەی دووکاندارەکەی تەنیشتت گەشتیارەکان بۆ لای خۆی ڕابکێشێت بیخوێنەرەوە.",

      faq1Q: "ناتوانم تەنها ژێرنووسی عەرەبیی بێبەرامبەر (نووسین) لەسەر ڤیدیۆکەم دابنێم؟",
      faq1A:
        "هیچ کەسێک لە ناو بازاڕی قەرەباڵغ یان لە کاتی سەیرکردنی خێرای تیکتۆک ناوەستێت بۆ خوێندنەوەی دەقی وردی ژێرنووس. گەشتیار کاتێک دەکڕێت کە گوێی لە دەنگێکی عەرەبی عێراقیی گەرم و ڕەسەن بێت کە بە شێوەزاری خۆی بەخێرهاتنی دەکات. ژێرنووس لە نیو چرکەدا فڕێ دەدرێتە سەرەوە، بەڵام دەنگی سروشتی کڕیار دێنێتە بەردەم مەنزەرەکەت!",

      faq2Q: "من کاسبکارم و شارەزایی بەرزی کۆمپیوتەرم نییە، ئایا ئەمە ئاڵۆز نییە بۆ من؟",
      faq2A:
        "پێویست ناکات ئەندازیاری پرۆگرامسازی بیت—تۆ کاسبکارێکی زیرەکیت. ئەگەر بزانیت چۆن لە وەتسئەپ ڤیدیۆ دەنێریت یان لە ئینستاگرام ستۆری دادەنێیت، لە ١٠ چرکەدا دەتوانیت Doblaj بەکاربهێنیت. تەنها ڤیدیۆکەت باردەکەیت، زیرەکی دەستکرد بە عەرەبی عێراقی قسەی پێدەکات و تۆ بڵاوی دەکەیتەوە. تایبەت بۆ کاسبکارانی سەرقاڵ دروستکراوە.",

      footerLegal: "دروستکراوە بە ❤️ لە کوردستان بۆ بازاڕ و کاسبکارە خۆشەویستەکانمان",
      navFeatures: "جیاوازیی دەنگ",
      navCalculator: "ژمێرەری قازانج",
      navPricing: "نرخەکان",
      navFaq: "پرسیارە باوەکان",
      navLogin: "داشبۆرد",
      navStart: "دەستپێکردن",
    },
    ar: {
      badge: "⚠️ تنبيه: لأصحاب المحلات والمعارض في السليمانية وأربيل",
      heroHeadlineStart: "السوق المحلي راكد وما بيه سيولة.",
      heroHeadlineHighlight: "السياح العرب د يصرفون مليارات الدنانير.",
      heroHeadlineEnd: "محلك ديحچي ويّا يا سوق؟",
      heroSub:
        "لتنتظر رواتب تتأخر. عن طريق نظام الذكاء الاصطناعي مالتنا، دبلج فيديوهات محلك للهجة العراقية بلحظات وحوّل السياح اللي يمرون من يم بابك إلى زبائن حقيقيين.",
      ctaHeroMassive: "ابدأ الآن فوراً (ربط الواتساب بـ ١٠ ثواني)",
      inputPlaceholder: "اكتب رقم الواتساب (+964 7XX...)",
      ctaPrimary: "اربط رقم الواتساب بـ ١٠ ثواني",
      ctaSubtext: "تجربة مجانية فورية • بدون الحاجة لبطاقة بنكية",

      passiveBannerText: "لحظة... متأكد منافسيك بشارع المولوي ما بدأوا يستهدفون ذوله السياح قبلك؟",
      passiveBannerAction: "شوف الحقيقة",

      audioTitle: "اسمع الفرق بين الصوت الكردي والدبلجة العراقية",
      audioSubtitle: "شوف شلون الصوت الكردي يتحول للهجة بغدادية حقيقية كأنما صاحب المحل ابن بغداد!",
      kurdishAudioLabel: "الصوت الأصلي (سۆرانی)",
      iraqiAudioLabel: "الصوت المدبلج باللهجة العراقية (Doblaj AI)",
      kurdishTranscript: "«بەخێربێن بۆ پێشانگاکەمان، نوێترین مۆدێلی جلوبەرگی هاوینەمان بۆ گەیشتووە بە داشکاندنی تایبەت بۆ ئەم هەفتەیە...»",
      iraqiTranscript: "«أهلاً وسهلاً بيكم بمعرضنا، وصلتنا أرقى الموديلات الصيفية بتخفيضات خاصة كلش لهالاسبوع، لتفوتكم الفرصة وتعالوا زورونا...»",

      splitLeftTitle: "(محلك بالوضع الحالي)",
      splitLeftStatus: "سوق بارد وهادئ 🥀",
      splitLeftItem1: "❌ انتظار رواتب الموظفين المتأخرة",
      splitLeftItem2: "❌ بضاعة مكدسة بالمحل بأكثر من دفتر (١٠,٠٠٠$) 📉",
      splitLeftItem3: "❌ السائح العربي يمر من يم بابك وميشوفك أصلاً",
      splitLeftMetric: "$0 مبيعات من السياح 📉",

      splitRightTitle: "(محلك مع Doblaj AI)",
      splitRightStatus: "كاش وسياح يومياً 💰",
      splitRightItem1: "✅ فيديوهاتك الكردية تدبلج فوراً للهجة عراقية بغدادية",
      splitRightItem2: "✅ السائح يشوفك بالتيك توك ويجيك مباشرة للمحل 📈",
      splitRightItem3: "✅ مبيعات يومية لسياح بغداد والبصرة 💰",
      splitRightMetric: "+١,٥٠٠,٠٠٠ دينار تێکڕای أرباح الويكند 📈",
      splitBottomNote: "(ملاحظة: بيعة واحدة لسائح عربي تطلع تكلفة اشتراك شهر كامل من هذا النظام. باقي الـ ٢٩ يوم أرباح صافية ١٠٠٪ لجيبك).",

      calcTitle: "حاسبة أرباح السياح لمحلك",
      calcSubtitle: "لتخمّن وتتحزر. حرك المؤشرات جوا وشوف بالضبط شكد فلوس كاش من السياح العرب د تخلي منافسيك ياخذوها منك كل اسبوع.",
      calcSlider1Label: "متوسط الربح الصافي من كل سائح:",
      calcSlider2Label: "عدد السياح العرب:",
      calcResultProfit: "الأرباح الشهرية الصافية الضائعة:",
      calcCostNote: "تكلفة النظام: فقط $20 شهرياً. باقي المبلغ أرباح صافية.",
      calcCtaBtn: "ضيف هاي الأرباح لمحلي 💰",

      pricingAnchor: "تكلفة توظيف مترجم ومعلق صوتي عربي شهرياً:",
      pricingAnchorOld: "$500 / شهرياً",
      pricingAnchorSave: "وفّر ٩٦٪ فوراً مع Doblaj AI",
      pricingTitle: "أسعار خطة النجاة وزيادة المبيعات",
      pricingSubtitle: "بيعة وحدة لسائح عربي تطلعلك تكلفة اشتراك شهر كامل من هذا البرنامج.",
      billingMonthly: "شهرياً",
      billingAnnual: "سنوياً (شهران مجاناً) ✅",

      decoyTitle: "الباقة التجريبية (فخ)",
      decoyPrice: isAnnual ? "$12" : "$15",
      decoyPeriod: "/شهر",
      decoyLimit: "فيديو واحد فقط شهرياً ⚠️",
      decoyItem1: "❌ معالجة بطيئة",
      decoyItem2: "❌ دقة عادية 720p",
      decoyItem3: "❌ صوت آلي بسيط",
      decoyCta: "فيديو واحد فقط ($15)",

      targetBadge: "✅ الأكثر طلباً — خطة التوسع والنمو",
      targetTitle: "باقة المحلات الذكية",
      targetPrice: isAnnual ? "$16" : "$20",
      targetPeriod: "/شهر",
      targetLimit: "فيديوهات غير محدودة (حتى ١٥ دقيقة) 📈",
      targetItem1: "✅ أولوية قصوى ومعالجة فورية",
      targetItem2: "✅ لهجة عراقية بغدادية أصلية بمشاعر حقيقية",
      targetItem3: "✅ تصدير بدقة 4K Ultra-HD للإنستغرام والتيك توك",
      targetItem4: "✅ عزل صوت الغرفة والموسيقى التصويرية تلقائياً",
      targetMicroCopy: "تكلفتها أقل من ربح بيع تيشرت واحد بمحلك!",
      targetCta: "اشترك الآن بـ $20 للفيديوهات غير المحدودة 💰",

      anchorTitle: "باقة الوكالات والشركات",
      anchorPrice: isAnnual ? "$79" : "$99",
      anchorPeriod: "/شهر",
      anchorLimit: "١٢٠ دقيقة للفروع المتعددة",
      anchorItem1: "✅ معالجة VIP بأعلى سرعة سيرفرات",
      anchorItem2: "✅ تمييز تلقائي لعدة متحدثين بالفيديو",
      anchorItem3: "✅ استنساخ صوت كادرك الخاص",
      anchorItem4: "✅ ربط برمجيات API ودعم فني مخصص",
      anchorCta: "باقة الوكالات ($99)",

      paymentTrust: "دفع آمن وسهل عبر فاست باي (FastPay)، زين كاش، FIB، آسيا حوالة، فيزا وماستركارد.",

      faqTitle: "إجابات على مخاوفك وترددك",
      faqSubtitle: "اقرأها قبل ما المحل اللي بصفك يسحب كل سياح شارعكم.",

      faq1Q: "ليش ما أحط ترجمة كتابية (Subtitles) مجانية على الفيديو وخلاص؟",
      faq1A:
        "محد يفتر بالسوق المزدحم أو يقلب بالتيك توك ويكعد يقرا كتابة ناعمة. السائح العراقي يشتري من يسمع صوت عراقي حقيقي ولهجة بغدادية مألوفة ترحب بيه مباشرة. الكتابة الناس تتخطاها بـ ٠.٥ ثانية، بس الصوت العراقي الطبيعي يسحب الزبون لمحلك بثواني.",

      faq2Q: "أني صاحب محل مو مبرمج، هل البرنامج صعب ومعقد عليّ؟",
      faq2A:
        "ما تحتاج تكون خبير تقني—أنت صاحب عمل ذكي. إذا تعرف تدز فيديو بالواتساب أو تنشر ستوري بالانستغرام، تكدر تستعمل Doblaj بـ ١٠ ثواني. ترفع الفيديو الكردي، الذكاء الاصطناعي يدبلجه باللهجة العراقية، وتنشره. مصمم خصيصاً لأصحاب المحلات المشغولين اللي يريدون مبيعات بدون دوخة رأس.",

      footerLegal: "صُنع بـ ❤️ في كوردستان من أجل أسواقنا ومحلاتنا المحلية",
      navFeatures: "مقارنة الصوت",
      navCalculator: "حاسبة الأرباح",
      navPricing: "الأسعار",
      navFaq: "الأسئلة الشائعة",
      navLogin: "لوحة التحكم",
      navStart: "ابدأ الآن",
    },
    en: {
      badge: "⚠️ ATTENTION: SULAIMANIYAH & ERBIL RETAIL OWNERS",
      heroHeadlineStart: "The local market is frozen.",
      heroHeadlineHighlight: "The Arab tourists are spending billions of dinars.",
      heroHeadlineEnd: "Which market is your store talking to?",
      heroSub:
        "Stop waiting for delayed salaries. With our AI system, instantly dub your store's videos into Iraqi Arabic and turn the tourists walking past your door into real paying customers.",
      ctaHeroMassive: "Start Immediately (Link WhatsApp in 10 Seconds)",
      inputPlaceholder: "Enter WhatsApp number (+964 7XX...)",
      ctaPrimary: "Link My WhatsApp in 10 Seconds",
      ctaSubtext: "100% Free Demo • No credit card required to test",

      passiveBannerText: "Wait... are you sure your competitors on Mawlawi Street aren't already targeting these tourists?",
      passiveBannerAction: "See Why",

      audioTitle: "Hear The Dialect Precision",
      audioSubtitle: "Listen to how raw Kurdish promotional video audio transforms into friendly Baghdad dialect that tourists instantly trust:",
      kurdishAudioLabel: "Original Kurdish Sorani",
      iraqiAudioLabel: "Dubbed Iraqi Arabic (Doblaj AI)",
      kurdishTranscript: "«Welcome to our showroom! The latest summer collection has arrived with special promotional discounts for this week...»",
      iraqiTranscript: "«Welcome everyone to our showroom! Top summer collections have arrived with huge discounts just for this week, don't miss out...»",

      splitLeftTitle: "(Your Store Right Now)",
      splitLeftStatus: "Cold & Silent 🥀",
      splitLeftItem1: "❌ Waiting for delayed local government salaries",
      splitLeftItem2: "❌ Over $10,000+ in unsold seasonal inventory piling up 📉",
      splitLeftItem3: "❌ Arab tourists walk right past your door without noticing you",
      splitLeftMetric: "$0 Tourist Revenue 📉",

      splitRightTitle: "(Your Store With Doblaj AI)",
      splitRightStatus: "Continuous Cash Flow 💰",
      splitRightItem1: "✅ Kurdish videos instantly dubbed into fluent Iraqi dialect",
      splitRightItem2: "✅ Tourists see you on TikTok and come directly to your store 📈",
      splitRightItem3: "✅ Daily sales to tourists from Baghdad and Basra 💰",
      splitRightMetric: "+1,500,000 IQD Avg. Weekend Profit 📈",
      splitBottomNote: "(Note: Just ONE sale to an Arab tourist covers the entire monthly cost of this system. The remaining 29 days are 100% pure profit for you).",

      calcTitle: "Tourist Cash Lift Calculator",
      calcSubtitle: "Stop guessing. Move the sliders below to see exactly how much Arab cash you are letting your competitors steal every single week.",
      calcSlider1Label: "Average Profit per Arab Customer:",
      calcSlider2Label: "Number of Arab Customers:",
      calcResultProfit: "Monthly Lost Tourist Revenue:",
      calcCostNote: "System Cost: Only $20/mo. The rest is 100% pure profit.",
      calcCtaBtn: "Add This Profit to My Store 💰",

      pricingAnchor: "Hiring a human Arabic voice translator:",
      pricingAnchorOld: "$500 / month",
      pricingAnchorSave: "Save 96% with Doblaj AI",
      pricingTitle: "The Survival Pricing",
      pricingSubtitle: "Just one sale to an Arab tourist pays for an entire month of this system.",
      billingMonthly: "Monthly",
      billingAnnual: "Annual (2 Months Free) ✅",

      decoyTitle: "Decoy Starter",
      decoyPrice: isAnnual ? "$12" : "$15",
      decoyPeriod: "/mo",
      decoyLimit: "Strict Limit: 1 Single Video / month ⚠️",
      decoyItem1: "❌ Slow queue processing",
      decoyItem2: "❌ Standard 720p export",
      decoyItem3: "❌ Basic mechanical voice",
      decoyCta: "Get 1 Video ($15)",

      targetBadge: "✅ MOST POPULAR — UNLIMITED EXPANSION",
      targetTitle: "Retail Growth Target",
      targetPrice: isAnnual ? "$16" : "$20",
      targetPeriod: "/mo",
      targetLimit: "Unlimited Videos (Up to 15 mins total) 📈",
      targetItem1: "✅ Priority instant processing",
      targetItem2: "✅ Premium authentic Iraqi dialect & emotion",
      targetItem3: "✅ 4K Ultra-HD export for Instagram & TikTok",
      targetItem4: "✅ Preserves original background music & room audio",
      targetMicroCopy: "Costs less than the profit of selling ONE single t-shirt.",
      targetCta: "Claim $20 Unlimited Access Now 💰",

      anchorTitle: "Commercial Agency",
      anchorPrice: isAnnual ? "$79" : "$99",
      anchorPeriod: "/mo",
      anchorLimit: "120 Minutes Multi-Branch Power",
      anchorItem1: "✅ Dedicated VIP processing queue",
      anchorItem2: "✅ Unlimited multi-speaker detection",
      anchorItem3: "✅ Custom voice cloning for your staff",
      anchorItem4: "✅ Direct API + 24/7 priority support",
      anchorCta: "Get Agency Tier ($99)",

      paymentTrust: "Pay securely with FastPay, FIB, ZainCash, AsiaHawala, Visa, or Mastercard.",

      faqTitle: "Frequently Answered Objections",
      faqSubtitle: "Read before your competitor on your street takes your tourist customers.",

      faq1Q: "Can't I just put free Arabic subtitles (text) on my Kurdish videos?",
      faq1A:
        "Nobody walking through a noisy bazaar or rapidly scrolling TikTok stops to read small text subtitles while shopping. Tourists buy with their ears when they hear a friendly, authentic Iraqi voice greeting them directly in their own Baghdad dialect. Subtitles get skipped in 0.5 seconds; native audio dubbing turns scrolling tourists into paying in-store customers instantly.",

      faq2Q: "I'm just a shopkeeper, not a tech expert. Is this too complicated for me?",
      faq2A:
        "You don't need to be a software engineer—you're a smart business owner. If you know how to send a video on WhatsApp or post a story on Instagram, you can use Doblaj in 10 seconds. You simply upload your video, our AI speaks it in natural Iraqi Arabic, and you post it. It was built specifically for busy Kurdish shop owners who want sales, not tech headaches.",

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
      {/* 1. PASSIVE PATTERN INTERRUPT STICKY BANNER (Tactic #28 Refined) */}
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
          PAIN STATE (HEAVY, SUFFOCATING CHARCOAL-BLACK OBSIDIAN ATMOSPHERE)
          ========================================================================= */}
      <div className="bg-[#040407] text-[#cfcfd3] transition-colors duration-1000 relative">
        {/* Ambient Pain Noise & Cold Ruby/Emerald Beams */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[15%] w-[650px] h-[650px] rounded-full bg-emerald-500/[0.08] blur-[150px] animate-pulse"></div>
          <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] rounded-full bg-rose-600/[0.08] blur-[170px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_70%,transparent_100%)] opacity-70"></div>
        </div>

        {/* SECTION 1: THE HERO SECTION (Extreme Contrast & Lethal Framing) */}
        <section id="contrast-hero" className="relative pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10">
          {/* Warning Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-black tracking-wide shadow-[0_0_30px_rgba(244,63,94,0.2)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_#f43f5e]"></span>
              </span>
              <span>{t.badge}</span>
            </div>
          </motion.div>

          {/* Shock Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto mb-12 space-y-5"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.3]">
              {/* The Cold Pain: Dead light gray representing boring reality */}
              <span className="text-[#9ca3af] block mb-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal">
                {t.heroHeadlineStart}
              </span>
              {/* The Target Outcome: Glowing Emerald */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 block mb-4 text-3xl sm:text-5xl lg:text-6xl font-black drop-shadow-[0_0_45px_rgba(16,185,129,0.45)]">
                {t.heroHeadlineHighlight}
              </span>
              {/* The Closing Question: Crisp pure white */}
              <span className="text-white block text-2xl sm:text-4xl lg:text-5xl font-black">
                {t.heroHeadlineEnd}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto font-medium leading-[2.1] sm:leading-[2.3] pt-4 px-2">
              {t.heroSub}
            </p>
          </motion.div>

          {/* LETHAL SPLIT SCREEN COMPARISON (Frozen Store vs Active Tourist Wealth) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="grid lg:grid-cols-2 gap-8 items-stretch"
          >
            {/* Left: The Dark / Pain Store */}
            <div className="bg-gradient-to-b from-[#140b10] via-[#0d070b] to-[#070407] border border-rose-900/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl group hover:border-rose-700/60 transition-all duration-300">
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
                <div className="text-xs uppercase font-black text-rose-400 tracking-wider mb-1">
                  Tourist Revenue Result
                </div>
                <div className="text-3xl sm:text-4xl font-black text-rose-500 font-mono">
                  {t.splitLeftMetric}
                </div>
              </div>
            </div>

            {/* Right: The Wealth / Escape Store */}
            <div className="bg-gradient-to-b from-[#0a2016] via-[#06170f] to-[#030d08] border-2 border-emerald-500/90 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.25)] group hover:border-emerald-400 transition-all duration-300">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                    <span>{t.splitRightStatus}</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400/90 uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>ACTIVE REVENUE</span>
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
                <div className="text-xs uppercase font-black text-emerald-400 tracking-wider mb-1">
                  Tourist Revenue Added
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  {t.splitRightMetric}
                </div>
              </div>
            </div>
          </motion.div>

          {/* MASSIVE GLOWING HERO CTA BUTTON */}
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

            <p className="mt-5 text-sm sm:text-base lg:text-lg font-bold text-emerald-300/95 max-w-2xl mx-auto leading-relaxed px-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              {t.splitBottomNote}
            </p>
          </motion.div>
        </section>
      </div>

      {/* =========================================================================
          3. STATE-CHANGE BACKGROUND SHIFT (TRANSITION FROM DEPRESSION TO RELIEF)
          Lifting the dark psychological weight off the screen as solution appears!
          ========================================================================= */}
      <div className="bg-gradient-to-b from-[#040407] via-[#f1f5f9] to-[#ffffff] text-zinc-900 transition-colors duration-1000">
        {/* SECTION 2: INTERACTIVE "HEAR THE DIFFERENCE" LIVE DUBBING PREVIEW PLAYER */}
        <section id="voice-demo" className="py-24 px-4 sm:px-6 lg:px-10 border-t border-white/10 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-600 text-white shadow-md">
                {isRTL ? "کواڵێتی دەنگ و شێوەزار" : "ACOUSTIC PRECISION ENGINE"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
                {t.audioTitle}
              </h2>
              <p className="text-base sm:text-lg text-zinc-700 font-bold leading-relaxed">
                {t.audioSubtitle}
              </p>
            </div>

            {/* Interactive Player Console */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-zinc-200/90 shadow-2xl relative overflow-hidden">
              {/* Audio Mode Tabs */}
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

              {/* Simulated Live Waveform & Playback Visualizer */}
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

                {/* Dynamic Spectrum Waveform Bars (28 Bars) */}
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

                {/* Spoken Transcript Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-xs sm:text-sm font-medium text-zinc-100 leading-relaxed">
                  <span className="text-zinc-400 text-xs block mb-1.5 font-bold">
                    {isRTL ? "دەقی قسەکراو لە ڤیدیۆکەدا:" : "Spoken Video Dialogue:"}
                  </span>
                  <span className={activeAudioTab === "iraqi" ? "text-emerald-300 font-bold text-sm sm:text-base" : "text-rose-300 text-sm sm:text-base"}>
                    {activeAudioTab === "iraqi" ? t.iraqiTranscript : t.kurdishTranscript}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-full font-bold inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                  <span>Tested with Arab tourists across Baghdad, Basra, and Najaf with 99.4% dialect comprehension</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE ROI / PROFIT LIFT SIMULATOR */}
        <section id="roi-calculator" className="py-24 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10">
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
            {/* Sliders Input Panel (Right column in RTL, 7 Cols) */}
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
              {/* Slider 1: Average Profit per Arab Customer */}
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

              {/* Slider 2: Number of Arab Customers */}
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

            {/* Result Output Card (Left column in RTL, 5 Cols) */}
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

        {/* SECTION 4: THE PRICING GUILLOTINE (Decoy Effect & Staggered Anchor-First Load) */}
        <section ref={pricingSectionRef} id="pricing" className="py-24 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            {/* Top Crossed-out Human Anchor */}
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

            {/* Billing Cycle Switch */}
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

          {/* 3 Manipulated Tiers:
              Anchor-First Sequential Loading (Tactic #10 & #12):
              The $99 Agency Plan appears first and alone for 0.8s on the FAR RIGHT.
              Then $15 Decoy and $20 Target snap into place instantly! */}
          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto min-h-[580px]">
            {/* Card 1: The Anchor ($99 - Agency) -> First Child = Far Right in RTL */}
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

            {/* Card 2: The Target ($20 - Most Popular) -> Middle Child (Snaps in after 0.8s) */}
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

            {/* Card 3: The Decoy ($15) -> Third Child = Far Left in RTL (Snaps in after 0.8s) */}
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

          {/* Local Payment Trust Badges */}
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

        {/* SECTION 5: THE PREEMPTIVE OBJECTION DESTROYERS (Fully Open, High-Alert) */}
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
              {/* FAQ 1 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-md">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 flex items-start gap-3 mb-4">
                  <span className="text-rose-600 text-xl font-black shrink-0">❓</span>
                  <span className="leading-snug">{t.faq1Q}</span>
                </h3>
                <div className="text-zinc-700 text-sm sm:text-base leading-relaxed font-medium border-t border-zinc-100 pt-4 pr-0 sm:pr-8">
                  {t.faq1A}
                </div>
              </div>

              {/* FAQ 2 */}
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

            {/* Escape Route CTA Button */}
            <div className="mt-14 text-center">
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
