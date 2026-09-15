import Image from "next/image";
import phones from "@/assets/images/phones.png";
import { Icon } from "./_components/icon";
import { Header } from "./_components/header";
import { FeatureDemo } from "./_components/feature-demo";
import { site } from "./site-config";

function StoreLinks() {
  return (
    <div className="store-links">
      {(["googlePlay", "appStore"] as const).map((store) => {
        const href = site[store];
        const content = (
          <>
            <Icon name={store === "googlePlay" ? "play" : "apple"} />
            <span>
              <small>{href ? "Download on" : "Coming soon to"}</small>
              <strong>
                {store === "googlePlay" ? "Google Play" : "App Store"}
              </strong>
            </span>
          </>
        );
        return href ? (
          <a key={store} className="store-button" href={href}>
            {content}
          </a>
        ) : (
          <div
            key={store}
            className="store-button unavailable"
            aria-label={`${store === "googlePlay" ? "Google Play" : "App Store"}: coming soon`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

const plans = [
  {
    name: "Free",
    caption: "For you and your favorite people.",
    price: "Free",
    period: "Always a good place to start.",
    features: [
      "Shared expenses & repayments",
      "Rotating turns & responsibilities",
      "Plans with your friends",
      "Groups for your shared life",
    ],
    cta: "Get Ekipma",
    href: "#download",
  },
  {
    name: "Premium",
    caption: "A little more insight. A lot more clarity.",
    price: site.premiumPrice || "Monthly",
    period: site.premiumPrice ? "per month" : "Pricing to be announced",
    features: [
      "Everything in Free",
      "Spending analytics & charts",
      "A closer look at your expenses",
      "More room for your circle",
    ],
    cta: "Explore Premium",
    href: "#premium-info",
  },
  {
    name: "Company",
    caption: "For a bigger kind of together.",
    price: "Let’s talk",
    period: "A plan shaped around your team.",
    features: [
      "Tell us about your organization",
      "Discuss the features you need",
      "Find the right plan together",
    ],
    cta: "Contact us",
    href: "#contact",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero frame" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">
              <span className="status-dot" /> LIFE’S BETTER WITH YOUR PEOPLE
            </p>
            <h1 id="hero-title">
              Less sorting.
              <br />
              <span>More living.</span>
            </h1>
            <p className="hero-description">
              The little things add up when you live together.
              <br className="desktop-break" /> Keep expenses, turns, and plans
              in one happy place.
            </p>
            <div className="hero-actions">
              <a href="#download" className="button primary">
                Get Ekipma <Icon name="download" />
              </a>
              <a href="#features" className="text-link">
                Meet your new plus-one <Icon name="arrow" />
              </a>
            </div>
            <p className="hero-note">
              Made for friends. Right at home with roommates.
            </p>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <span className="visual-caption">
              <span className="tiny-cross">+</span> YOUR WHOLE CREW. IN SYNC.
            </span>
            <Image
              className="hero-phones"
              src={phones}
              alt="Ekipma’s three app screens showing shared expenses, rotating chores, and upcoming plans in the Persian interface"
              sizes="(max-width: 760px) 95vw, (max-width: 1200px) 55vw, 650px"
              preload
            />
            <div className="hero-sticker">
              <span className="sticker-icon">
                <Icon name="check" />
              </span>
              <div>
                <strong>Good friends. Clear tabs.</strong>
                <span>A little less “who owes who?”</span>
              </div>
            </div>
            <span className="visual-index" aria-hidden="true">
              01 — 02 — 03
            </span>
          </div>
          <div className="hero-bottom">
            <span>A LITTLE ORDER. A LOT MORE TOGETHER.</span>
            <a href="#features" aria-label="Explore the three features">
              <Icon name="down" />
            </a>
          </div>
        </section>
        <div
          className="tri-slogan frame"
          aria-label="Share expenses. Take turns. Make plans."
        >
          <a href="#features" className="tone-pay">
            <Icon name="split" />
            <span>Share expenses.</span>
            <span className="slogan-number">01</span>
          </a>
          <a href="#features" className="tone-turn">
            <Icon name="turn" />
            <span>Take turns.</span>
            <span className="slogan-number">02</span>
          </a>
          <a href="#features" className="tone-plan">
            <Icon name="calendar" />
            <span>Make plans.</span>
            <span className="slogan-number">03</span>
          </a>
        </div>
        <section
          id="features"
          className="section frame features-section"
          aria-labelledby="features-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow section-label">
                01 / THE EVERYDAY, SIMPLIFIED
              </p>
              <h2 id="features-title">
                Three little things.
                <br />
                <span>One less thing on your mind.</span>
              </h2>
            </div>
            <p>
              From the grocery run to the weekend away.
              <br />
              Less admin for the group. More room for the good stuff.
            </p>
          </div>
          <FeatureDemo />
        </section>
        <section
          id="together"
          className="together-section frame section"
          aria-labelledby="together-title"
        >
          <div className="together-copy">
            <p className="eyebrow section-label">
              02 / BUILT AROUND YOUR CIRCLE
            </p>
            <h2 id="together-title">
              Your people.
              <br />
              Your place.
              <br />
              <span>Your little system.</span>
            </h2>
            <p>
              A dorm room, a shared apartment, or the friends who always say “we
              should do something.” Make a group and give your everyday life a
              home.
            </p>
            <a className="text-link" href="#download">
              Bring your people <Icon name="arrow" />
            </a>
          </div>
          <div
            className="circle-scene"
            aria-label="Example group: Apartment 4, with four roommates sharing groceries, chores, and a movie night"
          >
            <div className="circle-ring ring-outer" />
            <div className="circle-ring ring-inner" />
            <span className="scene-label label-top">
              A LITTLE SPACE FOR ALL OF YOU
            </span>
            <div className="avatar avatar-one">
              JD<span>Jules</span>
            </div>
            <div className="avatar avatar-two">
              SK<span>Sam</span>
            </div>
            <div className="avatar avatar-three">
              AL<span>Alex</span>
            </div>
            <div className="avatar avatar-four">
              YO<span>You</span>
            </div>
            <div className="group-center">
              <Icon name="home" />
              <strong>Apartment 4</strong>
              <span>4 friends. One home.</span>
              <div className="group-dots">
                <i />
                <i />
                <i />
              </div>
            </div>
            <span className="scene-chip chip-one">
              <Icon name="split" /> Groceries, sorted
            </span>
            <span className="scene-chip chip-two">
              <Icon name="calendar" /> Friday is movie night
            </span>
            <span className="scene-label label-bottom">
              SAME CREW. LESS COORDINATING.
            </span>
          </div>
        </section>
        <section
          id="pricing"
          className="section frame pricing-section"
          aria-labelledby="pricing-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow section-label">
                03 / A PLAN FOR YOUR PEOPLE
              </p>
              <h2 id="pricing-title">
                Start together.
                <br />
                <span>Grow from there.</span>
              </h2>
            </div>
            <p>
              The everyday essentials are free.
              <br />
              Go deeper with Premium, or talk to us about your team.
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <article
                className={`pricing-card ${index === 1 ? "premium-card" : ""}`}
                key={plan.name}
              >
                <div className="plan-name">
                  <h3>{plan.name}</h3>
                  {index === 1 && (
                    <span className="plan-badge">A little extra</span>
                  )}
                </div>
                <p className="plan-caption">{plan.caption}</p>
                <div className="plan-price">{plan.price}</div>
                <p className="plan-period">{plan.period}</p>
                <a
                  className={`button ${index === 1 ? "primary" : "secondary"}`}
                  href={plan.href}
                >
                  {plan.cta}
                  <Icon name="arrow" />
                </a>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Icon name="check" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <details id="premium-info" className="premium-details">
            <summary>
              What’s included in Premium?
              <Icon name="plus" />
            </summary>
            <p>
              Premium adds spending analytics and charts to help you understand
              your shared expenses, with room for a larger circle of friends.
              Monthly pricing and the final feature list will be shared here
              when the plan is ready.
            </p>
          </details>
        </section>
        <section
          className="section frame faq-section"
          aria-labelledby="faq-title"
        >
          <div>
            <p className="eyebrow section-label">A FEW THINGS TO KNOW</p>
            <h2 id="faq-title">Good questions.</h2>
          </div>
          <div className="faq-list">
            {[
              [
                "Is Ekipma just for roommates?",
                "It’s made for people who share things. Roommates and dorm friends are right at home, but you can also use it with your regular dinner crew, travel buddies, or any group planning life together.",
              ],
              [
                "How do shared expenses work?",
                "Add what you paid, choose the people sharing it, and Ekipma divides the total equally. Keep track of who owes what, record repayments, and confirm when you’ve settled up.",
              ],
              [
                "What can we take turns doing?",
                "Anything your group rotates: washing the dishes, cleaning the kitchen, or making the next grocery run. Set the order and period, then mark a turn done to move to the next person.",
              ],
              [
                "What goes into a plan?",
                "Give it a name, choose your people, and add the date and place. From a study session to a weekend hangout, the details stay together.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Icon name="plus" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section
          id="download"
          className="download-section frame"
          aria-labelledby="download-title"
        >
          <div className="download-glow" aria-hidden="true" />
          <Image
            src="/images/app-logo.svg"
            width={64}
            height={64}
            alt=""
            className="download-logo"
          />
          <p className="eyebrow">FOR THE PEOPLE YOU DO LIFE WITH</p>
          <h2 id="download-title">
            Make room for
            <br />
            <span>the good stuff.</span>
          </h2>
          <p>Your expenses, turns, and plans. Finally, together.</p>
          <StoreLinks />
          {site.androidApk && (
            <a className="apk-link" href={site.androidApk}>
              Already on Android? Download the APK <Icon name="arrow" />
            </a>
          )}
          <span className="download-footnote">
            Small app. A little more harmony.
          </span>
        </section>
        <section id="contact" className="contact-section frame">
          <div>
            <h2>Something bigger in mind?</h2>
            <p>
              Let’s find out how Ekipma could fit your company or community.
            </p>
          </div>
          {site.contactEmail ? (
            <a
              className="button secondary"
              href={`mailto:${site.contactEmail}`}
            >
              Contact us <Icon name="arrow" />
            </a>
          ) : (
            <p className="contact-pending">Company inquiries open soon.</p>
          )}
        </section>
      </main>
      <footer className="footer frame">
        <a className="brand" href="#" aria-label="Ekipma home">
          <Image src="/images/app-logo.svg" width={32} height={32} alt="" />
          <span>
            ekipma<span className="brand-dot">.</span>
          </span>
        </a>
        <span className="footer-caption">
          A little less admin. A lot more us.
        </span>
        <nav aria-label="Footer">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="https://github.com/ekipma">
            GitHub <Icon name="external" />
          </a>
        </nav>
        <span className="copyright">© {new Date().getFullYear()} Ekipma</span>
      </footer>
    </>
  );
}
