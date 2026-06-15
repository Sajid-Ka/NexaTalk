export const INTERESTS = {
  GAMING: 'gaming',
  MUSIC: 'music',
  MOVIES: 'movies',
  TV_SERIES: 'tv-series',
  PROGRAMMING_TECHNOLOGY: 'programming-technology',
  SPORTS: 'sports',
  EDUCATION_LEARNING: 'education-learning',
  ART_CREATIVITY: 'art-creativity',
} as const;

export type Interest =
  (typeof INTERESTS)[keyof typeof INTERESTS];

  export const INTEREST_LABELS = {
  GAMING: 'Gaming',
  MUSIC: 'Music',
  MOVIES: 'Movies',
  TV_SERIES: 'TV Series',
  PROGRAMMING_TECHNOLOGY: 'Programming & Technology',
  SPORTS: 'Sports',
  EDUCATION_LEARNING: 'Education & Learning',
  ART_CREATIVITY: 'Art & Creativity',
} as const;