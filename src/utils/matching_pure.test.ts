import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateTasteMatch,
  getSentimentLabel,
  calculateXpProgress,
  getNextDeckIndex,
  filterMovies,
} from "./matching";
import { Movie, FilterSettings } from "../types";

test("getNextDeckIndex advances normally before end of deck", () => {
  const result = getNextDeckIndex(0, 5);
  assert.equal(result.nextIndex, 1);
  assert.equal(result.didWrap, false);
});

test("getNextDeckIndex wraps around cleanly and flags didWrap on last card", () => {
  const result = getNextDeckIndex(4, 5);
  assert.equal(result.nextIndex, 0);
  assert.equal(result.didWrap, true);
});

test("calculateTasteMatch returns high score for overlapping genres", () => {
  const scoreIdentical = calculateTasteMatch(
    ["Sci-Fi", "Anime", "Action"],
    ["Sci-Fi", "Anime", "Action"],
    5,
  );
  assert.ok(
    scoreIdentical >= 80,
    `Expected score >= 80, got ${scoreIdentical}`,
  );

  const scorePartial = calculateTasteMatch(
    ["Sci-Fi", "Action", "Anime"],
    ["Sci-Fi", "Anime", "Thriller"],
    2,
  );
  assert.ok(scorePartial >= 50, `Expected score >= 50, got ${scorePartial}`);
});

test("getSentimentLabel maps ratings appropriately", () => {
  assert.equal(getSentimentLabel(10), "Legendär / Kult");
  assert.equal(getSentimentLabel(9), "Absolutes Meisterwerk");
  assert.equal(getSentimentLabel(1), "Enttäuschend");
});

test("calculateXpProgress correctly computes percentages and remaining XP", () => {
  const progress = calculateXpProgress(750, 1000);
  assert.equal(progress.percent, 75);
  assert.equal(progress.xpRemaining, 250);
});

test("filterMovies correctly filters by audio tracks and genres", () => {
  const sampleMovies: Movie[] = [
    {
      id: "m1",
      title: "Anime Cyber",
      type: "series",
      year: 2022,
      genres: ["Anime", "Sci-Fi"],
      rating: 8.9,
      posterUrl: "",
      synopsis: "",
      providers: [
        {
          id: "netflix",
          name: "Netflix",
          quality: "4K",
          audio: ["DE Synchro", "JA"],
        },
      ],
      hasDeAudio: true,
      isGermanAudioDefault: true,
    },
    {
      id: "m2",
      title: "French Comedy",
      type: "movie",
      year: 2021,
      genres: ["Komödie"],
      rating: 7.2,
      posterUrl: "",
      synopsis: "",
      providers: [
        {
          id: "netflix",
          name: "Netflix",
          quality: "HD",
          audio: ["FR Original"],
        },
      ],
      hasDeAudio: false,
      isGermanAudioDefault: false,
    },
  ];

  const filters: FilterSettings = {
    providers: {
      netflix: true,
      prime: false,
      disney: false,
      apple: false,
      crunchyroll: false,
      paramount: false,
    },
    onlyDeAudio: true,
    maxRuntimeMinutes: 210,
    hideUnreleased: false,
    audioLanguages: ["DE"],
    genres: ["Anime"],
    pushNewSeasons: true,
    pushFriendRecommendations: true,
  };

  const filtered = filterMovies(sampleMovies, filters);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, "m1");
});
