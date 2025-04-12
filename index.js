const API_KEY = 'faed791a27ba4ca4b80d4a37dff8f2d9';
const API_URL = 'https://api.currencyfreaks.com/latest';

const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertedAmount = document.getElementById('converted');
const swapBtn = document.getElementById('swap-btn');
const fromRateDisplay = document.getElementById('from-rate');
const toRateDisplay = document.getElementById('to-rate');

// Save/load currency selections and last input
window.addEventListener('load', () => {
  fromCurrency.value = localStorage.getItem('fromCurrency') || 'USD';
  toCurrency.value = localStorage.getItem('toCurrency') || 'JPY';
  amountInput.value = localStorage.getItem('lastAmount') || 1000;
  convertCurrency();
});

const convertCurrency = async () => {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount)) return;

  localStorage.setItem('fromCurrency', fromCurrency.value);
  localStorage.setItem('toCurrency', toCurrency.value);
  localStorage.setItem('lastAmount', amount);

  try {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}&base=${fromCurrency.value}&symbols=${toCurrency.value}`);
    const data = await response.json();

    const rate = parseFloat(data.rates[toCurrency.value]);

    if (isNaN(rate)) throw new Error('Invalid exchange rate');

    const result = amount * rate;
    convertedAmount.value = result.toFixed(2);

    fromRateDisplay.textContent = `1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}`;
    toRateDisplay.textContent = `1 ${toCurrency.value} = ${(1 / rate).toFixed(4)} ${fromCurrency.value}`;
  } catch (error) {
    console.error('Conversion error:', error);
    convertedAmount.value = 'Error';
  }
};

// Swap currencies
swapBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  convertCurrency();
});

// Event listeners
fromCurrency.addEventListener('change', convertCurrency);
toCurrency.addEventListener('change', convertCurrency);
amountInput.addEventListener('input', convertCurrency);
