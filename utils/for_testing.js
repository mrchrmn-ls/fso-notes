function reverseLetters(string) {
  return string.split("").reverse().join("");
}

function average(array) {
  if (array.length === 0) return 0;

  function reducer(sum, item) {
    return sum + item;
  }

  return array.reduce(reducer, 0) / array.length;
}

module.exports = {
  reverseLetters,
  average
};