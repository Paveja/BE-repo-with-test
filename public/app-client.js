const form = document.querySelector("#addition-form");
const firstNumberInput = document.querySelector("#first-number");
const secondNumberInput = document.querySelector("#second-number");
const firstNumberError = document.querySelector("#first-number-error");
const secondNumberError = document.querySelector("#second-number-error");
const formError = document.querySelector("#form-error");
const addButton = document.querySelector("#add-button");
const result = document.querySelector("#result");

const fieldMessages = {
  firstNumber: "Enter a valid first number.",
  secondNumber: "Enter a valid second number.",
};

function clearErrors() {
  for (const [field, input, error] of [
    ["firstNumber", firstNumberInput, firstNumberError],
    ["secondNumber", secondNumberInput, secondNumberError],
  ]) {
    input.removeAttribute("aria-invalid");
    error.textContent = "";
    error.removeAttribute("data-field");
  }

  formError.hidden = true;
  formError.textContent = "";
}

function showFieldErrors(fields) {
  for (const field of fields) {
    const input = field === "firstNumber" ? firstNumberInput : secondNumberInput;
    const error = field === "firstNumber" ? firstNumberError : secondNumberError;

    input.setAttribute("aria-invalid", "true");
    error.textContent = fieldMessages[field];
    error.dataset.field = field;
  }
}

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
  formError.focus();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  const firstNumber = Number(firstNumberInput.value);
  const secondNumber = Number(secondNumberInput.value);
  const fields = [];

  if (firstNumberInput.value.trim() === "" || !Number.isFinite(firstNumber)) {
    fields.push("firstNumber");
  }

  if (secondNumberInput.value.trim() === "" || !Number.isFinite(secondNumber)) {
    fields.push("secondNumber");
  }

  if (fields.length > 0) {
    showFieldErrors(fields);
    showFormError("Check the highlighted field before adding.");
    return;
  }

  addButton.disabled = true;
  addButton.textContent = "Adding…";

  try {
    const response = await fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstNumber, secondNumber }),
    });
    const payload = await response.json();

    if (!response.ok) {
      showFieldErrors(payload.fields ?? []);
      showFormError(payload.message ?? "We could not add those numbers. Try again.");
      return;
    }

    result.textContent = String(payload.sum);
  } catch (error) {
    console.error("Addition request failed", error);
    showFormError("We could not reach the calculator. Try again.");
  } finally {
    addButton.disabled = false;
    addButton.textContent = "Add numbers";
  }
});
