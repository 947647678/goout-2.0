import type { Destination } from "@/types";

const guide = {
  name: "林晚晴",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  bio: "林晚晴，走过三十国，后来发现最好的旅行是让人回来以后还像个人。现在专职设计「回来以后更好」的路。",
};

export const destinations: Destination[] = [
  {
    id: "anlan-family",
    name: "安岚温泉•陪孩子撒个野",
    direction: "family",
    subtitle: "攒点值得反复翻的家庭记忆",
    stateResponse: "如果你希望和家人有一段不被打扰的共处——",
    statePush: "温泉、山野、慢下来，孩子撒野，你也松口气。",
    days: 2,
    nights: 1,
    priceRange: { min: 298000, max: 398000 },
    priceText: "¥2980起",
    coverImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop",
    images: [],
    itinerary: [
      {
        day: 1,
        title: "第一天 · 抵达，先松一口气",
        description:
          "入住安岚，下午亲子温泉。不赶行程，让孩子在自然里撒欢，你也终于不用回消息。",
        accommodation: "安岚度假酒店",
      },
      {
        day: 2,
        title: "第二天 · 山野告别",
        description: "清晨森林漫步，午后返程。带走一段慢下来的家庭记忆。",
      },
    ],
    includeList: ["住宿", "温泉", "早餐"],
    excludeList: ["往返交通", "正餐"],
    tags: ["亲子", "温泉"],
    notes: "适合4-12岁儿童家庭。",
    refundPolicy: "出发前7天可免费取消。",
    location: "宁海安岚",
    guide,
  },
  {
    id: "moganshan-wellness",
    name: "莫干山•彻底对自己好一次",
    direction: "wellness",
    subtitle: "身体和心灵，一起被温柔对待",
    stateResponse: "如果你感到身心俱疲，需要一次深度的修复——",
    statePush: "这一次，只对自己好。",
    days: 3,
    nights: 2,
    priceRange: { min: 398000, max: 598000 },
    priceText: "¥3980起",
    coverImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=800&fit=crop",
    images: [],
    itinerary: [
      {
        day: 1,
        title: "第一天 · 抵达，把节奏降下来",
        description: "入住山居，傍晚瑜伽与冥想。今天没有 KPI。",
        accommodation: "莫干山精品民宿",
      },
      {
        day: 2,
        title: "第二天 · 深度修复",
        description: "森林浴、SPA、营养餐。全天无安排压力。",
      },
      {
        day: 3,
        title: "第三天 · 轻盈回归",
        description: "清晨太极，午后返程。",
      },
    ],
    includeList: ["住宿", "瑜伽", "SPA", "餐食"],
    excludeList: ["交通"],
    tags: ["康养", "疗愈"],
    notes: "",
    refundPolicy: "出发前7天可免费取消。",
    location: "莫干山",
    guide,
  },
  {
    id: "jingdezhen-culture",
    name: "景德镇•过几天手艺人的日子",
    direction: "culture",
    subtitle: "跟真实世界碰一下",
    stateResponse: "如果你渴望触摸真实的手作与匠人精神——",
    statePush: "过几天手艺人的日子，比逛景点踏实。",
    days: 4,
    nights: 3,
    priceRange: { min: 458000, max: 658000 },
    priceText: "¥4580起",
    coverImage:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=800&fit=crop",
    images: [],
    itinerary: [
      {
        day: 1,
        title: "第一天 · 抵达，认识泥土",
        description: "入住陶艺村落，傍晚逛窑址。",
        accommodation: "陶艺村民宿",
      },
      {
        day: 2,
        title: "第二天 · 拉坯成型",
        description: "跟随匠人学习拉坯，感受泥土的温度。",
      },
      {
        day: 3,
        title: "第三天 · 上釉入窑",
        description: "上釉、入窑，理解「等待」的美学。",
      },
      {
        day: 4,
        title: "第四天 · 取件告别",
        description: "取件、告别，带走属于自己的瓷器。",
      },
    ],
    includeList: ["住宿", "陶艺课程", "烧制"],
    excludeList: ["交通", "正餐"],
    tags: ["文化", "手作"],
    notes: "作品可邮寄。",
    refundPolicy: "出发前10天可免费取消。",
    location: "景德镇",
    guide: { ...guide, name: "周牧" },
  },
  {
    id: "dali-roadtrip",
    name: "大理-丽江•把方向盘交给自己",
    direction: "roadtrip",
    subtitle: "烦恼交给风景",
    stateResponse: "如果你需要一次彻底的自由——",
    statePush: "方向盘给自己，烦恼交给风景。",
    days: 6,
    nights: 5,
    priceRange: { min: 598000, max: 898000 },
    priceText: "¥5980起",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    images: [],
    itinerary: [
      {
        day: 1,
        title: "第一天 · 大理，环洱海",
        description: "取车，环洱海慢游，入住洱海边。",
        accommodation: "洱海边客栈",
      },
      {
        day: 2,
        title: "第二天 · 沙溪古镇",
        description: "驾车至沙溪，茶马古道上的宁静。",
      },
      {
        day: 3,
        title: "第三天 · 丽江古城",
        description: "抵达丽江，古城夜色。",
        accommodation: "古城客栈",
      },
      {
        day: 4,
        title: "第四天 · 玉龙雪山",
        description: "雪山脚下，可选徒步或缆车。",
      },
      {
        day: 5,
        title: "第五天 · 虎跳峡",
        description: "驾车至虎跳峡，感受自然的力量。",
      },
      {
        day: 6,
        title: "第六天 · 返程",
        description: "还车，返程。",
      },
    ],
    includeList: ["租车", "住宿", "路书", "保险"],
    excludeList: ["机票", "油费", "餐食"],
    tags: ["自驾", "自由"],
    notes: "需有效驾照。",
    refundPolicy: "出发前14天可免费取消。",
    location: "大理-丽江",
    guide,
  },
];

export function getDestinationById(id: string) {
  return destinations.find((d) => d.id === id);
}

export function getDestinationsByDirection(direction: string) {
  return destinations.filter((d) => d.direction === direction);
}
