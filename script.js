'use strict';

class Calculator {
  constructor(previousOperandText, currentOperandText) {
    this.previousOperandText = previousOperandText;
    this.currentOperandText = currentOperandText;
    this.isRewrite = false;
    this.clear();
  }
  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.isRewrite = false;
  }
  delete() {
    if (this.currentOperand === '0.') {
      this.currentOperand = '';
    }
    else if (this.currentOperand === '-0.') {
      this.currentOperand = '-';
    }
    else {
    this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }
  }
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    else if (this.isRewrite) {
      this.currentOperand = '';
      this.isRewrite = false;
    }
    if (number === '.' && this.currentOperand === '-') {
      this.currentOperand = '-0.'
    }
    else if (number === '.' && this.currentOperand === '') {
      this.currentOperand = '0.'
    }
    else {
    this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }
  chooseOperation(operation) {
    if (this.currentOperand === '' && operation !== '-') return;
    else if (this.currentOperand === '-') return;
    else if (this.currentOperand === '' && operation === '-') {
      this.currentOperand = '-';
      return;
    }
    if (this.previousOperand !== '') {
      this.compute();
    };
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    if (operation === '√') {
      this.compute();
    }
  }
  compute() {
    let computation;
    let currentOperation = this.operation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (!(isNaN(prev)) && currentOperation === '√') {
      computation = Math.sqrt(prev);
      this.isRewrite = true;
    }
    else if (isNaN(prev) || isNaN(current)) return;
    else {
      switch(currentOperation) {
        case '+':
          computation = prev + current;
          break;
        case '-':
          computation = prev - current;
          break;
        case '*':
          computation = prev * current;
          break;
        case '÷':
          computation = prev / current;
          break;
        case '^':
          computation = Math.pow(prev, current);
          break;
        default:
          return;
      }
    }
    if (currentOperation === '÷' || currentOperation === '^' || currentOperation === '√') {
      this.currentOperand = computation;
    }
    else {
      this.currentOperand = this.fixFraction(prev, current, currentOperation, computation);
    }
    this.operation = undefined;
    this.previousOperand = '';
  }
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    }
    else {
      integerDisplay = integerDigits.toLocaleString('ru-RU', {maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    }
    else {
      return integerDisplay;
    }
  }
  updateDisplay() {
    if (this.currentOperand === '-') {
      this.currentOperandText.innerText = this.currentOperand;
    }
    else if (isNaN(this.currentOperand) && this.currentOperand !== '.' && this.currentOperand !== '-') {
      this.currentOperandText.innerText = 'Incorrect operation';
    }
    else {
      this.currentOperandText.innerText = this.getDisplayNumber(this.currentOperand);
    }
    if (this.operation != null) {
      this.previousOperandText.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    }
    else {
      this.previousOperandText.innerText = '';
    }
  }
  fixFraction(prevOperand, currOperand, operation, result) {
    let fixedNumber;
    let count1 = 0;
    let count2 = 0;
    prevOperand = prevOperand.toString();
    currOperand = currOperand.toString();
    if (prevOperand.match(/\./)) {
      let indexDecimal = prevOperand.toString().indexOf('.');
      for (let i = indexDecimal; i < prevOperand.length - 1; i++) {
        count1++;
      }
    }
    if (currOperand.match(/\./)) {
    let indexDecimal = currOperand.toString().indexOf('.');
      for (let i = indexDecimal; i < currOperand.length - 1; i++) {
        count2++;
      }
    }
    if (operation === '+') {
      fixedNumber = count1 > count2 ? count1 : count2;
    } else if (operation === '-') {
      fixedNumber = count1 > count2 ? count1 : count2;
    } else if (operation === '*') {
      fixedNumber = count1 + count2;
    }
    
    let num = result.toFixed(fixedNumber);
    if (num.match(/\./)) {
      for (let i = num.length - 1;; i--) {
        if (num[i] === '0') {
          num = num.slice(0, num.length - 1);
        } else {
          break;
        }
      }
    }
    if (num[num.length - 1] === '.') {
      num = num.slice(0, num.length - 1);
    }
    return num;
  }
}

const previousOperandText = document.querySelector('[data-previous-operand]');
const currentOperandText = document.querySelector('[data-current-operand]');
const allClearBtn = document.querySelector('[data-all-clear]');
const deleteBtn = document.querySelector('[data-delete]');
const operationBtns = document.querySelectorAll('[data-operation]');
const numberBtns = document.querySelectorAll('[data-number]');
const equalsBtn = document.querySelector('[data-equals]');

const calculator = new Calculator(previousOperandText, currentOperandText);

numberBtns.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay();
  })
})
operationBtns.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
})
equalsBtn.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    calculator.isRewrite = true;
})
allClearBtn.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
})
deleteBtn.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
})
