// Pure calculator logic: no DOM access, so it can run in the browser and
// be unit-tested directly in Node/Jest.

export const MAX_DIGITS = 15;

export function createInitialState() {
  return {
    currentOperand: "0",
    previousOperand: "",
    operation: null,
    overwrite: true,
    isError: false,
    lastOperation: null,
    lastOperand: null,
  };
}

function resetError() {
  return createInitialState();
}

function withDigit(state, digit) {
  if (state.isError) state = resetError();

  if (state.overwrite) {
    return {
      ...state,
      currentOperand: digit === "." ? "0." : digit,
      overwrite: false,
    };
  }

  if (digit === "." && state.currentOperand.includes(".")) return state;
  if (state.currentOperand.replace(/[-.]/g, "").length >= MAX_DIGITS) {
    return state;
  }

  const currentOperand =
    state.currentOperand === "0" && digit !== "."
      ? digit
      : state.currentOperand + digit;

  return { ...state, currentOperand };
}

export function compute(previousOperand, operation, currentOperand) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (Number.isNaN(previous) || Number.isNaN(current) || !operation) {
    return { error: false, result: currentOperand };
  }

  if (operation === "/" && current === 0) {
    return { error: true, result: "0" };
  }

  let result;
  switch (operation) {
    case "+":
      result = previous + current;
      break;
    case "-":
      result = previous - current;
      break;
    case "*":
      result = previous * current;
      break;
    case "/":
      result = previous / current;
      break;
    default:
      return { error: false, result: currentOperand };
  }

  result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
  return { error: false, result: result.toString() };
}

function withOperator(state, nextOperation) {
  if (state.isError) state = resetError();

  let next = state;
  if (state.previousOperand && !state.overwrite) {
    const { error, result } = compute(
      state.previousOperand,
      state.operation,
      state.currentOperand
    );
    if (error) {
      return { ...createInitialState(), isError: true };
    }
    next = { ...state, currentOperand: result };
  }

  return {
    ...next,
    operation: nextOperation,
    previousOperand: next.currentOperand,
    overwrite: true,
    lastOperation: null,
    lastOperand: null,
  };
}

function withEquals(state) {
  if (state.isError) return state;

  if (state.operation && !state.overwrite) {
    const { error, result } = compute(
      state.previousOperand,
      state.operation,
      state.currentOperand
    );
    if (error) {
      return { ...createInitialState(), isError: true };
    }
    return {
      ...state,
      currentOperand: result,
      previousOperand: "",
      operation: null,
      overwrite: true,
      lastOperation: state.operation,
      lastOperand: state.currentOperand,
    };
  }

  if (state.lastOperation && state.lastOperand !== null) {
    const { error, result } = compute(
      state.currentOperand,
      state.lastOperation,
      state.lastOperand
    );
    if (error) {
      return { ...createInitialState(), isError: true };
    }
    return { ...state, currentOperand: result };
  }

  return state;
}

function withPercent(state) {
  if (state.isError) state = resetError();

  const current = parseFloat(state.currentOperand);
  if (Number.isNaN(current)) return state;

  if (state.operation && state.previousOperand) {
    const previous = parseFloat(state.previousOperand);
    return {
      ...state,
      currentOperand: (previous * (current / 100)).toString(),
      overwrite: false,
    };
  }

  return {
    ...state,
    currentOperand: (current / 100).toString(),
    overwrite: false,
  };
}

function withSignToggle(state) {
  if (state.isError) state = resetError();
  if (state.currentOperand === "0") return state;

  const currentOperand = state.currentOperand.startsWith("-")
    ? state.currentOperand.slice(1)
    : `-${state.currentOperand}`;

  return { ...state, currentOperand };
}

function withDelete(state) {
  if (state.isError) return resetError();
  if (state.overwrite) return state;

  let currentOperand =
    state.currentOperand.length > 1
      ? state.currentOperand.slice(0, -1)
      : "0";

  if (currentOperand === "-") currentOperand = "0";

  return {
    ...state,
    currentOperand,
    overwrite: currentOperand === "0",
  };
}

export function reduce(state, action) {
  switch (action.type) {
    case "number":
      return withDigit(state, action.value);
    case "decimal":
      return withDigit(state, ".");
    case "operator":
      return withOperator(state, action.value);
    case "equals":
      return withEquals(state);
    case "percent":
      return withPercent(state);
    case "sign":
      return withSignToggle(state);
    case "delete":
      return withDelete(state);
    case "clear":
      return createInitialState();
    default:
      return state;
  }
}

export function formatNumber(value) {
  if (value === "" || value === "-") return value;
  const number = Number(value);
  if (Number.isNaN(number)) return value;

  const isNegative = number < 0;
  const [integerPart, decimalPart] = Math.abs(number).toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = isNegative ? "-" : "";

  return decimalPart !== undefined
    ? `${sign}${formattedInteger}.${decimalPart}`
    : `${sign}${formattedInteger}`;
}

export function operatorSymbol(operation) {
  switch (operation) {
    case "+":
      return "+";
    case "-":
      return "\u2212";
    case "*":
      return "\u00d7";
    case "/":
      return "\u00f7";
    default:
      return "";
  }
}
