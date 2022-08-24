const { expect } = require("@jest/globals");
const { sum } = require("./utilities");

test("Somatório simples", () => {
  expect(sum(24, 22)).toBe(46);
  expect(sum(54, 14)).toBe(68);
  expect(sum(42, 86)).toBe(128);
  expect(sum(42, 66)).toBe(108);
  expect(sum(77, 84)).toBe(161);
});

test("Somatório de pontos flutuantes", () => {
  expect(sum(0.1, 0.2)).toBe(0.3);
});

test("[Array] Somatório simples", () => {
  expect([24, 22, 54, 14, 42, 86, 42, 66, 77, 84].reduce(sum, 0)).toBe(511);
});

test("[Array] Somatório de pontos flutuantes", () => {
  expect([1.75, 2.68, 5.56].reduce(sum, 0)).toBe(9.99);
});
