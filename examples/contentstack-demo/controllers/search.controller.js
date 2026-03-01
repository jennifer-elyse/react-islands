import { searchProducts, searchSuggestions } from '../models/search.model.js';

const parseIntSafe = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const apiSearchProducts = async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = Math.min(parseIntSafe(req.query.limit, 10), 50);
    const offset = parseIntSafe(req.query.offset, 0);

    const result = await searchProducts({ query, limit, offset });

    res.json({
      success: true,
      products: result.products,
      total: result.total,
      offset: result.offset
    });
  } catch (err) {
    console.error('API search error:', err);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};

export const apiSearchSuggestions = async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = Math.min(parseIntSafe(req.query.limit, 8), 20);

    const result = await searchSuggestions({ query, limit });

    res.json({
      success: true,
      suggestions: result.suggestions
    });
  } catch (err) {
    console.error('API suggestions error:', err);
    res.status(500).json({ success: false, error: 'Suggestions failed' });
  }
};
