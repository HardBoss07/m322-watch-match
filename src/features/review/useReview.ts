import { useState, useCallback } from 'react';
import { Review, UserProfile, Movie } from '../../types';
import { MOCK_REVIEWS } from '../../data/mockData';

export function useReview(user: UserProfile) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const createReview = useCallback(
    (movie: Movie, rating: number, comment: string, isSpoiler: boolean = false) => {
      const fullReview: Review = {
        id: `rev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userHandle: user.handle,
        userAvatar: user.avatar,
        isVerified: true,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        movieInfo: `${movie.providers[0]?.name || 'Netflix'} • ${movie.year || '2024'}`,
        rating: rating,
        ratingMax: 10,
        text: comment.trim(),
        isSpoiler: isSpoiler,
        createdAt: 'Gerade eben',
        likes: 1,
        commentsCount: 0,
        likedByMe: true,
        savedToWatchlist: true,
      };

      setReviews((prev) => [fullReview, ...prev]);
      return fullReview;
    },
    [user]
  );

  const toggleLikeReview = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const nextLiked = !r.likedByMe;
          return {
            ...r,
            likedByMe: nextLiked,
            likes: nextLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      })
    );
  }, []);

  return {
    reviews,
    setReviews,
    createReview,
    toggleLikeReview,
  };
}
