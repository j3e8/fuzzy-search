const levenshtein = require('./levenshtein');

module.exports = function fuzzySearch(search, items, threshold, partial) {
  if (!search) {
    return [];
  }
  if (!items || !items.length) {
    return [];
  }

  const term = search.toLowerCase();
  const words = items.map((item) => item.toString().toLowerCase());
  return words.filter((word) => test(word, term, threshold, partial));
}


function test(word, term, threshold, partial) {
  // if partial matching
  if (partial && word.includes(term)) {
    return true;
  }

  // do regular fuzzy match
  if (Math.abs(word.length - term.length) <= threshold) {
    const d = levenshtein(word, term);
    if (d <= threshold) {
      return true;
    }
  }

  // partial + fuzzy match
  if (partial) {
    const subword = word.substring(word.indexOf(term[0]));
    const d = levenshtein(subword, term);
    if (d <= threshold) {
      return true;
    }
  }

  return false;
}
