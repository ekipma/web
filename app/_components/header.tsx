"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { SiteFrame, SiteLink } from "./site-primitives";
import { messages, type Locale } from "../i18n";

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const copy = messages[locale];
  const alternateLocale = locale === "fa" ? "en" : "fa";
  const links = [
    [copy.nav.features, "#features"],
    [copy.nav.why, "#together"],
    [copy.nav.pricing, "#pricing"],
  ];

  return (
    <header className="header sticky top-0 z-30 h-21 border-b border-line bg-[#09090beb] backdrop-blur-[18px] max-mobile:h-17.5">
      <SiteFrame className="grid h-full grid-cols-[1fr_auto_1fr] items-center max-mobile:grid-cols-[1fr_auto]">
        <a className="inline-flex items-center gap-1.5 justify-self-start text-[25px] font-[750] tracking-[-1px] max-mobile:text-[23px]" href="#" onClick={() => setOpen(false)} aria-label="Ekipma home">
          <Image src="/images/app-logo.svg" width={36} height={36} alt="" preload />
          <span>
            {locale === "fa" ? (
              "اکیپما"
            ) : (
              <>
                ekipma<span className="text-lavender">.</span>
              </>
            )}
          </span>
        </a>
        <nav className="col-start-2 flex gap-8.5 text-[13px] text-[#a7a7ae] rtl:flex-row-reverse max-mobile:hidden" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4.5 justify-self-end max-mobile:hidden">
          <a className="text-[11px] text-site-muted transition-colors duration-200 hover:text-foreground" href={`/${alternateLocale}`} aria-label={copy.languageLabel}>
            {copy.language}
          </a>
          <SiteLink size="header" href="#download">
            {copy.nav.download} <Icon name="arrow" />
          </SiteLink>
        </div>
        <button ref={menuToggle} className="hidden size-9 place-items-center justify-self-end rounded-md border border-line bg-[#141416] max-mobile:grid" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </SiteFrame>
      <nav
        id="mobile-nav"
        className={cn("absolute inset-x-0 top-[69px] hidden border-b border-[#36363e] bg-[#0e0e11] px-5 pt-2.5 pb-5", open && "max-mobile:block")}
        aria-label="Mobile navigation"
        hidden={!open}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            menuToggle.current?.focus();
          }
        }}
      >
        {[...links, [copy.nav.download, "#download"], [copy.language, `/${alternateLocale}`]].map(([label, href]) => (
          <a className="flex items-center justify-between px-2 py-3.5 text-[14px]" href={href} key={href} onClick={() => setOpen(false)}>
            {label}
            <Icon name="arrow" />
          </a>
        ))}
      </nav>
    </header>
  );
}
