const fs = require('fs');
const fuzzySearch = require('./fuzzySearch');
const PATH_TO_WORDLIST = './english_dictionary.txt';

const searchArg = process.argv[2];
if (!searchArg) {
  console.error("Usage: node main.js [search term]");
  process.exit(1);
}

function loadWordList() {
  const data = fs.readFileSync(PATH_TO_WORDLIST, 'utf8');
  const lines = data.split('\n');
  return lines.map(l => l.trim()).filter(l => l);
}

function main(term) {
  const words = loadWordList();
  const start = Date.now();
  const results = fuzzySearch(term, words, { partial: false, soundex: false });
  const end = Date.now();
  console.log(results);
  console.log(`${end - start}ms`);
}


main(searchArg);
