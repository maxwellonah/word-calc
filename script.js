const display = document.getElementById('display');
const wordDisplay = document.getElementById('wordDisplay');
let currentNumber = '';
let previousNumber = '';
let operator = null;

const numberWords = {
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
  '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
  '+': 'Plus', '-': 'Minus', '*': 'Multiply', '/': 'Divide',
  '=': 'Equals', '^': 'Power', '!': 'Factorial', 'sin': 'Sine'
};

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

const scales = [
  '', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'
];

function numberToWords(num) {
  if (num < 0) return 'Negative ' + numberToWords(Math.abs(num));

  if (num % 1 !== 0) {
    const parts = num.toString().split('.');
    return numberToWords(parseInt(parts[0])) + ' Point ' + 
           parts[1].split('').map(digit => ones[parseInt(digit)]).join(' ');
  }

  const numStr = Math.floor(num).toString();
  if (numStr === '0') return 'Zero';

  const groups = [];
  for (let i = numStr.length; i > 0; i -= 3) {
    groups.unshift(numStr.slice(Math.max(0, i - 3), i));
  }

  function convertGroup(n) {
    let result = '';
    n = parseInt(n);
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n > 0) result += ' and ';
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += '-' + ones[n];
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += ones[n];
    }
    return result;
  }

  const parts = [];
  let hasNonZeroAfter = false;

  for (let i = groups.length - 1; i >= 0; i--) {
    if (parseInt(groups[i]) !== 0) {
      hasNonZeroAfter = true;
      break;
    }
  }

  groups.forEach((group, index) => {
    const groupNum = parseInt(group);
    if (groupNum === 0) return;
    
    let part = convertGroup(groupNum);
    const scale = scales[groups.length - 1 - index];
    
    if (scale) {
      part += ' ' + scale;
    }

    if (hasNonZeroAfter) {
      part += ', ';
    }

    parts.push(part);
    hasNonZeroAfter = false;

    for (let i = index + 1; i < groups.length; i++) {
      if (parseInt(groups[i]) !== 0) {
        hasNonZeroAfter = true;
        break;
      }
    }
  });

  let result = parts.join('');
  result = result.replace(/,\s*$/, '');

  const lastGroup = parseInt(groups[groups.length - 1]);
  if (groups.length > 1 && lastGroup > 0 && lastGroup < 100 && !result.endsWith('and')) {
    result = result.replace(/,([^,]*)$/, ' and$1');
  }

  return result;
}

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
  
  let result;
  const num1 = parseFloat(previousNumber);
  const num2 = parseFloat(currentNumber);

  function factorial(n) { 
    return n === 0 || n === 1 ? 1 : n * factorial(n - 1);
  }

  switch (operator) {
    case '+': result = num1 + num2; break;
    case '-': result = num1 - num2; break;
    case '*': result = num1 * num2; break;
    case '/': result = num1 / num2; break;
    case '^': result = Math.pow(num1, num2); break;
    default: return;
  }

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

  let words;
  if (operator) {
    words = numberToWords(parseFloat(previousNumber)) + ' ' + 
            numberWords[operator] + ' ' +
            (currentNumber ? numberToWords(parseFloat(currentNumber)) : '');
  } else if (currentNumber) {
    words = numberToWords(parseFloat(currentNumber));
  } else {
    words = 'Zero';
  }

  wordDisplay.textContent = words;
}

// Logical NOT function
function logicalNot() {
  if (currentNumber === '') return;
  const num = parseInt(currentNumber);
  const result = ~num;
  currentNumber = result.toString();
  updateDisplay();
}

// Function to generate a random number between 0 and 1
function generateRandomNumber() {
  currentNumber = Math.random().toString();
  updateDisplay();
}

// Function to calculate the cube root of the current number
function cubeRoot() {
  if (currentNumber === '') return;
  const num = parseFloat(currentNumber);
  currentNumber = Math.cbrt(num).toString();
  updateDisplay();
}

// Function to calculate sin
function calculateSin() {
  if (currentNumber === '') return;
  const num = parseFloat(currentNumber);
  const result = Math.sin(num * (Math.PI / 180)).toFixed(6); // Convert degrees to radians
  currentNumber = result.toString();
  updateDisplay();
}

// Add "Cube Root" and "Sine" to the numberWords object
numberWords['cbrt'] = 'Cube Root';
numberWords['sin'] = 'Sine';
