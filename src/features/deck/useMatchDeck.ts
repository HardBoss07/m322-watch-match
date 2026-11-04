import { useState, useRef, useEffect, useCallback } from 'react';
import { Movie } from '../../types';
import { getNextDeckIndex } from '../../utils/matching';

interface UseMatchDeckProps {
  movies: Movie[];
  onMatch: (movie: Movie) => void;
  onPass: (movie: Movie) => void;
  onSuperlike: (movie: Movie) => void;
  onDeckWrapped?: (message: string) => void;
}

export function useMatchDeck({
  movies,
  onMatch,
  onPass,
  onSuperlike,
  onDeckWrapped,
}: UseMatchDeckProps) {
  const [deck, setDeck] = useState<Movie[]>(movies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [surpriseMode, setSurpriseMode] = useState(true);
  const [wrapNotice, setWrapNotice] = useState<string | null>(null);
  const [matchNotification, setMatchNotification] = useState<{
    movie: Movie;
    friendName: string;
    matchPercent: number;
  } | null>(null);

  const prevMovieIdsRef = useRef<string>(movies.map((m) => m.id).join(','));
  const wrapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with movies prop only when IDs actually change
  useEffect(() => {
    const currentIds = movies.map((m) => m.id).join(',');
    if (currentIds !== prevMovieIdsRef.current) {
      prevMovieIdsRef.current = currentIds;
      setDeck(movies);
      setCurrentIndex(0);
    } else {
      setDeck(movies);
    }
  }, [movies]);

  useEffect(() => {
    return () => {
      if (wrapTimeoutRef.current) clearTimeout(wrapTimeoutRef.current);
    };
  }, []);

  const deckLength = deck.length;
  const safeIndex = deckLength > 0 ? currentIndex % deckLength : 0;
  const currentMovie = deck[safeIndex];
  const nextMovie = deckLength > 1 ? deck[(safeIndex + 1) % deckLength] : null;

  const triggerWrapNotification = useCallback(() => {
    const msg = 'Du hast alle aktuellen Empfehlungen gesehen! Die Liste wurde neu gestartet.';
    setWrapNotice(msg);
    if (wrapTimeoutRef.current) clearTimeout(wrapTimeoutRef.current);
    wrapTimeoutRef.current = setTimeout(() => {
      setWrapNotice(null);
    }, 3500);

    onDeckWrapped?.(msg);
  }, [onDeckWrapped]);

  const advanceCard = useCallback(() => {
    if (deckLength === 0) return;
    const { nextIndex, didWrap } = getNextDeckIndex(safeIndex, deckLength);
    setCurrentIndex(nextIndex);

    if (didWrap) {
      triggerWrapNotification();
    }
  }, [deckLength, safeIndex, triggerWrapNotification]);

  const triggerLike = useCallback(() => {
    if (!currentMovie) return;
    const movieToMatch = currentMovie;
    onMatch(movieToMatch);

    // If movie has high match score with Dario, trigger celebration overlay
    if (movieToMatch.matchScore && movieToMatch.matchScore >= 90) {
      setMatchNotification({
        movie: movieToMatch,
        friendName: 'Dario M.',
        matchPercent: movieToMatch.matchScore || 92,
      });
    }

    setTimeout(() => {
      advanceCard();
    }, 240);
  }, [currentMovie, onMatch, advanceCard]);

  const triggerPass = useCallback(() => {
    if (!currentMovie) return;
    onPass(currentMovie);
    setTimeout(() => {
      advanceCard();
    }, 240);
  }, [currentMovie, onPass, advanceCard]);

  const triggerSuperlike = useCallback(() => {
    if (!currentMovie) return;
    onSuperlike(currentMovie);
    setTimeout(() => {
      advanceCard();
    }, 240);
  }, [currentMovie, onSuperlike, advanceCard]);

  const dismissMatchModal = useCallback(() => {
    const matchedMovieId = matchNotification?.movie.id;
    setMatchNotification(null);

    // If deck is still currently showing the matched movie, advance immediately
    if (matchedMovieId && deck[currentIndex % deckLength]?.id === matchedMovieId) {
      advanceCard();
    }
  }, [matchNotification, deck, currentIndex, deckLength, advanceCard]);

  const toggleSurpriseMode = useCallback(() => {
    const next = !surpriseMode;
    setSurpriseMode(next);
    if (next && deckLength > 1) {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentIndex(0);
      onDeckWrapped?.('Zufallsmodus aktiviert — Deck neu gemischt! 🎲');
    }
  }, [surpriseMode, deck, deckLength, onDeckWrapped]);

  return {
    deck,
    deckLength,
    currentIndex: safeIndex,
    currentMovie,
    nextMovie,
    surpriseMode,
    toggleSurpriseMode,
    wrapNotice,
    setWrapNotice,
    matchNotification,
    triggerLike,
    triggerPass,
    triggerSuperlike,
    dismissMatchModal,
    advanceCard,
  };
}
