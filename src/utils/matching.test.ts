import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTasteMatch,
  getSentimentLabel,
  calculateXpProgress,
  filterMovies
} from './matching';
import { Movie, FilterSettings } from '../types';

test('calculateTasteMatch returns correct compatibility score', () => {
  const genresA = ['Sci-Fi', 'Anime', 'Thriller'];
  const genresB = ['Sci-Fi', 'Anime', 'Psychological Thriller'];
  const score = calculateTasteMatch(genresA, genresB, 14);
  assert.ok(score >= 80 && score <= 99, `Score ${score} should be around 88%`);

  // Disjoint genres
  const zeroScore = calculateTasteMatch(['Romance'], ['Horror'], 0);
  assert.ok(zeroScore <= 30);
});

test('getSentimentLabel maps rating to German sentiment text', () => {
  assert.equal(getSentimentLabel(1), 'Enttäuschend');
  assert.equal(getSentimentLabel(8.5), 'Absolutes Meisterwerk');
  assert.equal(getSentimentLabel(8), 'Sehr empfehlenswert!');
  assert.equal(getSentimentLabel(10), 'Legendär / Kult');
});

test('calculateXpProgress calculates percentage and remaining XP', () => {
  const { percent, xpRemaining } = calculateXpProgress(1560, 2000);
  assert.equal(percent, 78);
  assert.equal(xpRemaining, 440);
});

test('filterMovies respects provider, German audio and max runtime', () => {
  const sampleMovies: Movie[] = [
    {
      id: 'm1',
      title: 'Cyberpunk: Edgerunners',
      type: 'series',
      year: 2022,
      duration: '10 Episoden',
      genres: ['Sci-Fi', 'Anime'],
      rating: 8.9,
      posterUrl: '/poster1.jpg',
      synopsis: 'Night city',
      providers: [{ id: 'netflix', name: 'Netflix', quality: '4K', audio: ['DE', 'JA'] }],
      hasDeAudio: true,
      isGermanAudioDefault: true,
    },
    {
      id: 'm2',
      title: 'The Batman',
      type: 'movie',
      year: 2022,
      duration: '2h 56m', // 176 mins
      genres: ['Action', 'Crime'],
      rating: 9.0,
      posterUrl: '/poster2.jpg',
      synopsis: 'Gotham city',
      providers: [{ id: 'netflix', name: 'Netflix', quality: '4K', audio: ['DE'] }],
      hasDeAudio: true,
      isGermanAudioDefault: true,
    },
    {
      id: 'm3',
      title: 'English-Only Movie',
      type: 'movie',
      year: 2023,
      duration: '1h 30m',
      genres: ['Drama'],
      rating: 7.5,
      posterUrl: '/poster3.jpg',
      synopsis: 'English only',
      providers: [{ id: 'paramount', name: 'Paramount+', quality: 'HD', audio: ['EN'] }],
      hasDeAudio: false,
      isGermanAudioDefault: false,
    }
  ];

  const defaultFilters: FilterSettings = {
    providers: {
      netflix: true,
      disney: true,
      prime: true,
      crunchyroll: true,
      apple: false,
      paramount: false,
    },
    onlyDeAudio: true,
    hideUnreleased: false,
    maxRuntimeMinutes: 120, // 120 mins max -> The Batman (176 mins) should be filtered out
    pushNewSeasons: true,
    pushFriendRecommendations: false,
  };

  const filtered = filterMovies(sampleMovies, defaultFilters);
  // Cyberpunk should pass (series, no 2h runtime)
  // The Batman should be filtered out (2h 56m > 120m)
  // English-Only should be filtered out (Paramount disabled, no DE audio)
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'm1');
});
