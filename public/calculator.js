import {
  createInitialState,
  reduce,
  formatNumber,
  operatorSymbol,
} from "./calculator-engine.js";

const expressionEl = document.getElementById("expression");
const outputEl = document.getElementById("output");
const keypad = document.querySelector(".keypad");

let state = createInitialState();

function render() {
  outputEl.dataset.state = state.isError ? "error" : "value";
  outputEl.textContent = state.isError
    ? "Can't divide by 0"
    : formatNumber(state.currentOperand);

  if (state.isError) {
    expressionEl.textContent = "";
  } else {
    expressionEl.textContent = state.previousOperand
      ? `${formatNumber(state.previousOperand)} ${operatorSymbol(state.operation)}`
      : "";
  }

  keypad.querySelectorAll(".key--operator").forEach((button) => {
    const isActive = button.dataset.value === state.operation && state.overwrite;
    button.dataset.active = isActive ? "true" : "false";
  });
}

function dispatch(action) {
  state = reduce(state, action);
  render();
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest(".key");
  if (!button) return;

  dispatch({ type: button.dataset.action, value: button.dataset.value });
});

const keyMap = {
  "+": { type: "operator", value: "+" },
  "-": { type: "operator", value: "-" },
  "*": { type: "operator", value: "*" },
  "/": { type: "operator", value: "/" },
  "%": { type: "percent" },
  Enter: { type: "equals" },
  "=": { type: "equals" },
  Backspace: { type: "delete" },
  Escape: { type: "clear" },
  ".": { type: "decimal" },
};

window.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) {
    dispatch({ type: "number", value: event.key });
    return;
  }

  const mapped = keyMap[event.key];
  if (mapped) {
    event.preventDefault();
    dispatch(mapped);
  }
});

render();
