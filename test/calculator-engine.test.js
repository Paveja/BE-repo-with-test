import {
  createInitialState,
  reduce,
  formatNumber,
} from "../public/calculator-engine.js";

function dispatchAll(actions) {
  return actions.reduce(reduce, createInitialState());
}

describe("calculator engine", () => {
  test("adds two numbers: 12 + 7 = 19", () => {
    const state = dispatchAll([
      { type: "number", value: "1" },
      { type: "number", value: "2" },
      { type: "operator", value: "+" },
      { type: "number", value: "7" },
      { type: "equals" },
    ]);

    expect(state.currentOperand).toBe("19");
  });

  test("applies a percentage discount: 80 - 25% = 60", () => {
    const state = dispatchAll([
      { type: "number", value: "8" },
      { type: "number", value: "0" },
      { type: "operator", value: "-" },
      { type: "number", value: "2" },
      { type: "number", value: "5" },
      { type: "percent" },
      { type: "equals" },
    ]);

    expect(state.currentOperand).toBe("60");
  });

  test("splits a bill evenly: 96 / 4 = 24", () => {
    const state = dispatchAll([
      { type: "number", value: "9" },
      { type: "number", value: "6" },
      { type: "operator", value: "/" },
      { type: "number", value: "4" },
      { type: "equals" },
    ]);

    expect(state.currentOperand).toBe("24");
  });

  test("rejects divide by zero and recovers on clear", () => {
    const afterDivide = dispatchAll([
      { type: "number", value: "5" },
      { type: "operator", value: "/" },
      { type: "number", value: "0" },
      { type: "equals" },
    ]);

    expect(afterDivide.isError).toBe(true);

    const recovered = reduce(afterDivide, { type: "clear" });
    expect(recovered.isError).toBe(false);
    expect(recovered.currentOperand).toBe("0");
  });

  test("handles decimal input, sign toggle, and delete", () => {
    let state = dispatchAll([
      { type: "number", value: "3" },
      { type: "decimal" },
      { type: "number", value: "5" },
    ]);
    expect(state.currentOperand).toBe("3.5");

    state = reduce(state, { type: "sign" });
    expect(state.currentOperand).toBe("-3.5");

    state = reduce(state, { type: "delete" });
    expect(state.currentOperand).toBe("-3.");
  });

  test("repeats the last operation when equals is pressed again", () => {
    let state = dispatchAll([
      { type: "number", value: "5" },
      { type: "operator", value: "+" },
      { type: "number", value: "2" },
      { type: "equals" },
    ]);
    expect(state.currentOperand).toBe("7");

    state = reduce(state, { type: "equals" });
    expect(state.currentOperand).toBe("9");
  });

  test("chains multiple operations in sequence", () => {
    const state = dispatchAll([
      { type: "number", value: "2" },
      { type: "operator", value: "+" },
      { type: "number", value: "3" },
      { type: "operator", value: "*" },
      { type: "number", value: "4" },
      { type: "equals" },
    ]);

    expect(state.currentOperand).toBe("20");
  });

  test("formatNumber adds thousands separators without breaking decimals", () => {
    expect(formatNumber("1234567.5")).toBe("1,234,567.5");
    expect(formatNumber("-42")).toBe("-42");
  });
});
