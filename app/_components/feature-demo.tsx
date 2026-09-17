"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Icon, type IconName } from "./icon";
import { messages, type Locale } from "../i18n";

const features: {
  id: string;
  name: string;
  icon: IconName;
  title: string;
  copy: string;
  points: string[];
}[] = [
  {
    id: "pay",
    name: "Share expenses",
    icon: "split",
    title: "Keep the friendship.\nSplit the bill.",
    copy: "Someone gets the groceries. Someone grabs dinner. Keep track of every shared expense, so remembering who paid isn’t a group project.",
    points: ["Split equally with your people", "Know who owes what", "Record and confirm repayments"],
  },
  {
    id: "turn",
    name: "Take turns",
    icon: "turn",
    title: "A fair turn.\nA happier home.",
    copy: "The dishes don’t do themselves. Give recurring responsibilities a clear order, so everyone knows when it’s their turn to pitch in.",
    points: ["Choose who’s in the rotation", "Set a period for each turn", "Mark it done. Pass it on."],
  },
  {
    id: "plan",
    name: "Make plans",
    icon: "calendar",
    title: "Less “what’s the plan?”\nMore being there.",
    copy: "Movie night, study session, weekend escape. Keep the who, when, and where together, so a good idea becomes an actual plan.",
    points: ["Pick your people", "Add a time and a place", "Bring the details into your calendar"],
  },
];

