import { Movie, FilterSettings } from '../types';

/**
 * Calculates taste compatibility score between two users as a percentage (0 - 100).
 */
export function calculateTasteMatch(
  userGenresA: string[],
  userGenresB: string[],
  sharedHits: number = 0
): number {
  if (userGenresA.length === 0 || userGenresB.length === 0) return 50;
  
  const setB = new Set(userGenresB.map(g => g.toLowerCase().trim()));
  const setA = new Set(userGenresA.map(g => g.toLowerCase().trim()));
  
  // Calculate direct matches and soft matches (e.g. "Psychological Thriller" and "Thriller")
  let matches = 0;
  for (const gA of setA) {
    if (setB.has(gA)) {
      matches += 1;
    } else {
      // Partial subgenre match
      for (const gB of setB) {
        if (gA.includes(gB) || gB.includes(gA)) {
          matches += 0.8;
          break;
        }
      }
    }
  }

  const avgSize = (setA.size + setB.size) / 2;
  const matchRatio = avgSize > 0 ? (matches / avgSize) : 0;
  
  if (matchRatio === 0 && sharedHits === 0) {
    return 15;
  }
  
  const hitBonus = Math.min(sharedHits * 1.5, 20);
  const score = Math.round(matchRatio * 75 + hitBonus);
  return Math.min(Math.max(score, 10), 99);
}

/**
 * Evaluates sentiment badge text according to a 1-10 star rating score.
 */
export function getSentimentLabel(rating: number): string {
  const rounded = Math.round(rating);
  const sentiments: Record<number, string> = {
    1: 'Enttäuschend',
    2: 'Schwach',
    3: 'Mäßig',
    4: 'Ganz okay',
    5: 'Durchschnittlich',
    6: 'Solide Unterhaltung',
    7: 'Gut gemacht',
    8: 'Sehr empfehlenswert!',
    9: 'Absolutes Meisterwerk',
    10: 'Legendär / Kult'
  };
  return sentiments[rounded] || 'Sehr empfehlenswert';
}

/**
 * Calculates XP percentage and remaining XP to next rank.
 */
export function calculateXpProgress(currentXp: number, targetXp: number): {
  percent: number;
  xpRemaining: number;
} {
  if (targetXp <= 0) return { percent: 100, xpRemaining: 0 };
  const percent = Math.min(Math.round((currentXp / targetXp) * 100), 100);
  const xpRemaining = Math.max(targetXp - currentXp, 0);
  return { percent, xpRemaining };
}

/**
 * Filters movies based on active subscriptions, DE audio flag, and runtime limit.
 */
export function filterMovies(movies: Movie[], filters: FilterSettings): Movie[] {
  return movies.filter(movie => {
    // Check provider availability
    const hasActiveProvider = movie.providers.some(p => filters.providers[p.id]);
    if (!hasActiveProvider) return false;

    // Check German audio requirement
    if (filters.onlyDeAudio && !movie.hasDeAudio) {
      return false;
    }

    // Check runtime limit (if not "no limit" >= 210 min)
    if (filters.maxRuntimeMinutes < 210 && movie.duration) {
      const match = movie.duration.match(/(\d+)h\s*(\d+)?m?/);
      if (match) {
        const hours = parseInt(match[1] || '0', 10);
        const mins = parseInt(match[2] || '0', 10);
        const totalMinutes = hours * 60 + mins;
        if (totalMinutes > filters.maxRuntimeMinutes) {
          return false;
        }
      }
    }

    return true;
  });
}
