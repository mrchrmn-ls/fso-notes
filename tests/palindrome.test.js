const reverseLetters = require("../utils/for_testing").reverseLetters;

xtest("Reversal of 'a'", () => {
  const result = reverseLetters("a");

  expect(result).toBe("a");
});

xtest("Reversal of 'react'", () => {
  const result = reverseLetters("react");

  expect(result).toBe("tcaer");
});

xtest("Reversal of 'releveler'", () => {
  const result = reverseLetters("revelever");

  expect(result).toBe("revelever");
});