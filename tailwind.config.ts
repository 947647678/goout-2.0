import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /** 底色 — 大地棕 */
        base: "#7B6B5D",
        primary: "#7B6B5D",
        secondary: "#2C3E50",
        /** 鲜活色 — 赤陶橙，按钮/标签/hover */
        vital: "#E07A5F",
        accent: "#E07A5F",
        /** 呼吸色 — 鼠尾草绿，节奏点缀 */
        breath: "#81B29A",
        "bg-light": "#FAF8F5",
        "bg-dark": "#1A1A1A",
        "text-main": "#2C2C2C",
        "text-muted": "#8C8C8C",
        divider: "#E8E4DF",
        recharge: "#6B8E7B",
        stretch: "#E07A5F",
        taste: "#8B7355",
        nostalgia: "#A08060",
        reset: "#81B29A",
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 12px 36px rgba(123, 107, 93, 0.14)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
