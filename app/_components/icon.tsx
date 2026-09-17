import type { CSSProperties, ReactNode } from "react";

export type IconName = "arrow" | "down" | "download" | "split" | "turn" | "calendar" | "check" | "home" | "plus" | "external" | "play" | "apple" | "close" | "menu";

export function Icon({ name, style }: { name: IconName; style?: CSSProperties }) {
  const paths: Record<Exclude<IconName, "apple">, ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    down: <path d="M12 4v15m-6-6 6 6 6-6" />,
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" />,
    split: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="4" />
        <path d="M9 8h6M9 12h6M9 16h2m4-1v2" />
      </>
    ),
    turn: <path d="M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 11h18m-13 5 3 2 5-4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3V10Z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    external: <path d="M7 17 17 7M7 7h10v10" />,
    play: <path d="m6 3 15 9L6 21V3Z" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  };
  return (
    <svg className="icon h-5 w-5 shrink-0" style={style} viewBox="0 0 24 24" fill={name === "apple" ? "currentColor" : "none"} stroke={name === "apple" ? "none" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "apple" ? (
        <path d="M16.5 2c.2 1.3-.4 2.6-1.2 3.5-.8 1-2 1.5-3.2 1.4-.2-1.3.5-2.6 1.2-3.4.9-1 2.2-1.5 3.2-1.5Zm3.6 15.5c-.5 1.2-.8 1.7-1.4 2.7-.9 1.2-2.1 2.7-3.6 2.7-1.3 0-1.7-.9-3.5-.9-1.7 0-2.2.9-3.5.9-1.5 0-2.7-1.3-3.6-2.6C2 16.7 1.6 11.9 3.2 9.5c1.2-1.7 3-2.7 4.7-2.7 1.4 0 2.3.9 3.5.9 1.2 0 1.9-.9 3.5-.9 1.4 0 2.8.8 3.9 2-3.4 1.9-2.8 6.8 1.3 8.7Z" />
      ) : (
        paths[name]
      )}
    </svg>
  );
}
