const CONSONANTS = {
  '1': ['B','F','P','V'],
  '2': ['C','G','J','K','Q','S','X','Z'],
  '3': ['D','T'],
  '4': ['L'],
  '5': ['M','N'],
  '6': ['R'],
}

function lookupConsonantCode(ch) {
  for (let c = 1; c <= 6; c++) {
    if (CONSONANTS[c.toString()].includes(ch)) {
      return c;
    }
  }
  return '';
}

module.exports = function soundex(str, allDigits = false) {
  let s = allDigits ? '' : str[0].toUpperCase();
  let lastDigit = s ? lookupConsonantCode(s) : null;

  const word = str.toUpperCase().substring(allDigits ? 0 : 1);
  for (let i = 0; i < word.length; i++) {
    let found = false;
    for (let c = 1; c <= 6; c++) {
      if (CONSONANTS[c.toString()].includes(word[i])) {
        if (lastDigit !== c) {
          s += c;
        }
        lastDigit = c;
        found = true;
        break;
      }
    }

    // other characters are omitted but treated like vowels
    if (!found) {
      lastDigit = null;
    }
  }

  return s;
}
