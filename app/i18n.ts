export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "fa";
}

export const messages = {
  en: {
    skip: "Skip to content", language: "فارسی", languageLabel: "Switch to Persian",
    nav: { features: "Features", why: "Why Ekipma", pricing: "Pricing", download: "Get the app" },
    hero: { eyebrow: "LIFE’S BETTER WITH YOUR PEOPLE", title: ["Less sorting.", "More living."], description: "The little things add up when you live together. Keep expenses, turns, and plans in one happy place.", primary: "Get Ekipma", secondary: "Meet your new plus-one", note: "Made for friends. Right at home with roommates.", caption: "YOUR WHOLE CREW. IN SYNC.", stickerTitle: "Good friends. Clear tabs.", stickerCopy: "A little less “who owes who?”" },
    tri: ["Share expenses.", "Take turns.", "Make plans."],
    features: { label: "01 / THE EVERYDAY, SIMPLIFIED", title: ["Three little things.", "One less thing on your mind."], copy: "From the grocery run to the weekend away. Less admin for the group. More room for the good stuff." },
    together: { label: "02 / BUILT AROUND YOUR CIRCLE", title: ["Your people.", "Your place.", "Your little system."], copy: "A dorm room, a shared apartment, or the friends who always say “we should do something.” Make a group and give your everyday life a home.", cta: "Bring your people", aria: "Example group: Apartment 4, with four roommates sharing groceries, chores, and a movie night", sceneLabel: "A LITTLE SPACE FOR ALL OF YOU", group: "Apartment 4", groupCopy: "4 friends. One home.", groceries: "Groceries, sorted", movie: "Friday is movie night" },
    pricing: { label: "03 / A PLAN FOR YOUR PEOPLE", title: ["Start together.", "Grow from there."], copy: "The everyday essentials are free. Go deeper with Premium, or talk to us about your team.", extra: "A little extra", details: "What’s included in Premium?", detailsCopy: "Premium adds spending analytics and charts to help you understand your shared expenses, with room for a larger circle of friends. Monthly pricing and the final feature list will be shared here when the plan is ready." },
    plans: [
      { name: "Free", caption: "For you and your favorite people.", price: "Free", period: "Always a good place to start.", features: ["Shared expenses & repayments", "Rotating turns & responsibilities", "Plans with your friends", "Groups for your shared life"], cta: "Get Ekipma" },
      { name: "Premium", caption: "A little more insight. A lot more clarity.", price: "Monthly", period: "Pricing to be announced", features: ["Everything in Free", "Spending analytics & charts", "A closer look at your expenses", "More room for your circle"], cta: "Explore Premium" },
      { name: "Company", caption: "For a bigger kind of together.", price: "Let’s talk", period: "A plan shaped around your team.", features: ["Tell us about your organization", "Discuss the features you need", "Find the right plan together"], cta: "Contact us" },
    ],
    faq: { label: "A FEW THINGS TO KNOW", title: "Good questions.", items: [["Is Ekipma just for roommates?", "It’s made for people who share things. Roommates and dorm friends are right at home, but you can also use it with your regular dinner crew, travel buddies, or any group planning life together."], ["How do shared expenses work?", "Add what you paid, choose the people sharing it, and Ekipma divides the total equally. Keep track of who owes what, record repayments, and confirm when you’ve settled up."], ["What can we take turns doing?", "Anything your group rotates: washing the dishes, cleaning the kitchen, or making the next grocery run. Set the order and period, then mark a turn done to move to the next person."], ["What goes into a plan?", "Give it a name, choose your people, and add the date and place. From a study session to a weekend hangout, the details stay together."]] },
    download: { eyebrow: "FOR THE PEOPLE YOU DO LIFE WITH", title: ["Make room for", "the good stuff."], copy: "Your expenses, turns, and plans. Finally, together.", apk: "Already on Android? Download the APK", footnote: "Small app. A little more harmony." },
    contact: { title: "Something bigger in mind?", copy: "Let’s find out how Ekipma could fit your company or community.", cta: "Contact us", pending: "Company inquiries open soon." },
    footer: "A little less admin. A lot more us.", store: { download: "Download on", soon: "Coming soon to" },
  },
  fa: {
    skip: "رفتن به محتوا", language: "English", languageLabel: "تغییر زبان به انگلیسی",
    nav: { features: "ویژگی‌ها", why: "چرا اکیپما", pricing: "قیمت‌گذاری", download: "دریافت اپ" },
    hero: { eyebrow: "با رفیقات، زندگی بیشتر می‌چسبه", title: ["کمتر حساب‌وکتاب.", "بیشتر زندگی."], description: "کی پول خرید رو داد؟ نوبت ظرف شستن کیه؟ آخر هفته کجا بریم؟ هزینه‌ها، نوبت‌ها و برنامه‌های اکیپتون، همه یه‌جا.", primary: "دریافت اکیپما", secondary: "ببین چطور کار می‌کنه", note: "برای اکیپ رفیقات، هم‌خونه‌هات و بچه‌های خوابگاه.", caption: "کل اکیپ، هماهنگ با هم.", stickerTitle: "رفاقت سر جاش، حساب‌وکتاب هم روشن.", stickerCopy: "دیگه نپرس «کی به کی بدهکاره؟»" },
    tri: ["خرج‌ها رو تقسیم کن.", "کارها رو نوبتی کن.", "دورهمی رو جور کن."],
    features: { label: "۰۱ / زندگی روزمره، ساده‌تر", title: ["خرج‌ها، نوبت‌ها، قرارها.", "خیالت از همه‌شون راحت."], copy: "از خرید خونه تا سفر آخر هفته؛ کمتر درگیر هماهنگی بشید، بیشتر کنار هم خوش بگذرونید." },
    together: { label: "۰۲ / برای اکیپ خودتون", title: ["رفیقات.", "هم‌خونه‌هات.", "اکیپ خودت."], copy: "چه هم‌اتاقی باشید، چه هم‌خونه، چه اون اکیپی که همیشه می‌گه «یه برنامه بریزیم»؛ یه گروه بسازید و کارهای مشترکتون رو راحت‌تر پیش ببرید.", cta: "اکیپت رو جمع کن", aria: "نمونه گروه خونه ما با چهار هم‌خانه برای خرید، کارهای خانه و شب فیلم", sceneLabel: "یه جا برای کل اکیپ", group: "خونه ما", groupCopy: "۴ تا رفیق، یه خونه.", groceries: "حساب خریدها مشخص شد", movie: "جمعه شب، فیلم ببینیم!" },
    pricing: { label: "۰۳ / اشتراک مناسب اکیپتون", title: ["رایگان شروع کن.", "هر وقت خواستی، بیشتر داشته باش."], copy: "برای کارهای روزمره، نسخه رایگان همراهته. امکانات بیشتری می‌خوای؟ پریمیوم رو ببین. برای استفاده سازمانی هم باهامون در تماس باش.", extra: "کمی بیشتر", details: "پریمیوم چی بیشتر داره؟", detailsCopy: "با پریمیوم می‌تونی نمودار خرج‌ها رو ببینی و بهتر بفهمی پولتون کجا رفته. برای جمع‌های بزرگ‌تر هم امکانات بیشتری در نظر داریم. قیمت ماهانه و جزئیات نهایی رو وقتی آماده شد، همین‌جا می‌گیم." },
    plans: [
      { name: "رایگان", caption: "برای تو و اکیپت.", price: "رایگان", period: "برای شروع، همین کافیه.", features: ["هزینه‌های مشترک و تسویه", "نوبت‌بندی کارهای مشترک", "برنامه با دوستان", "گروه برای اکیپ و هم‌خونه‌ها"], cta: "دریافت اکیپما" },
      { name: "پریمیوم", caption: "ببین پولتون کجا می‌ره.", price: "ماهانه", period: "قیمت به‌زودی اعلام می‌شود", features: ["همه امکانات رایگان", "تحلیل و نمودار هزینه", "نگاه دقیق‌تر به هزینه‌ها", "امکانات بیشتر برای اکیپ‌های بزرگ‌تر"], cta: "دیدن پریمیوم" },
      { name: "سازمانی", caption: "برای تیم‌ها و مجموعه‌های بزرگ‌تر.", price: "با هم صحبت کنیم", period: "پلنی متناسب با تیم شما.", features: ["از سازمانتان بگویید", "امکانات موردنیازتان را بررسی کنید", "پلن مناسب را با هم پیدا کنیم"], cta: "تماس با ما" },
    ],
    faq: { label: "شاید سؤال تو هم باشه", title: "سؤالی داری؟", items: [["اکیپما فقط برای هم‌خونه‌هاست؟", "نه! هر جا یه اکیپ هست، اکیپما هم به کار میاد؛ از هم‌خونه‌ها و بچه‌های خوابگاه گرفته تا رفیق‌های سفر و دورهمی‌های آخر هفته."], ["خرج‌ها چطوری تقسیم می‌شن؟", "مبلغی که دادی رو وارد کن و بگو کیا توی این خرج شریک بودن. اکیپما مبلغ رو مساوی تقسیم می‌کنه تا سهم هر نفر مشخص باشه. بعد هم می‌تونید تسویه‌ها رو ثبت و تأیید کنید."], ["چه کارهایی رو می‌شه نوبتی کرد؟", "از ظرف شستن و تمیزکاری تا خرید خونه. آدم‌ها، ترتیب و فاصله نوبت‌ها رو مشخص کن. هر کس کارش رو انجام داد، نوبت می‌رسه به نفر بعد."], ["چطوری یه قرار بذاریم؟", "یه اسم براش بذار، دوستات رو انتخاب کن و زمان و مکانش رو بنویس. از درس خوندن با هم تا دورهمی آخر هفته، جزئیات قرار دیگه لابه‌لای پیام‌ها گم نمی‌شه."]] },
    download: { eyebrow: "برای تو و رفیق‌های هر روزت", title: ["کمتر هماهنگ کن،", "بیشتر خوش بگذرون."], copy: "خرج‌ها، نوبت‌ها و قرارهای اکیپت، همه یه‌جا.", apk: "اندروید داری؟ مستقیم دانلود کن", footnote: "یه اپ کوچیک، یه اکیپ هماهنگ‌تر." },
    contact: { title: "برای تیمتون اکیپما می‌خواید؟", copy: "از نیازهای تیمتون بگید تا با هم ببینیم اکیپما چطور می‌تونه کمکتون کنه.", cta: "تماس با ما", pending: "پاسخ‌گویی به درخواست‌های سازمانی به‌زودی آغاز می‌شود." },
    footer: "دردسر کمتر، رفاقت بیشتر.", store: { download: "دریافت از", soon: "به‌زودی در" },
  },
} as const;
