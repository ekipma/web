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
    nav: { features: "ویژگی‌ها", why: "چرا ایکیپما", pricing: "قیمت‌گذاری", download: "دریافت اپ" },
    hero: { eyebrow: "زندگی کنار آدم‌های خودت بهتر است", title: ["کمتر حساب‌وکتاب.", "بیشتر زندگی."], description: "وقتی با هم زندگی می‌کنید، چیزهای کوچک جمع می‌شوند. هزینه‌ها، نوبت‌ها و برنامه‌ها را یک‌جا و ساده نگه دارید.", primary: "دریافت ایکیپما", secondary: "همراه جدیدتان را ببینید", note: "برای دوستان ساخته شده؛ مناسب هم‌خانه‌ها و خوابگاهی‌ها.", caption: "همه گروهت، هماهنگ.", stickerTitle: "دوستان خوب. حساب‌های روشن.", stickerCopy: "کمی کمترِ «کی به کی بدهکار است؟»" },
    tri: ["تقسیم هزینه‌ها.", "نوبتی انجام بدهید.", "برنامه بسازید."],
    features: { label: "۰۱ / زندگی روزمره، ساده‌تر", title: ["سه چیز کوچک.", "یک دغدغه کمتر."], copy: "از خرید روزانه تا سفر آخر هفته. کارهای اداری کمتر برای گروه و جا بیشتر برای لحظه‌های خوب." },
    together: { label: "۰۲ / ساخته‌شده برای جمع شما", title: ["آدم‌هایت.", "جایت.", "سیستم کوچکت."], copy: "اتاق خوابگاه، خانه مشترک یا دوستانی که همیشه می‌گویند «یه کاری بکنیم». یک گروه بسازید و به روزمره‌تان خانه بدهید.", cta: "آدم‌هایت را جمع کن", aria: "نمونه گروه آپارتمان ۴ با چهار هم‌خانه برای خرید، کارهای خانه و شب فیلم", sceneLabel: "جایی کوچک برای همه شما", group: "آپارتمان ۴", groupCopy: "۴ دوست. یک خانه.", groceries: "خریدها، مرتب", movie: "جمعه، شب فیلم است" },
    pricing: { label: "۰۳ / پلنی برای جمع شما", title: ["با هم شروع کنید.", "از آن‌جا رشد کنید."], copy: "نیازهای روزمره رایگان‌اند. با پریمیوم عمیق‌تر شوید یا برای گروهتان با ما صحبت کنید.", extra: "کمی بیشتر", details: "پریمیوم چه چیزهایی دارد؟", detailsCopy: "پریمیوم تحلیل و نمودار هزینه‌ها را اضافه می‌کند تا وضعیت هزینه‌های مشترک‌تان روشن‌تر باشد و جا برای جمع بزرگ‌تری داشته باشید. قیمت ماهانه و فهرست نهایی امکانات به‌زودی همین‌جا اعلام می‌شود." },
    plans: [
      { name: "رایگان", caption: "برای تو و آدم‌های موردعلاقه‌ات.", price: "رایگان", period: "یک شروع خوب، همیشه.", features: ["هزینه‌های مشترک و تسویه", "نوبت‌ها و مسئولیت‌های چرخشی", "برنامه با دوستان", "گروه برای زندگی مشترک"], cta: "دریافت ایکیپما" },
      { name: "پریمیوم", caption: "کمی بینش بیشتر، وضوح خیلی بیشتر.", price: "ماهانه", period: "قیمت به‌زودی اعلام می‌شود", features: ["همه امکانات رایگان", "تحلیل و نمودار هزینه", "نگاه دقیق‌تر به هزینه‌ها", "فضای بیشتر برای جمع شما"], cta: "دیدن پریمیوم" },
      { name: "سازمانی", caption: "برای باهم‌بودنی بزرگ‌تر.", price: "گفت‌وگو کنیم", period: "پلنی متناسب با تیم شما.", features: ["از سازمانتان بگویید", "امکانات موردنیازتان را بررسی کنید", "پلن مناسب را با هم پیدا کنیم"], cta: "تماس با ما" },
    ],
    faq: { label: "چند نکته که خوب است بدانید", title: "سؤال‌های خوب.", items: [["ایکیپما فقط برای هم‌خانه‌هاست؟", "برای همه کسانی ساخته شده که چیزی را با هم شریک‌اند. هم‌خانه‌ها و دوستان خوابگاهی عالی‌اند، اما برای جمع شام، دوستان سفر یا هر گروهی که با هم برنامه می‌چیند هم کاربرد دارد."], ["هزینه‌های مشترک چطور کار می‌کنند؟", "مبلغی را که پرداخت کرده‌اید ثبت کنید، افراد شریک را انتخاب کنید تا ایکیپما سهم هر نفر را محاسبه کند. بدهی‌ها، تسویه‌ها و تأیید پرداخت‌ها را دنبال کنید."], ["چه کارهایی را می‌توانیم نوبتی انجام دهیم؟", "هر کاری که در گروه می‌چرخد: ظرف شستن، تمیز کردن آشپزخانه یا خرید بعدی. ترتیب و بازه را مشخص کنید و با انجام هر نوبت به نفر بعدی بروید."], ["چه چیزی در یک برنامه قرار می‌گیرد؟", "نام، آدم‌ها، زمان و مکان را کنار هم بگذارید. از جلسه درس تا دورهمی آخر هفته، همه جزئیات کنار هم می‌مانند."]] },
    download: { eyebrow: "برای آدم‌هایی که با آن‌ها زندگی می‌کنی", title: ["جا باز کن برای", "چیزهای خوب."], copy: "هزینه‌ها، نوبت‌ها و برنامه‌هایتان؛ بالاخره کنار هم.", apk: "اندروید داری؟ فایل APK را دریافت کن", footnote: "اپ کوچک، هماهنگی بیشتر." },
    contact: { title: "دنبال چیزی بزرگ‌تر هستید؟", copy: "ببینیم ایکیپما چطور می‌تواند برای شرکت یا جامعه شما مناسب باشد.", cta: "تماس با ما", pending: "پاسخ‌گویی به درخواست‌های سازمانی به‌زودی آغاز می‌شود." },
    footer: "کارهای اداری کمتر. ما بیشتر.", store: { download: "دریافت از", soon: "به‌زودی در" },
  },
} as const;
