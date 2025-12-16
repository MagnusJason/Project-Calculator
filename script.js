// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

// Normalize operator symbols
function normalizeOperator(op) {
    const operatorMap = {
        '÷': '/',
        '×': '*',
        '−': '-',
        '+': '+'
    };
    return operatorMap[op] || op;
}

// Get display operator symbol
function getDisplayOperator(op) {
    const displayMap = {
        '/': '÷',
        '*': '×',
        '-': '−',
        '+': '+'
    };
    return displayMap[op] || op;
}

// Operation function
function operate(operator, a, b) {
    const normalizedOp = normalizeOperator(operator);
    switch(normalizedOp) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return null;
    }
}

// Calculator state
let displayValue = '0';
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let shouldResetDisplay = false;

const displayResult = document.querySelector('.display-result');
const displayPreview = document.querySelector('.display-preview');

// Update display
function updateDisplay(value) {
    displayResult.textContent = value;
}

// Update preview
function updatePreview(text) {
    displayPreview.textContent = text || '';
}

// Handle digit input
function inputDigit(digit) {
    if (shouldResetDisplay) {
        displayValue = '0';
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        shouldResetDisplay = false;
        updatePreview('');
    }
    
    if (waitingForSecondNumber) {
        displayValue = digit;
        waitingForSecondNumber = false;
        updatePreview('');
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay(displayValue);
}

// Handle decimal point
function inputDecimal() {
    if (shouldResetDisplay) {
        displayValue = '0';
        shouldResetDisplay = false;
        updatePreview('');
    }
    
    if (waitingForSecondNumber) {
        displayValue = '0.';
        waitingForSecondNumber = false;
        updatePreview('');
    } else if (displayValue.indexOf('.') === -1) {
        displayValue += '.';
    }
    updateDisplay(displayValue);
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (isNaN(inputValue)) {
        return;
    }
    
    shouldResetDisplay = false;
    const normalizedOperator = normalizeOperator(nextOperator);
    
    if (operator && waitingForSecondNumber) {
        operator = normalizedOperator;
        updatePreview(firstNumber + ' ' + getDisplayOperator(normalizedOperator));
        return;
    }
    
    if (firstNumber === null) {
        firstNumber = inputValue;
    } else if (operator) {
        try {
            const result = operate(operator, firstNumber, inputValue);
            const roundedResult = Math.round(result * 100000000) / 100000000;
            
            displayValue = String(roundedResult);
            updateDisplay(displayValue);
            firstNumber = roundedResult;
        } catch (error) {
            updateDisplay(error.message);
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;
            shouldResetDisplay = true;
            updatePreview('');
            return;
        }
    }
    
    waitingForSecondNumber = true;
    operator = normalizedOperator;
    updatePreview(displayValue + ' ' + getDisplayOperator(normalizedOperator));
}

// Handle equals
function handleEquals() {
    if (firstNumber === null || operator === null || waitingForSecondNumber) {
        return;
    }
    
    const inputValue = parseFloat(displayValue);
    
    try {
        const result = operate(operator, firstNumber, inputValue);
        const roundedResult = Math.round(result * 100000000) / 100000000;
        
        // Show calculation in preview
        updatePreview(firstNumber + ' ' + getDisplayOperator(operator) + ' ' + inputValue);
        
        displayValue = String(roundedResult);
        updateDisplay(displayValue);
        
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        shouldResetDisplay = true;
    } catch (error) {
        updateDisplay(error.message);
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        shouldResetDisplay = true;
        updatePreview('');
    }
}

// Handle percentage
function handlePercentage() {
    const value = parseFloat(displayValue);
    if (!isNaN(value)) {
        displayValue = String(value / 100);
        updateDisplay(displayValue);
        shouldResetDisplay = true;
    }
}

// Handle backspace
function handleBackspace() {
    const inputValue = parseFloat(displayValue);
    if (waitingForSecondNumber || isNaN(inputValue) || shouldResetDisplay) {
        return;
    }
    
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay(displayValue);
}

// Handle clear
function handleClear() {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    shouldResetDisplay = false;
    updateDisplay(displayValue);
    updatePreview('');
}

// Handle parentheses (placeholder - not implemented in basic calculator)
function handleParentheses() {
    // Placeholder for future implementation
    console.log('Parentheses functionality not yet implemented');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Digit buttons
    document.querySelectorAll('.digit').forEach(button => {
        button.addEventListener('click', () => {
            inputDigit(button.textContent);
        });
    });
    
    // Operator buttons
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            handleOperator(button.textContent);
        });
    });
    
    // Equals button
    document.querySelector('.equals').addEventListener('click', handleEquals);
    
    // Clear button
    document.querySelector('.clear').addEventListener('click', handleClear);
    
    // Backspace button
    document.querySelector('.backspace').addEventListener('click', handleBackspace);
    
    // Decimal button
    document.querySelector('.decimal').addEventListener('click', inputDecimal);
    
    // Percentage button
    document.querySelector('.percentage').addEventListener('click', handlePercentage);
    
    // Parentheses button
    document.querySelector('.parentheses').addEventListener('click', handleParentheses);
});
