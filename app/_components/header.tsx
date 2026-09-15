"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "./icon";
import { messages, type Locale } from "../i18n";

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const copy = messages[locale];
  const alternateLocale = locale === "fa" ? "en" : "fa";
  return (
    <header className="header">
      <div className="header-inner frame">
        <a
          className="brand"
          href="#"
          onClick={() => setOpen(false)}
          aria-label="Ekipma home"
        >
          <Image
            src="/images/app-logo.svg"
            width={36}
            height={36}
            alt=""
            preload
          />
          <span>
            {locale === "fa" ? "اکیپما" : <>ekipma<span className="brand-dot">.</span></>}
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#features">{copy.nav.features}</a>
          <a href="#together">{copy.nav.why}</a>
          <a href="#pricing">{copy.nav.pricing}</a>
        </nav>
        <div className="header-actions">
          <a className="locale-switch" href={`/${alternateLocale}`} aria-label={copy.languageLabel}>
            {copy.language}
          </a>
          <a className="header-download button secondary" href="#download">
            {copy.nav.download} <Icon name="arrow" />
          </a>
        </div>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
          }
        }}
      >
        {[
          [copy.nav.features, "features"],
          [copy.nav.why, "together"],
          [copy.nav.pricing, "pricing"],
          [copy.nav.download, "download"],
        ].map(([label, id]) => (
          <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
            {label}
            <Icon name="arrow" />
          </a>
        ))}
        <a href={`/${alternateLocale}`} onClick={() => setOpen(false)}>
          {copy.language}
          <Icon name="arrow" />
        </a>
      </nav>
    </header>
  );
}
