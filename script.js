const display = document.getElementById('display');
const wordDisplay = document.getElementById('wordDisplay');
let currentNumber = '';
let previousNumber = '';
let operator = null;

const numberWords = {
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
  '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
  '+': 'Plus', '-': 'Minus', '*': 'Multiply', '/': 'Divide',
  '=': 'Equals', '^': 'Power'
};

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

// Define large number scales
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

  // Convert each group
  function convertGroup(n) {
    let result = '';
    n = parseInt(n);
    
    // Handle hundreds
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    // Handle tens
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      n = 0;
    }
    
    // Handle ones
    if (n > 0) {
      result += ones[n] + ' ';
    }
    
    return result;
  }

  // Process all groups with their respective scales
  const words = groups.map((group, index) => {
    const groupNum = parseInt(group);
    if (groupNum === 0) return '';
    const scale = scales[groups.length - 1 - index];
    return convertGroup(group) + (scale ? scale + ' ' : '');
  }).filter(word => word !== '');

  return words.join('').trim();
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