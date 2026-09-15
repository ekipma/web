"use client";

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
    points: [
      "Split equally with your people",
      "Know who owes what",
      "Record and confirm repayments",
    ],
  },
  {
    id: "turn",
    name: "Take turns",
    icon: "turn",
    title: "A fair turn.\nA happier home.",
    copy: "The dishes don’t do themselves. Give recurring responsibilities a clear order, so everyone knows when it’s their turn to pitch in.",
    points: [
      "Choose who’s in the rotation",
      "Set a period for each turn",
      "Mark it done. Pass it on.",
    ],
  },
  {
    id: "plan",
    name: "Make plans",
    icon: "calendar",
    title: "Less “what’s the plan?”\nMore being there.",
    copy: "Movie night, study session, weekend escape. Keep the who, when, and where together, so a good idea becomes an actual plan.",
    points: [
      "Pick your people",
      "Add a time and a place",
      "Bring the details into your calendar",
    ],
  },
];

export function FeatureDemo({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  const demo = locale === "fa" ? { caption: "نگاهی کوتاه به زندگی روزمره", home: "آپارتمان ۴", life: "زندگی با آدم‌هایت", friends: "۴ دوست", grocery: "خرید روزانه", paid: "پرداخت‌شده توسط تو · تقسیم بین ۴ نفر", paidLabel: "پرداخت شد", share: "سهم", fair: "سهم منصفانه. ذهن آسوده.", kitchen: "تمیزکاری آشپزخانه", every: "هر ۲۴ ساعت", next: "نفر بعد", turn: "نوبت سم", turnCopy: "ژول سهمش را انجام داد. نوبت سم است.", effort: "آشپزخانه تمیز، کار تیمی است.", reset: "بازنشانی نمونه", try: "امتحان کن: نوبت را انجام بده", complete: "نوبت انجام شد. سم نفر بعدی است!", friday: "برنامه‌های جمعه", movie: "یک فیلم دیگر؟", place: "۷:۳۰ شب · خانه ما", snacks: "خوراکی‌های موردعلاقه‌ات را بیاور.", choose: "فیلم را با هم انتخاب می‌کنیم.", invited: "همه گروه دعوت‌اند", actual: "یک ایده خوب. یک برنامه واقعی.", note: "نمونه نمایشی است؛ گروه شما، زندگی شما.", turnNote: "نمونه را امتحان کن. کارهای واقعی منتظر می‌مانند." } : { caption: "A LITTLE LOOK AT EVERYDAY LIFE", home: "Apartment 4", life: "Life with your people", friends: "4 friends", grocery: "THE GROCERY RUN", paid: "Paid by you · Shared by 4", paidLabel: "Paid", share: "Share", fair: "Fair shares. Clear heads.", kitchen: "Kitchen clean-up", every: "Every 24h", next: "UP NEXT", turn: "Sam’s turn", turnCopy: "Jules did their bit. Over to Sam.", effort: "A clean kitchen is a team effort.", reset: "Reset example", try: "Try it: mark turn done", complete: "Turn completed. Sam is up next!", friday: "FRIDAY PLANS", movie: "One more movie?", place: "7:30 PM · Our living room", snacks: "Bring your favorite snacks.", choose: "We’ll figure out the movie together.", invited: "The whole crew’s invited", actual: "A good idea. An actual plan.", note: "Illustrative example. Your group, your everyday.", turnNote: "Give the example a try. Your real chores can wait." };
  const localizedFeatures = features.map((feature, index) => locale === "en" ? feature : ({ ...feature, name: copy.tri[index], title: [["هزینه‌ها را", "منصفانه تقسیم کنید."], ["نوبت عادلانه.", "خانه شادتر."], ["کمترِ «برنامه چیه؟»", "بیشتر کنار هم بودن."]][index].join("\n"), copy: [["خرید را یک نفر انجام می‌دهد و شام را یکی دیگر. هر هزینه مشترک را ثبت کنید تا کسی مجبور نباشد یادش بماند چه کسی پرداخت کرده است."], ["ظرف‌ها خودشان شسته نمی‌شوند. برای مسئولیت‌های تکراری ترتیب روشنی بسازید تا همه بدانند نوبتشان کی است."], ["شب فیلم، جلسه درس یا سفر آخر هفته. آدم‌ها، زمان و مکان را کنار هم نگه دارید تا یک ایده خوب تبدیل به برنامه واقعی شود."]][index][0], points: [["تقسیم مساوی با دوستان", "بدانید چه کسی چه‌قدر بدهکار است", "تسویه‌ها را ثبت و تأیید کنید"], ["آدم‌های چرخه را انتخاب کنید", "برای هر نوبت زمان تعیین کنید", "انجامش دهید و به نفر بعدی بدهید"], ["آدم‌هایت را انتخاب کن", "زمان و مکان اضافه کن", "جزئیات را به تقویمت ببر"]][index] }));
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={`feature-demo tone-${localizedFeatures[active].id}`}>
      <div
        className="feature-tabs"
        role="tablist"
        aria-label={locale === "fa" ? "ویژگی‌های ایکیپما را ببینید" : "Explore Ekipma features"}
      >
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
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (index + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : null;
              if (next !== null) {
                event.preventDefault();
                setActive(next);
                tabs.current[next]?.focus();
              }
            }}
          >
            <span className="tab-number">0{index + 1}</span>
            <Icon name={item.icon} />
            <span>{item.name}</span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      {localizedFeatures.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={active !== index}
          tabIndex={0}
          className="feature-panel"
        >
          <div className="feature-copy">
            <span className="feature-symbol">
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
          <div className="demo-stage">
            <span className="demo-caption">
              {demo.caption} <span>DEMO</span>
            </span>
            <div className="demo-window">
              <div className="demo-window-header">
                <span className="mini-home">
                  <Icon name="home" />
                </span>
                <div>
                  <strong>{demo.home}</strong>
                  <span>{demo.life}</span>
                </div>
                <span className="mini-members">{demo.friends}</span>
              </div>
              {item.id === "pay" ? (
                <div className="expense-demo">
                  <div className="expense-total">
                    <span>{demo.grocery}</span>
                    <strong>
                      $64<span>.00</span>
                    </strong>
                    <p>{demo.paid}</p>
                  </div>
                  <div className="demo-divider" />
                  <div className="expense-people">
                    {["You", "Jules", "Sam", "Alex"].map((name, i) => (
                      <div key={name}>
                        <span className={`mini-avatar person-${i}`}>
                          {name[0]}
                        </span>
                        <span>{name}</span>
                        <strong>$16.00</strong>
                        {i === 0 ? (
                          <span className="paid-badge">{demo.paidLabel}</span>
                        ) : (
                          <span className="share-label">{demo.share}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="demo-bottom">
                    <Icon name="check" /> {demo.fair}
                  </div>
                </div>
              ) : item.id === "turn" ? (
                <div className="turn-demo">
                  <div className="demo-subtitle">
                    <Icon name="turn" />
                    <span>{demo.kitchen}</span>
                    <span>{demo.every}</span>
                  </div>
                  <div className="current-turn">
                    <span className="turn-avatar">{completed ? "S" : "J"}</span>
                    <span>{demo.next}</span>
                    <strong>{completed ? demo.turn : locale === "fa" ? "نوبت ژول" : "Jules’s turn"}</strong>
                    <p>
                      {completed
                        ? demo.turnCopy
                        : demo.effort}
                    </p>
                  </div>
                  <button
                    className="demo-action"
                    onClick={() => setCompleted(!completed)}
                  >
                    <Icon name={completed ? "turn" : "check"} />
                    {completed ? demo.reset : demo.try}
                  </button>
                  <p className="demo-feedback" role="status">
                    {completed
                      ? demo.complete
                      : "Jules → Sam → Alex → You"}
                  </p>
                </div>
              ) : (
                <div className="plan-demo">
                  <div className="calendar-top">
                    <span>{demo.friday}</span>
                    <Icon name="calendar" />
                  </div>
                  <div className="plan-event">
                    <span className="date-square">
                      <small>FRI</small>18
                    </span>
                    <div>
                      <h4>{demo.movie}</h4>
                      <p>{demo.place}</p>
                    </div>
                  </div>
                  <div className="plan-note">
                    {demo.snacks}
                    <br />
                    {demo.choose}
                  </div>
                  <div className="plan-attendees">
                    <span className="stacked-avatars">
                      {["J", "S", "A", "Y"].map((letter, i) => (
                        <i key={letter} className={`mini-avatar person-${i}`}>
                          {letter}
                        </i>
                      ))}
                    </span>
                    <span>{demo.invited}</span>
                  </div>
                  <div className="demo-bottom">
                    <Icon name="calendar" /> {demo.actual}
                  </div>
                </div>
              )}
            </div>
            <span className="demo-stage-note">
              {item.id === "turn"
                ? demo.turnNote
                : demo.note}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
