const Sentiment = require('sentiment');
const sentiment = new Sentiment();

/**
 * Analyze a text string for sentiment using the AFINN-111 lexicon.
 * 
 * @param {string} text - The text to analyze
 * @returns {{ score: number, comparative: number, classification: string, tokens: string[], positive: string[], negative: string[] }}
 */
const analyze = (text) => {
  const result = sentiment.analyze(text);

  let classification = 'neutral';
  if (result.score > 0) classification = 'positive';
  else if (result.score < 0) classification = 'negative';

  return {
    score: result.score,
    comparative: result.comparative,
    classification,
    tokens: result.tokens,
    positive: result.positive,   // Array of positive words found
    negative: result.negative    // Array of negative words found
  };
};

/**
 * Analyze an array of remarks and produce an aggregate report.
 * 
 * @param {Array<{ remarks: string, rating: number }>} feedbackItems
 * @returns {{ totalCount: number, avgRating: number, sentimentBreakdown: object, positiveKeywords: object, negativeKeywords: object }}
 */
const generateReport = (feedbackItems) => {
  const breakdown = { positive: 0, negative: 0, neutral: 0 };
  const positiveWords = {};
  const negativeWords = {};
  let totalRating = 0;

  feedbackItems.forEach((item) => {
    const analysis = analyze(item.remarks);

    // Count sentiment classifications
    breakdown[analysis.classification]++;

    // Sum ratings for average
    totalRating += item.rating;

    // Aggregate positive keywords with frequency count
    analysis.positive.forEach((word) => {
      const lower = word.toLowerCase();
      positiveWords[lower] = (positiveWords[lower] || 0) + 1;
    });

    // Aggregate negative keywords with frequency count
    analysis.negative.forEach((word) => {
      const lower = word.toLowerCase();
      negativeWords[lower] = (negativeWords[lower] || 0) + 1;
    });
  });

  // Sort keywords by frequency (descending) and take top 10
  const sortByFreq = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

  return {
    totalCount: feedbackItems.length,
    avgRating: feedbackItems.length > 0
      ? parseFloat((totalRating / feedbackItems.length).toFixed(2))
      : 0,
    sentimentBreakdown: breakdown,
    positiveKeywords: sortByFreq(positiveWords),
    negativeKeywords: sortByFreq(negativeWords)
  };
};

module.exports = { analyze, generateReport };