export function FeatureDemo({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  const demo =
    locale === "fa"
      ? {
          caption: "یه روز معمولی توی اکیپ ما",
          home: "خونه ما",
          life: "کنار هم‌خونه‌ها",
          friends: "۴ دوست",
          grocery: "خرید روزانه",
          paid: "تو حساب کردی · سهم ۴ نفر",
          paidLabel: "پرداخت شد",
          share: "سهم",
          fair: "سهم هر کس مشخصه، خیال همه راحت.",
          kitchen: "تمیز کردن آشپزخونه",
          every: "هر ۲۴ ساعت",
          next: "نفر بعد",
          turn: "نوبت سارا",
          turnCopy: "نیما کارش رو انجام داد. حالا نوبت ساراست.",
          effort: "خونه تمیز، با همکاری همه.",
          reset: "از اول امتحان کن",
          try: "امتحان کن: انجامش دادم!",
          complete: "انجام شد! حالا نوبت ساراست.",
          friday: "برنامه‌های جمعه",
          movie: "یه فیلم ببینیم؟",
          place: "۷:۳۰ شب · خانه ما",
          snacks: "خوراکی یادت نره!",
          choose: "فیلم رو هم با هم انتخاب می‌کنیم.",
          invited: "کل اکیپ دعوتن",
          actual: "این بار دیگه قرارمون قطعیه!",
          note: "این فقط یه نمونه‌ست؛ اکیپ خودت رو بساز.",
          turnNote: "اینجا امتحانش کن، بعد نوبت خونه خودتونه!",
        }
      : {
          caption: "A LITTLE LOOK AT EVERYDAY LIFE",
          home: "Apartment 4",
          life: "Life with your people",
          friends: "4 friends",
          grocery: "THE GROCERY RUN",
          paid: "Paid by you · Shared by 4",
          paidLabel: "Paid",
          share: "Share",
          fair: "Fair shares. Clear heads.",
          kitchen: "Kitchen clean-up",
          every: "Every 24h",
          next: "UP NEXT",
          turn: "Sam’s turn",
          turnCopy: "Jules did their bit. Over to Sam.",
          effort: "A clean kitchen is a team effort.",
          reset: "Reset example",
          try: "Try it: mark turn done",
          complete: "Turn completed. Sam is up next!",
          friday: "FRIDAY PLANS",
          movie: "One more movie?",
          place: "7:30 PM · Our living room",
          snacks: "Bring your favorite snacks.",
          choose: "We’ll figure out the movie together.",
          invited: "The whole crew’s invited",
          actual: "A good idea. An actual plan.",
          note: "Illustrative example. Your group, your everyday.",
          turnNote: "Give the example a try. Your real chores can wait.",
        };
  const localizedFeatures = features.map((feature, index) =>
    locale === "en"
      ? feature
      : {
          ...feature,
          name: copy.tri[index],
          title: [
            ["رفاقت رو نگه دار،", "خرج‌ها رو تقسیم کن."],
            ["هر کس به نوبت.", "همه با خیال راحت."],
            ["کمترِ «پس چی شد؟»", "بیشتر دور هم بودن."],
          ][index].join("\n"),
          copy: [
            ["یه بار تو خرید می‌کنی، یه بار دوستت شام رو حساب می‌کنه. خرج‌ها رو ثبت کن تا سهم هر کس مشخص باشه و حساب‌وکتاب بین رفاقتتون نیاد."],
            ["ظرف‌ها که خودشون شسته نمی‌شن! کارها رو نوبتی کن تا همه بدونن کی باید دست‌به‌کار بشن."],
            ["فیلم، درس یا سفر آخر هفته؛ مشخص کنید کیا میان، کی و کجا. این بار «یه روز بریم» رو به یه قرار واقعی تبدیل کنید."],
          ][index][0],
          points: [
            ["تقسیم مساوی با دوستان", "ببین کی چقدر بدهکاره", "تسویه‌ها رو ثبت و تأیید کن"],
            ["مشخص کن کیا توی نوبت هستن", "فاصله نوبت‌ها رو مشخص کن", "انجام شد؟ نوبت نفر بعد!"],
            ["دوستات رو انتخاب کن", "زمان و مکان رو مشخص کن", "قرار رو به تقویمت اضافه کن"],
          ][index],
        }
  );
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={cn(`feature-demo overflow-hidden rounded-[10px] border border-line bg-[#0c0c0f] tone-${localizedFeatures[active].id}`)}>
      <div className="feature-tabs grid grid-cols-3 border-b border-b-line" role="tablist" aria-label={locale === "fa" ? "ویژگی‌های اکیپما را ببینید" : "Explore Ekipma features"}>
        {localizedFeatures.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            role="tab"
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null;
              if (next !== null) {
                event.preventDefault();
                setActive(next);
                tabs.current[next]?.focus();
              }
            }}
          >
            <span className="tab-number mr-[5px] text-[9px] leading-[normal] font-normal text-[#92929c] max-tablet:hidden">0{index + 1}</span>
            <Icon name={item.icon} />
            <span>{item.name}</span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      {localizedFeatures.map((item, index) => (
        <div key={item.id} role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`} hidden={active !== index} tabIndex={0} className="feature-panel grid min-h-115 grid-cols-[1fr_1fr] max-mobile:grid-cols-[1fr]">
          <div className="feature-copy px-12.5 py-[49px] max-tablet:p-[35px] max-mobile:px-[27px] max-mobile:py-7.5 max-small:px-[21px] max-small:py-7">
            <span className="feature-symbol mb-6 grid h-9 w-9 place-items-center rounded-[9px] border border-[#ffffff15] text-[#adadb7] max-mobile:mb-5">
              <Icon name={item.icon} />
            </span>
            <h3>
              {item.title.split("\n").map((line, i) => (
                <span key={line}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h3>
            <p>{item.copy}</p>
            <ul>
              {item.points.map((point) => (
                <li key={point}>
                  <Icon name="check" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="demo-stage relative isolate flex flex-col items-center justify-center border-l border-l-[#ffffff07] pt-[35px] pr-10 pb-6 pl-10 max-tablet:px-[25px] max-tablet:py-7.5 max-mobile:border-t max-mobile:border-l-0 max-mobile:border-t-[#ffffff09] max-mobile:px-6 max-mobile:py-[27px]">
            <span className="demo-caption mb-[17px] flex w-full max-w-[345px] justify-between text-[7px] leading-[normal] font-normal tracking-[1.2px] text-[#888892] max-mobile:text-[6px]">
              {demo.caption} <span>{locale === "fa" ? "نمونه" : "DEMO"}</span>
            </span>
            <div className="demo-window w-full max-w-[345px] overflow-hidden rounded-[12px] border border-[#35353d] bg-[#121215]">
              <div className="demo-window-header flex items-center gap-2.5 border-b border-b-[#ffffff0b] px-4.5 py-[15px]">
                <span className="mini-home grid h-7.5 w-7.5 place-items-center rounded-[8px] bg-[#25252b]">
                  <Icon name="home" />
                </span>
                <div>
                  <strong>{demo.home}</strong>
                  <span>{demo.life}</span>
                </div>
                <span className="ml-auto text-[8px] text-[#9a9aa4]">{demo.friends}</span>
              </div>
              {item.id === "pay" ? (
                <div className="expense-demo">
                  <div className="expense-total pt-4.5 pr-0 pb-4 pl-0 text-center">
                    <span>{demo.grocery}</span>
                    <strong>
                      $64<span>.00</span>
                    </strong>
                    <p>{demo.paid}</p>
                  </div>
                  <div className="demo-divider mx-5 my-0" />
                  <div className="expense-people px-5 py-3">
                    {(locale === "fa" ? ["تو", "نیما", "سارا", "علی"] : ["You", "Jules", "Sam", "Alex"]).map((name, i) => (
                      <div key={name}>
                        <span className={cn(`mini-avatar h-[23px] w-[23px] shrink-0 place-items-center rounded-full bg-[#34343c] text-[8px] text-[#d5d5dd] person-${i}`)}>{name[0]}</span>
                        <span>{name}</span>
                        <strong>$16.00</strong>
                        {i === 0 ? <span className="w-[31px] text-right text-[7px] text-feature-accent">{demo.paidLabel}</span> : <span className="w-[31px] text-right text-[7px] text-[#9696a2]">{demo.share}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="demo-bottom flex items-center justify-center gap-[7px] border-t border-t-[#ffffff08] bg-[#ffffff03] p-3 text-[8px] text-[#aaaab4]">
                    <Icon name="check" /> {demo.fair}
                  </div>
                </div>
              ) : item.id === "turn" ? (
                <div className="turn-demo">
                  <div className="demo-subtitle flex items-center gap-[7px] p-4.5 text-[9px]">
                    <Icon name="turn" />
                    <span>{demo.kitchen}</span>
                    <span>{demo.every}</span>
                  </div>
                  <div className="current-turn flex flex-col items-center pt-[5px] pr-3 pb-5 pl-3">
                    <span className="turn-avatar mb-3 grid h-[49px] w-[49px] place-items-center rounded-full border border-[color-mix(in_srgb,_var(--accent)_30%,_transparent)] text-[21px] text-feature-accent">{locale === "fa" ? (completed ? "س" : "ن") : completed ? "S" : "J"}</span>
                    <span>{demo.next}</span>
                    <strong>{completed ? demo.turn : locale === "fa" ? "نوبت نیما" : "Jules’s turn"}</strong>
                    <p>{completed ? demo.turnCopy : demo.effort}</p>
                  </div>
                  <button className="demo-action mx-5 my-0 flex w-[calc(100%_-_40px)] items-center justify-center gap-2 rounded-[5px] border border-[color-mix(in_srgb,_var(--accent)_35%,_transparent)] p-2.5 text-[10px] text-[#e3e3e7]" onClick={() => setCompleted(!completed)}>
                    <Icon name={completed ? "turn" : "check"} />
                    {completed ? demo.reset : demo.try}
                  </button>
                  <p className="px-2.5 py-[17px] text-center text-[8px] text-[#b5b5be]" role="status">
                    {completed ? demo.complete : locale === "fa" ? "نیما ← سارا ← علی ← تو" : "Jules → Sam → Alex → You"}
                  </p>
                </div>
              ) : (
                <div className="plan-demo">
                  <div className="calendar-top flex items-center justify-between px-5 py-[21px] text-[8px] leading-[normal] font-normal tracking-[1px] text-[#a8a8b4]">
                    <span>{demo.friday}</span>
                    <Icon name="calendar" />
                  </div>
                  <div className="plan-event mx-5 my-0 flex items-center gap-[13px]">
                    <span className="date-square flex flex-col items-center rounded-[7px] border border-[#ffffff1a] px-3.5 py-[7px] text-[22px]">
                      <small>{locale === "fa" ? "جمعه" : "FRI"}</small>
                      {locale === "fa" ? "۱۸" : "18"}
                    </span>
                    <div>
                      <h4>{demo.movie}</h4>
                      <p>{demo.place}</p>
                    </div>
                  </div>
                  <div className="m-5 rounded-[6px] border border-[#ffffff08] bg-[#ffffff04] p-3.5 text-[10px] leading-[1.8] text-[#b1b1bc]">
                    {demo.snacks}
                    <br />
                    {demo.choose}
                  </div>
                  <div className="mt-0 mr-5 mb-[19px] ml-5 flex items-center gap-[9px] text-[8px] text-[#adadb7]">
                    <span className="stacked-avatars flex pl-1">
                      {(locale === "fa" ? ["ن", "س", "ع", "ت"] : ["J", "S", "A", "Y"]).map((letter, i) => (
                        <i key={letter} className={cn(`mini-avatar h-[23px] w-[23px] shrink-0 place-items-center rounded-full bg-[#34343c] text-[8px] text-[#d5d5dd] person-${i}`)}>
                          {letter}
                        </i>
                      ))}
                    </span>
                    <span>{demo.invited}</span>
                  </div>
                  <div className="demo-bottom flex items-center justify-center gap-[7px] border-t border-t-[#ffffff08] bg-[#ffffff03] p-3 text-[8px] text-[#aaaab4]">
                    <Icon name="calendar" /> {demo.actual}
                  </div>
                </div>
              )}
            </div>
            <span className="demo-stage-note mt-4.5 text-center text-[8px] text-[#85858e]">{item.id === "turn" ? demo.turnNote : demo.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
