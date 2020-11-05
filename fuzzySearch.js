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
  const results = words.map((word) => test(word, term, options)).filter(r => r.match);

  results.sort((a, b) => {
    if (a.score === undefined || b.score === undefined) {
      return 0;
    }
    return a.score - b.score;
  });

  return results.map(res => res.word);
}

function test(word, term, options) {
  // if partial matching
  if (options.partial && word.includes(term)) {
    return {
      match: true,
      score: 1,
      word,
    };
  }

  if (options.soundex) {
    return soundexTest(word, term, options);
  } else {
    return levenshteinTest(word, term, options);
  }

  return { match: false, word };
}

function levenshteinTest(word, term, options) {
  const threshold = Math.ceil(term.length / 4); // arbitrarily we'll allow one error per 4 characters

  // do regular fuzzy match
  if (Math.abs(word.length - term.length) <= threshold) {
    const d = levenshtein(word, term);
    if (d <= threshold) {
      return {
        match: true,
        score: d,
        word,
      };
    }
  }

  // partial + fuzzy match
  if (options.partial) {
    const subword = word.substring(word.indexOf(term[0]));
    const d = levenshtein(subword, term);
    if (d <= threshold) {
      return {
        match: true,
        score: d,
        word,
      };
    }
  }

  return { match: false, word };
}

function soundexTest(word, term, options) {
  if (options.partial) {
    const longer = word.length > term.length ? word : term;
    const shorter = word === longer ? term : word;

    return {
      match: soundex(longer, true).includes(soundex(shorter, true)),
      word,
    };
  } else {
    return {
      match: soundex(word) === soundex(term),
      word,
    };
  }
}
