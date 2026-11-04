import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const IconBag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5L6 8Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h16m0 0-6-6m6 6-6 6" />
  </svg>
);

export const IconArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m3 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export const IconTruck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M1 8h13v9H1zM14 11h4l3 3v3h-7" />
    <circle cx="6" cy="19" r="1.6" />
    <circle cx="17" cy="19" r="1.6" />
  </svg>
);

export const IconRefresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8l-6.1 3.3 1.4-6.8-5.1-4.7 6.9-.8L12 2.5Z" />
  </svg>
);

export const IconInstagram = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6v4h3v8h4v-8h3l1-4h-4V6.8c0-.5.4-.8.9-.8H15V3Z" />
  </svg>
);

export const IconTwitterX = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4l7.2 9.3L4.4 20h2.5l5.4-5.4L16.8 20H20l-7.5-9.7L19.3 4h-2.5l-4.9 5L8.2 4H4Z" />
  </svg>
);
