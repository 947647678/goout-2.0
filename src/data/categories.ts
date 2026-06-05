import type { CategoryConfig, DirectionConfig } from "@/types";

export const categories: CategoryConfig[] = [
  {
    key: "recharge",
    name: "放空•定力",
    icon: "🧘",
    tagline: "让脑子歇一歇",
    color: "#6B8E7B",
  },
  {
    key: "stretch",
    name: "舒展•鲜活",
    icon: "💃",
    tagline: "找回鲜活的自己",
    color: "#E07A5F",
  },
  {
    key: "taste",
    name: "格局•品味",
    icon: "🎭",
    tagline: "眼界再开一寸",
    color: "#8B7355",
  },
  {
    key: "nostalgia",
    name: "怀旧•治愈",
    icon: "🕰️",
    tagline: "被从前的温度抱一下",
    color: "#A08060",
  },
  {
    key: "reset",
    name: "归零•轻盈",
    icon: "🌿",
    tagline: "清空一下再出发",
    color: "#81B29A",
  },
];

export const directions: DirectionConfig[] = [
  {
    key: "family",
    name: "亲子方向",
    tagline: "和家人一起，攒点值得反复翻的记忆",
  },
  {
    key: "wellness",
    name: "康养方向",
    tagline: "身体和心灵，一起被温柔对待",
  },
  {
    key: "culture",
    name: "深度文化方向",
    tagline: "活在当下，跟真实世界碰一下",
  },
  {
    key: "roadtrip",
    name: "放空自驾路线",
    tagline: "方向盘给自己，烦恼交给风景",
  },
];

export function getCategoryByKey(key: string) {
  return categories.find((c) => c.key === key);
}

export function getDirectionByKey(key: string) {
  return directions.find((d) => d.key === key);
}
