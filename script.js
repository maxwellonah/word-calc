const display = document.getElementById('display');
const wordDisplay = document.getElementById('wordDisplay');
let currentNumber = '';
let previousNumber = '';
let operator = null;

const numberWords = {
  // '0': 'Zero',
  // '1': 'One',
  // '2': 'Two',
  // '3': 'Three',
  // '4': 'Four',
  // '5': 'Five',
  // '6': 'Six',
  // '7': 'Seven',
  // '8': 'Eight',
  // '9': 'Nine',
  // '+': 'Plus',
  // '-': 'Minus',
  // '*': 'Multiply',
  // '/': 'Divide',
  // '=': 'Equals'
};

function appendNumber(number) {
  currentNumber += number;
  updateDisplay();
}

function setOperator(op) {
  if (currentNumber === '') return;
  if (previousNumber !== '') calculate();
  operator = op;
  previousNumber = currentNumber;
  currentNumber = '';
  updateDisplay();
}

function calculate() {
  if (currentNumber === '' || previousNumber === '' || !operator) return;
  const result = eval(`${previousNumber} ${operator} ${currentNumber}`);
  currentNumber = result.toString();
  previousNumber = '';
  operator = null;
  updateDisplay();
}

function clearDisplay() {
  currentNumber = '';
  previousNumber = '';
  operator = null;
  updateDisplay();
}

function updateDisplay() {
  display.value = previousNumber + (operator || '') + currentNumber;
  const words = display.value.split('').map(char => numberWords[char] || char).join(' ');
  wordDisplay.textContent = words || 'Words will appear here';
}