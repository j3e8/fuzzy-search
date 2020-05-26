const levenshtein = require('./levenshtein');
const soundex = require('./soundex');

module.exports = function fuzzySearch(search, items, options = {}) {
  if (!search) {
    return [];
  }
  if (!items || !items.length) {
    return [];
  }

  const term = search.toLowerCase();
  const words = items.map((item) => item.toString().toLowerCase());
  return words.filter((word) => test(word, term, options));
}

function test(word, term, options) {
  // if partial matching
  if (options.partial && word.includes(term)) {
    return true;
  }

  if (options.soundex) {
    return soundexTest(word, term, options);
  } else {
    return levenshteinTest(word, term, options);
  }

  return false;
}

function levenshteinTest(word, term, options) {
  const threshold = Math.ceil(term.length / 8); // arbitrarily we'll allow one error per 8 characters

  // do regular fuzzy match
  if (Math.abs(word.length - term.length) <= threshold) {
    const d = levenshtein(word, term);
    if (d <= threshold) {
      return true;
    }
  }

  // partial + fuzzy match
  if (options.partial) {
    const subword = word.substring(word.indexOf(term[0]));
    const d = levenshtein(subword, term);
    if (d <= threshold) {
      return true;
    }
  }

  return false;
}

function soundexTest(word, term, options) {
  if (options.partial) {
    const longer = word.length > term.length ? word : term;
    const shorter = word === longer ? term : word;

    return soundex(longer, true).includes(soundex(shorter, true));
  } else {
    return soundex(word) === soundex(term);
  }
}
