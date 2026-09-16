import Image from "next/image";
import type { Metadata } from "next";
import phones from "@/assets/images/phones.png";
import { Icon } from "./_components/icon";
import { Header } from "./_components/header";
import { FeatureDemo } from "./_components/feature-demo";
import { site } from "./site-config";
import { isLocale, messages, type Locale } from "./i18n";

type EnamadImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  code?: string;
};

function EnamadImage(props: EnamadImageProps) {
  return <img {...props} />;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ locale?: string }> }): Promise<Metadata> {
  const { locale: requestedLocale } = await searchParams;
  const locale = isLocale(requestedLocale) ? requestedLocale : "en";
  const copy = messages[locale];
  const title = locale === "fa" ? "اکیپما — رفاقت رو نگه دار، تقسیم کنید، نوبت‌ها را بچرخانید، برنامه بسازید" : "Ekipma — Share expenses. Take turns. Make plans.";
  return { title, description: copy.hero.description, alternates: { canonical: `/${locale}`, languages: { en: "/en", fa: "/fa", "x-default": "/en" } }, openGraph: { title, description: copy.hero.description, locale: locale === "fa" ? "fa_IR" : "en_US" } };
}

function StoreLinks({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  return (
    <div className="store-links">
      {(["googlePlay", "appStore"] as const).map((store) => {
        const href = site[store];
        const content = (
          <>
            <Icon name={store === "googlePlay" ? "play" : "apple"} />
            <span>
              <small>{href ? copy.store.download : copy.store.soon}</small>
              <strong>{store === "googlePlay" ? "Google Play" : "App Store"}</strong>
            </span>
          </>
        );
        return href ? (
          <a key={store} className="store-button" href={href}>
            {content}
          </a>
        ) : (
          <div key={store} className="store-button unavailable" aria-label={`${store === "googlePlay" ? "Google Play" : "App Store"}: coming soon`}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale: requestedLocale } = await searchParams;
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : "en";
  const copy = messages[locale];
  const plans = copy.plans.map((plan, index) => ({ ...plan, price: index === 1 && site.premiumPrice ? site.premiumPrice : plan.price, href: index === 0 ? "#download" : index === 1 ? "#premium-info" : "#contact" }));
  return (
    <>
      <a className="skip-link" href="#main">
        {copy.skip}
      </a>
      <Header locale={locale} />
      <main id="main">
        <section className="hero frame" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">
              <span className="status-dot" /> {copy.hero.eyebrow}
            </p>
            <h1 id="hero-title">
              {copy.hero.title[0]}
              <br />
              <span>{copy.hero.title[1]}</span>
            </h1>
            <p className="hero-description">{copy.hero.description}</p>
            <div className="hero-actions">
              <a href="#download" className="button primary">
                {copy.hero.primary} <Icon name="download" />
              </a>
              <a href="#features" className="text-link">
                {copy.hero.secondary} <Icon name="arrow" />
              </a>
            </div>
            <p className="hero-note">{copy.hero.note}</p>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <span className="visual-caption">
              <span className="tiny-cross">+</span> {copy.hero.caption}
            </span>
            <Image className="hero-phones" src={phones} alt="Ekipma app screens" sizes="(max-width: 760px) 95vw, (max-width: 1200px) 55vw, 650px" preload />
            <div className="hero-sticker">
              <span className="sticker-icon">
                <Icon name="check" />
              </span>
              <div>
                <strong>{copy.hero.stickerTitle}</strong>
                <span>{copy.hero.stickerCopy}</span>
              </div>
            </div>
            <span className="visual-index" aria-hidden="true">
              01 — 02 — 03
            </span>
          </div>
          <div className="hero-bottom">
            <span>{locale === "fa" ? "کمتر درگیر کارها، بیشتر کنار هم." : "A LITTLE ORDER. A LOT MORE TOGETHER."}</span>
            <a href="#features" aria-label="Explore the three features">
              <Icon name="down" />
            </a>
          </div>
        </section>
        <div className="tri-slogan frame" aria-label={copy.tri.join(" ")}>
          <a href="#features" className="tone-pay">
            <Icon name="split" />
            <span>{copy.tri[0]}</span>
            <span className="slogan-number">01</span>
          </a>
          <a href="#features" className="tone-turn">
            <Icon name="turn" />
            <span>{copy.tri[1]}</span>
            <span className="slogan-number">02</span>
          </a>
          <a href="#features" className="tone-plan">
            <Icon name="calendar" />
            <span>{copy.tri[2]}</span>
            <span className="slogan-number">03</span>
          </a>
        </div>
        <section id="features" className="section frame features-section" aria-labelledby="features-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-label">{copy.features.label}</p>
              <h2 id="features-title">
                {copy.features.title[0]}
                <br />
                <span>{copy.features.title[1]}</span>
              </h2>
            </div>
            <p>{copy.features.copy}</p>
          </div>
          <FeatureDemo locale={locale} />
        </section>
        <section id="together" className="together-section frame section" aria-labelledby="together-title">
          <div className="together-copy">
            <p className="eyebrow section-label">{copy.together.label}</p>
            <h2 id="together-title">
              {copy.together.title[0]}
              <br />
              {copy.together.title[1]}
              <br />
              <span>{copy.together.title[2]}</span>
            </h2>
            <p>{copy.together.copy}</p>
            <a className="text-link" href="#download">
              {copy.together.cta} <Icon name="arrow" />
            </a>
          </div>
          <div className="circle-scene" aria-label={copy.together.aria}>
            <div className="circle-ring ring-outer" />
            <div className="circle-ring ring-inner" />
            <span className="scene-label label-top">{copy.together.sceneLabel}</span>
            <div className="avatar avatar-one">
              {locale === "fa" ? "ن" : "JD"}
              <span>{locale === "fa" ? "نیما" : "Jules"}</span>
            </div>
            <div className="avatar avatar-two">
              {locale === "fa" ? "س" : "SK"}
              <span>{locale === "fa" ? "سارا" : "Sam"}</span>
            </div>
            <div className="avatar avatar-three">
              {locale === "fa" ? "ع" : "AL"}
              <span>{locale === "fa" ? "علی" : "Alex"}</span>
            </div>
            <div className="avatar avatar-four">
              {locale === "fa" ? "ت" : "YO"}
              <span>{locale === "fa" ? "تو" : "You"}</span>
            </div>
            <div className="group-center">
              <Icon name="home" />
              <strong>{copy.together.group}</strong>
              <span>{copy.together.groupCopy}</span>
              <div className="group-dots">
                <i />
                <i />
                <i />
              </div>
            </div>
            <span className="scene-chip chip-one">
              <Icon name="split" /> {copy.together.groceries}
            </span>
            <span className="scene-chip chip-two">
              <Icon name="calendar" /> {copy.together.movie}
            </span>
            <span className="scene-label label-bottom">{locale === "fa" ? "همون اکیپ، دردسر کمتر." : "SAME CREW. LESS COORDINATING."}</span>
          </div>
        </section>
        <section id="pricing" className="section frame pricing-section" aria-labelledby="pricing-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-label">{copy.pricing.label}</p>
              <h2 id="pricing-title">
                {copy.pricing.title[0]}
                <br />
                <span>{copy.pricing.title[1]}</span>
              </h2>
            </div>
            <p>{copy.pricing.copy}</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <article className={`pricing-card ${index === 1 ? "premium-card" : ""}`} key={plan.name}>
                <div className="plan-name">
                  <h3>{plan.name}</h3>
                  {index === 1 && <span className="plan-badge">{copy.pricing.extra}</span>}
                </div>
                <p className="plan-caption">{plan.caption}</p>
                <div className="plan-price">{plan.price}</div>
                <p className="plan-period">{plan.period}</p>
                <a className={`button ${index === 1 ? "primary" : "secondary"}`} href={plan.href}>
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
              {copy.pricing.details}
              <Icon name="plus" />
            </summary>
            <p>{copy.pricing.detailsCopy}</p>
          </details>
        </section>
        <section className="section frame faq-section" aria-labelledby="faq-title">
          <div>
            <p className="eyebrow section-label">{copy.faq.label}</p>
            <h2 id="faq-title">{copy.faq.title}</h2>
          </div>
          <div className="faq-list">
            {copy.faq.items.map(([question, answer]) => (
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
        <section id="download" className="download-section frame" aria-labelledby="download-title">
          <div className="download-glow" aria-hidden="true" />
          <Image src="/images/app-logo.svg" width={64} height={64} alt="" className="download-logo" />
          <p className="eyebrow">{copy.download.eyebrow}</p>
          <h2 id="download-title">
            {copy.download.title[0]}
            <br />
            <span>{copy.download.title[1]}</span>
          </h2>
          <p>{copy.download.copy}</p>
          <StoreLinks locale={locale} />
          {site.androidApk && (
            <a className="apk-link" href={site.androidApk}>
              {copy.download.apk} <Icon name="arrow" />
            </a>
          )}
          <span className="download-footnote">{copy.download.footnote}</span>
        </section>
        <section id="contact" className="contact-section frame">
          <div>
            <h2>{copy.contact.title}</h2>
            <p>{copy.contact.copy}</p>
          </div>
          {site.contactEmail ? (
            <a className="button secondary" href={`mailto:${site.contactEmail}`}>
              {copy.contact.cta} <Icon name="arrow" />
            </a>
          ) : (
            <p className="contact-pending">{copy.contact.pending}</p>
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
        <span className="footer-caption">{copy.footer}</span>
        <span className="footer-enamad">
          <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=7773843&Code=LVroMJCdlxR0crtrWdbbnEDB5Azo5mdD">
            <EnamadImage referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=7773843&Code=LVroMJCdlxR0crtrWdbbnEDB5Azo5mdD" alt="" style={{ cursor: "pointer" }} code="LVroMJCdlxR0crtrWdbbnEDB5Azo5mdD" />
          </a>
        </span>
        <nav aria-label="Footer">
          <a href="#features">{copy.nav.features}</a>
          <a href="#pricing">{copy.nav.pricing}</a>
          <a href="https://github.com/ekipma">
            GitHub <Icon name="external" />
          </a>
        </nav>
        <span className="copyright">© {new Date().getFullYear()} Ekipma</span>
      </footer>
    </>
  );
}
