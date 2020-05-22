module.exports = function fuzzySearch(search, items, key) {
  if (!search) {
    return [];
  }
  if (!items || !items.length) {
    return [];
  }

  const term = search.toLowerCase();
  const words = items.map((item) => {
    if (key) {
      return item[key].toString().toLowerCase();
    }
    return item.toString().toLowerCase();
  });

  return words.filter((word) => word.includes(term));
}
