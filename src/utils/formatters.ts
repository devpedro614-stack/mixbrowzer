export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatRating = (rating: number): string => {
  return `${rating}/10`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return "text-green-600 dark:text-green-400";
  if (rating >= 5) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const getRatingEmoji = (rating: number): string => {
  if (rating >= 9) return "🌟";
  if (rating >= 7) return "⭐";
  if (rating >= 5) return "🎵";
  if (rating >= 3) return "👎";
  return "💔";
};
