import { SiteFrame, SiteLink } from "./_components/site-primitives";
import { cn } from "@/lib/utils";
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
  // The authority-hosted badge must remain a plain image element.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ""} />;
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
    <div className="store-links mt-7.5 flex justify-center gap-3 max-mobile:gap-[9px]">
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
          <a key={store} className="store-button flex min-w-[169px] items-center gap-3 rounded-[8px] border border-[#3d3d45] bg-[#151519] px-5 py-[11px] text-left max-mobile:min-w-0 max-mobile:gap-[9px] max-mobile:px-[13px] max-mobile:py-2.5 max-small:p-2.5" href={href}>
            {content}
          </a>
        ) : (
          <div
            key={store}
            className="store-button unavailable flex min-w-[169px] items-center gap-3 rounded-[8px] border border-[#3d3d45] bg-[#151519] px-5 py-[11px] text-left max-mobile:min-w-0 max-mobile:gap-[9px] max-mobile:px-[13px] max-mobile:py-2.5 max-small:p-2.5"
            aria-label={`${store === "googlePlay" ? "Google Play" : "App Store"}: coming soon`}
          >
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
      <a className="skip-link fixed top-2 left-4 z-100 bg-white p-3 text-black" href="#main">
        {copy.skip}
      </a>
      <Header locale={locale} />
      <main id="main">
        <SiteFrame as="section" className="hero relative grid min-h-[675px] grid-cols-[1fr_1fr] items-center border-r border-l border-r-line border-l-line min-wide:min-h-180 max-tablet:min-h-152.5 max-mobile:min-h-0 max-mobile:grid-cols-[1fr] max-mobile:overflow-hidden" aria-labelledby="hero-title">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
          <div className="hero-content relative z-2 pt-[65px] pr-0 pb-25 pl-10 min-wide:pl-[55px] max-tablet:pl-7 max-mobile:pt-[61px] max-mobile:pr-6 max-mobile:pb-0 max-mobile:pl-6 max-mobile:text-center max-small:px-[15px]">
            <p className="eyebrow text-[10px] leading-[1.8] font-semibold tracking-[1.7px]">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-lavender" /> {copy.hero.eyebrow}
            </p>
            <h1 id="hero-title">
              {copy.hero.title[0]}
              <br />
              <span>{copy.hero.title[1]}</span>
            </h1>
            <p className="mt-[27px] max-w-[415px] text-[15px] leading-[1.9] text-[#b9b5ca] max-tablet:text-[13px] max-mobile:mt-[23px] max-mobile:mr-auto max-mobile:mb-0 max-mobile:ml-auto max-mobile:max-w-[345px] max-mobile:text-[13px]">{copy.hero.description}</p>
            <div className="hero-actions mt-8 flex items-center gap-6 max-tablet:flex-wrap max-tablet:gap-4 max-mobile:mt-6.5 max-mobile:justify-center max-mobile:gap-[19px] max-small:flex-col max-small:gap-4.5">
              <SiteLink href="#download" variant="primary">
                {copy.hero.primary} <Icon name="download" />
              </SiteLink>
              <a href="#features" className="text-link inline-flex items-center gap-3 text-[12px]">
                {copy.hero.secondary} <Icon name="arrow" />
              </a>
            </div>
            <p className="hero-note mt-4.5 text-[10px] text-[#85858d] max-mobile:mt-[19px] max-mobile:text-[9px]">{copy.hero.note}</p>
          </div>
          <div className="hero-visual relative isolate -ml-[35px] flex min-w-0 items-center justify-center self-stretch min-wide:mr-2.5 max-mobile:mt-[25px] max-mobile:mr-0 max-mobile:mb-12.5 max-mobile:ml-0 max-mobile:h-auto max-mobile:px-3 max-mobile:py-0">
            <div className="orbit-one absolute -z-1 h-112.5 w-112.5 rounded-full border border-[#ffffff06] max-tablet:h-82.5 max-tablet:w-82.5 max-mobile:h-auto max-mobile:w-[70%]" aria-hidden="true" />
            <div className="orbit-two absolute -z-1 h-140 w-140 rounded-full border border-[#ffffff06] max-tablet:h-105 max-tablet:w-105 max-mobile:h-auto max-mobile:w-[90%]" aria-hidden="true" />
            <span className="visual-caption absolute top-[51px] left-[25%] flex items-center gap-[15px] text-[8px] tracking-[2px] text-[#808089] max-tablet:left-[15%] max-tablet:text-[7px] max-mobile:hidden">
              <span className="text-[20px] text-[#a1a1ac]">+</span> {copy.hero.caption}
            </span>
            <Image className="hero-phones relative mt-[5px] h-auto w-[112%] max-w-none min-wide:w-[115%] max-tablet:w-[113%] max-mobile:mt-0 max-mobile:w-full max-mobile:max-w-147.5" src={phones} alt="Ekipma app screens" sizes="(max-width: 760px) 95vw, (max-width: 1200px) 55vw, 650px" preload />
            <div className="hero-sticker absolute bottom-[137px] left-[16%] flex items-center gap-3 rounded-[10px] border border-[#45414e] bg-[#151519ed] pt-3.5 pr-5 pb-3.5 pl-3 max-tablet:bottom-[145px] max-tablet:left-[8%] max-mobile:bottom-[13%] max-mobile:left-[17%] max-mobile:pt-2.5 max-mobile:pr-3.5 max-mobile:pb-2.5 max-mobile:pl-2.5">
              <span className="sticker-icon grid h-[29px] w-[29px] place-items-center rounded-full border border-[#a18fff55] text-lavender max-mobile:h-[25px] max-mobile:w-[25px]">
                <Icon name="check" />
              </span>
              <div>
                <strong>{copy.hero.stickerTitle}</strong>
                <span>{copy.hero.stickerCopy}</span>
              </div>
            </div>
            <span className="visual-index absolute right-10 bottom-[83px] text-[8px] tracking-[3px] text-[#7e7e88] max-mobile:right-7.5 max-mobile:bottom-[8%] max-mobile:text-[6px]" aria-hidden="true">
              01 — 02 — 03
            </span>
          </div>
          <div className="hero-bottom absolute right-0 bottom-0 left-0 flex items-center justify-between border-t border-t-[#ffffff0a] px-10 py-5 text-[8px] leading-[normal] font-normal tracking-[1.5px] text-[#888891] max-mobile:px-5 max-mobile:py-4.5 max-mobile:text-[6px]">
            <span>{locale === "fa" ? "کمتر درگیر کارها، بیشتر کنار هم." : "A LITTLE ORDER. A LOT MORE TOGETHER."}</span>
            <a href="#features" aria-label="Explore the three features">
              <Icon name="down" />
            </a>
          </div>
        </SiteFrame>
        <SiteFrame as="div" className="tri-slogan grid grid-cols-3 border border-line" aria-label={copy.tri.join(" ")}>
          <a href="#features" className="tone-pay">
            <Icon name="split" />
            <span>{copy.tri[0]}</span>
            <span className="slogan-number ml-auto text-[9px] leading-[normal] font-normal text-[#92929c] max-mobile:hidden">01</span>
          </a>
          <a href="#features" className="tone-turn">
            <Icon name="turn" />
            <span>{copy.tri[1]}</span>
            <span className="slogan-number ml-auto text-[9px] leading-[normal] font-normal text-[#92929c] max-mobile:hidden">02</span>
          </a>
          <a href="#features" className="tone-plan">
            <Icon name="calendar" />
            <span>{copy.tri[2]}</span>
            <span className="slogan-number ml-auto text-[9px] leading-[normal] font-normal text-[#92929c] max-mobile:hidden">03</span>
          </a>
        </SiteFrame>
        <SiteFrame as="section" id="features" className="features-section border-b border-b-line py-27.5 max-mobile:py-17.5" aria-labelledby="features-title">
          <div className="section-heading mb-10.5 flex items-end justify-between gap-8 max-mobile:mb-7.5 max-mobile:block">
            <div>
              <p className="eyebrow mb-[23px] text-[10px] leading-[1.8] font-semibold tracking-[1.7px] text-site-muted max-mobile:mb-4.5 max-mobile:text-[8px]">{copy.features.label}</p>
              <h2 id="features-title">
                {copy.features.title[0]}
                <br />
                <span>{copy.features.title[1]}</span>
              </h2>
            </div>
            <p>{copy.features.copy}</p>
          </div>
          <FeatureDemo locale={locale} />
        </SiteFrame>
        <SiteFrame as="section" id="together" className="grid grid-cols-[1fr_1fr] items-center gap-[65px] border-b border-b-line py-27.5 max-tablet:gap-5 max-mobile:grid-cols-[1fr] max-mobile:gap-[45px] max-mobile:py-17.5" aria-labelledby="together-title">
          <div className="together-copy px-[35px] py-0 max-tablet:pl-3 max-mobile:p-0">
            <p className="eyebrow mb-[23px] text-[10px] leading-[1.8] font-semibold tracking-[1.7px] text-site-muted max-mobile:mb-4.5 max-mobile:text-[8px]">{copy.together.label}</p>
            <h2 id="together-title">
              {copy.together.title[0]}
              <br />
              {copy.together.title[1]}
              <br />
              <span>{copy.together.title[2]}</span>
            </h2>
            <p>{copy.together.copy}</p>
            <a className="text-link inline-flex items-center gap-3 text-[12px]" href="#download">
              {copy.together.cta} <Icon name="arrow" />
            </a>
          </div>
          <div className="circle-scene relative isolate grid h-100 place-items-center max-mobile:mx-auto max-mobile:h-92.5 max-mobile:w-[min(100%,_440px)] max-small:-my-[15px]" aria-label={copy.together.aria}>
            <div className="ring-outer absolute -z-1 h-92.5 w-92.5 rounded-full border border-[#ffffff0c] max-mobile:h-82.5 max-mobile:w-82.5 max-small:h-75 max-small:w-75" />
            <div className="absolute -z-1 h-67.5 w-67.5 rounded-full border border-[#ffffff0c] max-mobile:h-[245px] max-mobile:w-[245px]" />
            <span className="scene-label absolute -top-3 text-[7px] leading-[normal] font-normal tracking-[1.5px] text-[#777782] max-mobile:top-0">{copy.together.sceneLabel}</span>
            <div className="avatar absolute top-[35px] left-[38%] grid h-[45px] w-[45px] place-items-center rounded-full border-[4px] border-[#09090b] bg-[#544429] text-[12px] text-[#dddde5] max-mobile:top-7">
              {locale === "fa" ? "ن" : "JD"}
              <span>{locale === "fa" ? "نیما" : "Jules"}</span>
            </div>
            <div className="avatar absolute top-[39%] right-[11%] grid h-[45px] w-[45px] place-items-center rounded-full border-[4px] border-[#09090b] bg-[#225b54] text-[12px] text-[#dddde5]">
              {locale === "fa" ? "س" : "SK"}
              <span>{locale === "fa" ? "سارا" : "Sam"}</span>
            </div>
            <div className="avatar absolute bottom-[25px] left-[31%] grid h-[45px] w-[45px] place-items-center rounded-full border-[4px] border-[#09090b] bg-[#56324b] text-[12px] text-[#dddde5] max-mobile:bottom-7">
              {locale === "fa" ? "ع" : "AL"}
              <span>{locale === "fa" ? "علی" : "Alex"}</span>
            </div>
            <div className="avatar absolute top-[34%] left-[7%] grid h-[45px] w-[45px] place-items-center rounded-full border-[4px] border-[#09090b] bg-[#463a71] text-[12px] text-[#dddde5]">
              {locale === "fa" ? "ت" : "YO"}
              <span>{locale === "fa" ? "تو" : "You"}</span>
            </div>
            <div className="group-center flex h-[157px] w-[157px] flex-col items-center justify-center rounded-full border border-[#3d3b44] bg-[#121214]">
              <Icon name="home" />
              <strong>{copy.together.group}</strong>
              <span>{copy.together.groupCopy}</span>
              <div className="group-dots mt-[14px] flex gap-1">
                <i />
                <i />
                <i />
              </div>
            </div>
            <span className="scene-chip chip-one absolute top-[20%] right-[8%] flex items-center gap-2 rounded-[6px] border border-[#333338] bg-[#151518] px-[13px] py-2.5 text-[9px] max-mobile:top-[20%] max-mobile:right-[3%]">
              <Icon name="split" /> {copy.together.groceries}
            </span>
            <span className="scene-chip chip-two absolute bottom-[19%] left-[8%] flex items-center gap-2 rounded-[6px] border border-[#333338] bg-[#151518] px-[13px] py-2.5 text-[9px] max-mobile:left-[3%]">
              <Icon name="calendar" /> {copy.together.movie}
            </span>
            <span className="scene-label absolute -bottom-5 text-[7px] leading-[normal] font-normal tracking-[1.5px] text-[#777782] max-mobile:-bottom-[9px]">{locale === "fa" ? "همون اکیپ، دردسر کمتر." : "SAME CREW. LESS COORDINATING."}</span>
          </div>
        </SiteFrame>
        <SiteFrame as="section" id="pricing" className="pricing-section border-b border-b-line py-27.5 max-mobile:py-17.5" aria-labelledby="pricing-title">
          <div className="section-heading mb-10.5 flex items-end justify-between gap-8 max-mobile:mb-7.5 max-mobile:block">
            <div>
              <p className="eyebrow mb-[23px] text-[10px] leading-[1.8] font-semibold tracking-[1.7px] text-site-muted max-mobile:mb-4.5 max-mobile:text-[8px]">{copy.pricing.label}</p>
              <h2 id="pricing-title">
                {copy.pricing.title[0]}
                <br />
                <span>{copy.pricing.title[1]}</span>
              </h2>
            </div>
            <p>{copy.pricing.copy}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-mobile:grid-cols-[1fr] max-mobile:gap-[17px]">
            {plans.map((plan, index) => (
              <article className={cn(`pricing-card rounded-[9px] border border-line bg-[#0c0c0e] p-7 max-tablet:p-5.5 max-mobile:p-[27px] ${index === 1 ? "premium-card border-[#50485f]" : ""}`)} key={plan.name}>
                <div className="plan-name flex items-center justify-between gap-[5px]">
                  <h3>{plan.name}</h3>
                  {index === 1 && <span className="rounded-[20px] border border-[#a18fff35] bg-[#a18fff08] px-2 py-[3px] text-[8px] text-[#b2a2ef] max-mobile:text-[9px]">{copy.pricing.extra}</span>}
                </div>
                <p className="mt-3 min-h-7.5 text-[12px] text-site-muted max-tablet:min-h-9 max-mobile:min-h-0 max-mobile:text-[12px]">{plan.caption}</p>
                <div className="mt-5 text-[35px] font-medium tracking-[-1.2px] max-mobile:mt-6">{plan.price}</div>
                <p className="mt-[5px] min-h-7.5 text-[12px] text-[#91919c] max-mobile:min-h-0 max-mobile:text-[11px]">{plan.period}</p>
                <SiteLink variant={index === 1 ? "primary" : "secondary"} size="pricing" href={plan.href}>
                  {plan.cta}
                  <Icon name="arrow" />
                </SiteLink>
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
          <details id="premium-info" className="premium-details mt-[23px] border-b border-b-line">
            <summary>
              {copy.pricing.details}
              <Icon name="plus" />
            </summary>
            <p>{copy.pricing.detailsCopy}</p>
          </details>
        </SiteFrame>
        <SiteFrame as="section" className="faq-section grid grid-cols-[1fr_1.2fr] gap-20 border-b border-b-line py-27.5 max-tablet:gap-[45px] max-mobile:grid-cols-[1fr] max-mobile:gap-7 max-mobile:py-17.5" aria-labelledby="faq-title">
          <div>
            <p className="eyebrow mb-[23px] text-[10px] leading-[1.8] font-semibold tracking-[1.7px] text-site-muted max-mobile:mb-4.5 max-mobile:text-[8px]">{copy.faq.label}</p>
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
        </SiteFrame>
        <SiteFrame as="section" id="download" className="download-section relative isolate overflow-hidden border-b border-b-line pt-20.5 pr-6 pb-[67px] pl-6 text-center max-mobile:pt-[65px] max-mobile:pr-2.5 max-mobile:pb-12.5 max-mobile:pl-2.5" aria-labelledby="download-title">
          <div className="download-glow absolute -z-1 opacity-60" aria-hidden="true" />
          <Image src="/images/app-logo.svg" width={64} height={64} alt="" className="download-logo mt-0 mr-auto mb-4.5 ml-auto" />
          <p className="eyebrow text-[10px] leading-[1.8] font-semibold tracking-[1.7px]">{copy.download.eyebrow}</p>
          <h2 id="download-title">
            {copy.download.title[0]}
            <br />
            <span>{copy.download.title[1]}</span>
          </h2>
          <p>{copy.download.copy}</p>
          <StoreLinks locale={locale} />
          {site.androidApk && (
            <a className="apk-link mt-[19px] inline-flex items-center gap-[7px] text-[12px] text-[#aaaab6] max-mobile:text-[9px]" href={site.androidApk}>
              {copy.download.apk} <Icon name="arrow" />
            </a>
          )}
          <span className="download-footnote mt-8 block text-[9px] text-[#81818d]">{copy.download.footnote}</span>
        </SiteFrame>
        <SiteFrame as="section" id="contact" className="contact-section flex items-center justify-between gap-8 border-b border-b-line py-10 max-mobile:flex-col max-mobile:items-start max-mobile:gap-5 max-mobile:py-7.5">
          <div>
            <h2>{copy.contact.title}</h2>
            <p>{copy.contact.copy}</p>
          </div>
          {site.contactEmail ? (
            <SiteLink variant="secondary" href={`mailto:${site.contactEmail}`}>
              {copy.contact.cta} <Icon name="arrow" />
            </SiteLink>
          ) : (
            <p className="contact-pending">{copy.contact.pending}</p>
          )}
        </SiteFrame>
      </main>
      <SiteFrame as="footer" className="footer flex flex-wrap items-center gap-5 pt-7.5 pb-[35px] max-mobile:justify-between max-mobile:gap-5 max-mobile:pb-[25px]">
        <a className="brand inline-flex items-center gap-1.5 justify-self-start text-[25px] font-[750] tracking-[-1px] max-mobile:text-[23px]" href="#" aria-label="Ekipma home">
          <Image src="/images/app-logo.svg" width={32} height={32} alt="" />
          <span>
            ekipma<span className="text-lavender">.</span>
          </span>
        </a>
        <span className="text-[12px] text-[#90909c] max-tablet:hidden">{copy.footer}</span>
        <span className="footer-enamad flex flex-1 items-center justify-center">
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
        <span className="ml-[15px] text-[9px] text-[#82828e] max-mobile:m-0 max-mobile:w-full max-mobile:text-center max-mobile:text-[8px]">© {new Date().getFullYear()} Ekipma</span>
      </SiteFrame>
    </>
  );
}
