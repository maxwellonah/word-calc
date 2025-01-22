const display = document.getElementById('display');
const wordDisplay = document.getElementById('wordDisplay');
let currentNumber = '';
let previousNumber = '';
let operator = null;

const numberWords = {
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
  '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
  '+': 'Plus', '-': 'Minus', '*': 'Multiply', '/': 'Divide',
  '=': 'Equals', '^': 'Power', '!': 'Factorial'
};

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

const scales = [
  '', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'
];

function numberToWords(num) {
  // Handle negative numbers
  if (num < 0) {
    return 'Negative ' + numberToWords(Math.abs(num));
  }

  // Handle decimal numbers
  if (num % 1 !== 0) {
    const parts = num.toString().split('.');
    return numberToWords(parseInt(parts[0])) + ' Point ' + 
           parts[1].split('').map(digit => ones[parseInt(digit)]).join(' ');
  }

  // Convert to string and handle larger numbers
  const numStr = Math.floor(num).toString();
  
  // Handle zero
  if (numStr === '0') return 'Zero';

  // Split number into groups of three
  const groups = [];
  for (let i = numStr.length; i > 0; i -= 3) {
    groups.unshift(numStr.slice(Math.max(0, i - 3), i));
  }

  function convertGroup(n) {
    let result = '';
    n = parseInt(n);
    
    // Handle hundreds
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n > 0) result += ' and ';
    }
    
    // Handle tens
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

  // Process all groups with their respective scales
  const parts = [];
  let hasNonZeroAfter = false;

  // First pass to check for non-zero values
  for (let i = groups.length - 1; i >= 0; i--) {
    if (parseInt(groups[i]) !== 0) {
      hasNonZeroAfter = true;
      break;
    }
  }

  // Second pass to build the words
  groups.forEach((group, index) => {
    const groupNum = parseInt(group);
    if (groupNum === 0) return;
    
    let part = convertGroup(groupNum);
    const scale = scales[groups.length - 1 - index];
    
    if (scale) {
      part += ' ' + scale;
    }

    // Add comma if not the last non-zero group
    if (hasNonZeroAfter) {
      part += ', ';
    }

    parts.push(part);
    hasNonZeroAfter = false;

    // Check remaining groups for non-zero values
    for (let i = index + 1; i < groups.length; i++) {
      if (parseInt(groups[i]) !== 0) {
        hasNonZeroAfter = true;
        break;
      }
    }
  });

  // Join all parts and handle final formatting
  let result = parts.join('');
  
  // Remove trailing comma and space if present
  result = result.replace(/,\s*$/, '');
  
  // Add 'and' before the last number if it's less than 100
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
    if (n === 0 || n === 1) { 
      return 1;
    } 
    return n * factorial(n - 1);
  }
  if (operator === '^') {
    result = Math.pow(num1, num2);
  } else {
    switch(operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      default: return;
    }
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

//Okereafor Samuel Logical NOT
function logicalNot() {
  if (currentNumber === '') return;
  const num = parseInt(currentNumber);
  const result = ~num; // Bitwise NOT operation
  currentNumber = result.toString();
  updateDisplay();
}


// function to select random number from 0.0 through 1.0
function generateRandomNumber() {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();
  currentNumber = randomNumber.toString();
  updateDisplay();
}
