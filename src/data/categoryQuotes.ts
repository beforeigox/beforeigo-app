import quotesData from './quotes.json';

export const categoryQuotes: Record<string, string> = quotesData.categoryQuotes;

export const getQuoteForCategory = (category: string): string | null => {
  return categoryQuotes[category] || null;
};
