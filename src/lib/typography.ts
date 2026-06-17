/** Agency OS typography scale — matches :root tokens in globals.css */
export const fontSizes = {
  badge: "10px",
  "12": "12px",
  "14": "14px",
  "16": "16px",
  "18": "18px",
  "24": "24px",
  "26": "26px",
  "28": "28px",
  "32": "32px",
  "42": "42px",
} as const;

/** @deprecated Use numeric keys above; kept for existing imports */
export const fontSizeAliases = {
  xs: fontSizes["12"],
  sm: fontSizes["12"],
  md: fontSizes["12"],
  baseSm: fontSizes["12"],
  base: fontSizes["14"],
  lg: fontSizes["16"],
  xl: fontSizes["18"],
  "2xl": fontSizes["24"],
  "3xl": fontSizes["26"],
  "4xl": fontSizes["28"],
  "5xl": fontSizes["32"],
  "6xl": fontSizes["42"],
} as const;

export type FontSizeToken = keyof typeof fontSizes;
