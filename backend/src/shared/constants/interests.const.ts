export const InterestCategory = {
  GAMING: "gaming",
  MUSIC: "music",
  STUDY: "study",
  TECHNOLOGY: "technology",
  SPORTS: "sports",
  ART: "art",
  MOVIES: "movies",
  BOOKS: "books",
  FOOD: "food",
  TRAVEL: "travel",
  FITNESS: "fitness",
  FASHION: "fashion",
  SCIENCE: "science",
  BUSINESS: "business",
  OTHER: "other",
} as const;

export type InterestCategory = (typeof InterestCategory)[keyof typeof InterestCategory];

export const DEFAULT_INTERESTS = [
  "Gaming",
  "Music Production",
  "Study Group",
  "Programming",
  "Valorant",
  "League of Legends",
  "Minecraft",
  "ASMR",
  "Lo-fi Beats",
  "Mathematics",
  "Physics",
  "Literature",
  "Chess",
  "Fitness",
  "Cooking",
] as const;
