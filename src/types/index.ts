export type ExperienceCategory =
  | "recharge"
  | "stretch"
  | "taste"
  | "nostalgia"
  | "reset";

export type DestinationDirection =
  | "family"
  | "wellness"
  | "culture"
  | "roadtrip";

export interface Experience {
  id: string;
  name: string;
  category: ExperienceCategory;
  subtitle: string;
  stateResponse: string;
  statePush?: string;
  rhythm: { relax: string; deep: string; merge: string };
  schedule: { time: string; title: string; description: string }[];
  guide: { name: string; avatar: string; bio: string };
  duration: string;
  location: string;
  city: string;
  maxPeople: number;
  suitableFor?: string;
  price: number;
  priceText: string;
  includeList: string[];
  excludeList: string[];
  coverImage: string;
  images: string[];
  tags: string[];
  socialType: "group" | "solo" | "both";
  notes: string;
  refundPolicy: string;
}

export interface Destination {
  id: string;
  name: string;
  direction: DestinationDirection;
  subtitle: string;
  stateResponse: string;
  statePush?: string;
  days: number;
  nights: number;
  priceRange: { min: number; max: number };
  priceText: string;
  coverImage: string;
  images: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    accommodation?: string;
  }[];
  includeList: string[];
  excludeList: string[];
  tags: string[];
  notes: string;
  refundPolicy: string;
  location: string;
  guide: { name: string; avatar: string; bio: string };
}

export interface CategoryConfig {
  key: ExperienceCategory;
  name: string;
  icon: string;
  tagline: string;
  color: string;
}

export interface DirectionConfig {
  key: DestinationDirection;
  name: string;
  tagline: string;
}
