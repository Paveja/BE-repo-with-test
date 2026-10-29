const form = document.querySelector('#addition-form');
const firstNumber = document.querySelector('#first-number');
const secondNumber = document.querySelector('#second-number');
const result = document.querySelector('#result');
const equation = document.querySelector('#equation');
const status = document.querySelector('#result-status');
const message = document.querySelector('#form-message');

const formatNumber = (value) => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(10)));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.textContent = '';

  const first = Number(firstNumber.value);
  const second = Number(secondNumber.value);
  const firstMissing = firstNumber.value.trim() === '';
  const secondMissing = secondNumber.value.trim() === '';

  if (firstMissing || secondMissing || !Number.isFinite(first) || !Number.isFinite(second)) {
    message.textContent = firstMissing || !Number.isFinite(first)
      ? 'Enter a valid first number to continue.'
      : 'Enter a valid second number to continue.';
    result.textContent = '—';
    equation.textContent = 'Your answer will appear here';
    status.textContent = 'Waiting';
    (firstMissing || !Number.isFinite(first) ? firstNumber : secondNumber).focus();
    return;
  }

  const sum = first + second;
  result.textContent = formatNumber(sum);
  equation.textContent = `${formatNumber(first)} + ${formatNumber(second)}`;
  status.textContent = 'Calculated';
});

form.addEventListener('reset', () => {
  message.textContent = '';
  result.textContent = '—';
  equation.textContent = 'Your answer will appear here';
  status.textContent = 'Waiting';
});
