module.exports = function levenshtein(one, two) {
  let matrix = new Array(one.length + 1);
  for (var i=0; i < matrix.length; i++) {
    matrix[i] = new Array(two.length + 1);
  }

  for (var i=0; i < matrix.length; i++) {
    matrix[i][0] = i;
  }

  for (var j=0; j < matrix[0].length; j++) {
    matrix[0][j] = j;
  }

  for (var i=0; i < one.length; i++) {
    for (var j=0; j < two.length; j++) {
      let a = one[i];
      let b = two[j];

      let cost = a === b ? 0 : 1;
      let n = matrix[i+1][j];
      let w = matrix[i][j+1];
      let nw = matrix[i][j];

      matrix[i+1][j+1] = Math.min(n + 1, w + 1, nw + cost);
    }
  }

  return matrix[matrix.length - 1][matrix[0].length - 1];
}
