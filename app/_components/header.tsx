"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "./icon";

export function Header() {
  const [open, setOpen] = useState(false);
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
            ekipma<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#together">Why Ekipma</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="header-download button secondary" href="#download">
          Get the app <Icon name="arrow" />
        </a>
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
          ["Features", "features"],
          ["Why Ekipma", "together"],
          ["Pricing", "pricing"],
          ["Get the app", "download"],
        ].map(([label, id]) => (
          <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
            {label}
            <Icon name="arrow" />
          </a>
        ))}
      </nav>
    </header>
  );
}
