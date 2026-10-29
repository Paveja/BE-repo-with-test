const form = document.querySelector("#addition-form");
const firstNumber = document.querySelector("#first-number");
const secondNumber = document.querySelector("#second-number");
const result = document.querySelector("#result");
const resultPanel = document.querySelector(".result-panel");
const addButton = document.querySelector("#add-button");

function setFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

function formatResult(value) {
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString(undefined, { maximumFractionDigits: 12 });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setFieldError(firstNumber, "");
  setFieldError(secondNumber, "");
  resultPanel.classList.remove("is-success");
  result.textContent = "—";

  const firstValue = firstNumber.value.trim();
  const secondValue = secondNumber.value.trim();
  let hasError = false;

  if (!firstValue || !Number.isFinite(Number(firstValue))) {
    setFieldError(firstNumber, "Enter a valid number.");
    hasError = true;
  }

  if (!secondValue || !Number.isFinite(Number(secondValue))) {
    setFieldError(secondNumber, "Enter a valid number.");
    hasError = true;
  }

  if (hasError) {
    const firstError = firstNumber.getAttribute("aria-invalid") === "true";
    (firstError ? firstNumber : secondNumber).focus();
    return;
  }

  addButton.disabled = true;
  result.textContent = formatResult(Number(firstValue) + Number(secondValue));
  resultPanel.classList.add("is-success");
  addButton.disabled = false;
});
