import { InterestCategory } from "./interests.const";

export interface InterestKeywordMapping {
  keyword: string;
  category: InterestCategory;
}

export const INTEREST_KEYWORDS: InterestKeywordMapping[] = [
  // Gaming
  { keyword: "game", category: InterestCategory.GAMING },
  { keyword: "gaming", category: InterestCategory.GAMING },
  { keyword: "valorant", category: InterestCategory.GAMING },
  { keyword: "lol", category: InterestCategory.GAMING },
  { keyword: "league", category: InterestCategory.GAMING },
  { keyword: "minecraft", category: InterestCategory.GAMING },
  { keyword: "cod", category: InterestCategory.GAMING },
  { keyword: "fortnite", category: InterestCategory.GAMING },
  { keyword: "pubg", category: InterestCategory.GAMING },
  { keyword: "stream", category: InterestCategory.GAMING },

  // Music
  { keyword: "music", category: InterestCategory.MUSIC },
  { keyword: "song", category: InterestCategory.MUSIC },
  { keyword: "beat", category: InterestCategory.MUSIC },
  { keyword: "lofi", category: InterestCategory.MUSIC },
  { keyword: "asmr", category: InterestCategory.MUSIC },
  { keyword: "podcast", category: InterestCategory.MUSIC },
  { keyword: "audio", category: InterestCategory.MUSIC },
  { keyword: "produce", category: InterestCategory.MUSIC },

  // Study
  { keyword: "study", category: InterestCategory.STUDY },
  { keyword: "learn", category: InterestCategory.STUDY },
  { keyword: "course", category: InterestCategory.STUDY },
  { keyword: "class", category: InterestCategory.STUDY },
  { keyword: "lecture", category: InterestCategory.STUDY },
  { keyword: "homework", category: InterestCategory.STUDY },
  { keyword: "exam", category: InterestCategory.STUDY },

  // Technology
  { keyword: "tech", category: InterestCategory.TECHNOLOGY },
  { keyword: "code", category: InterestCategory.TECHNOLOGY },
  { keyword: "programming", category: InterestCategory.TECHNOLOGY },
  { keyword: "dev", category: InterestCategory.TECHNOLOGY },
  { keyword: "software", category: InterestCategory.TECHNOLOGY },
  { keyword: "ai", category: InterestCategory.TECHNOLOGY },
  { keyword: "computer", category: InterestCategory.TECHNOLOGY },
  { keyword: "python", category: InterestCategory.TECHNOLOGY },
  { keyword: "javascript", category: InterestCategory.TECHNOLOGY },

  // Sports
  { keyword: "sport", category: InterestCategory.SPORTS },
  { keyword: "football", category: InterestCategory.SPORTS },
  { keyword: "soccer", category: InterestCategory.SPORTS },
  { keyword: "basketball", category: InterestCategory.SPORTS },
  { keyword: "tennis", category: InterestCategory.SPORTS },
  { keyword: "gym", category: InterestCategory.SPORTS },
  { keyword: "fitness", category: InterestCategory.SPORTS },
  { keyword: "workout", category: InterestCategory.SPORTS },

  // Art
  { keyword: "art", category: InterestCategory.ART },
  { keyword: "draw", category: InterestCategory.ART },
  { keyword: "paint", category: InterestCategory.ART },
  { keyword: "design", category: InterestCategory.ART },
  { keyword: "creative", category: InterestCategory.ART },
  { keyword: "animation", category: InterestCategory.ART },

  // Movies
  { keyword: "movie", category: InterestCategory.MOVIES },
  { keyword: "film", category: InterestCategory.MOVIES },
  { keyword: "cinema", category: InterestCategory.MOVIES },
  { keyword: "tv", category: InterestCategory.MOVIES },
  { keyword: "series", category: InterestCategory.MOVIES },
  { keyword: "netflix", category: InterestCategory.MOVIES },

  // Books
  { keyword: "book", category: InterestCategory.BOOKS },
  { keyword: "read", category: InterestCategory.BOOKS },
  { keyword: "novel", category: InterestCategory.BOOKS },
  { keyword: "literature", category: InterestCategory.BOOKS },
  { keyword: "story", category: InterestCategory.BOOKS },

  // Food
  { keyword: "food", category: InterestCategory.FOOD },
  { keyword: "cook", category: InterestCategory.FOOD },
  { keyword: "recipe", category: InterestCategory.FOOD },
  { keyword: "bake", category: InterestCategory.FOOD },
  { keyword: "cuisine", category: InterestCategory.FOOD },

  // Travel
  { keyword: "travel", category: InterestCategory.TRAVEL },
  { keyword: "trip", category: InterestCategory.TRAVEL },
  { keyword: "vacation", category: InterestCategory.TRAVEL },
  { keyword: "adventure", category: InterestCategory.TRAVEL },
];
