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
        throw new Error("Division by zero! Nice try, but you can't break the laws of mathematics. 😏");
    }
    return a / b;
}

// Operation function
function operate(operator, a, b) {
    switch(operator) {
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

const display = document.querySelector('.display');

// Update display
function updateDisplay(value) {
    display.textContent = value;
}

// Handle digit input
function inputDigit(digit) {
    if (shouldResetDisplay) {
        // When result is displayed and user enters a new digit, start fresh
        displayValue = '0';
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        shouldResetDisplay = false;
    }
    
    if (waitingForSecondNumber) {
        displayValue = digit;
        waitingForSecondNumber = false;
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
    }
    
    if (waitingForSecondNumber) {
        displayValue = '0.';
        waitingForSecondNumber = false;
    } else if (displayValue.indexOf('.') === -1) {
        displayValue += '.';
    }
    updateDisplay(displayValue);
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    // If display contains non-numeric value (like error message), don't proceed
    if (isNaN(inputValue)) {
        return;
    }
    
    // Reset shouldResetDisplay flag when operator is pressed
    // (allows continuing calculation after equals)
    shouldResetDisplay = false;
    
    // If we already have an operator and user presses another operator consecutively,
    // just update the operator without evaluating
    if (operator && waitingForSecondNumber) {
        // Consecutive operator presses - just update the operator
        operator = nextOperator;
        return;
    }
    
    if (firstNumber === null) {
        firstNumber = inputValue;
    } else if (operator) {
        // We have both numbers and an operator - evaluate before applying new operator
        try {
            const result = operate(operator, firstNumber, inputValue);
            
            // Round to avoid overflow
            const roundedResult = Math.round(result * 100000000) / 100000000;
            
            displayValue = String(roundedResult);
            updateDisplay(displayValue);
            firstNumber = roundedResult;
        } catch (error) {
            // Handle division by zero
            updateDisplay(error.message);
            // Reset calculator state
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;
            shouldResetDisplay = true;
            return;
        }
    }
    
    waitingForSecondNumber = true;
    operator = nextOperator;
}

// Handle equals
function handleEquals() {
    if (firstNumber === null || operator === null || waitingForSecondNumber) {
        // Don't evaluate if we don't have all necessary values
        return;
    }
    
    const inputValue = parseFloat(displayValue);
    
    try {
        const result = operate(operator, firstNumber, inputValue);
        
        // Round to avoid overflow
        const roundedResult = Math.round(result * 100000000) / 100000000;
        
        displayValue = String(roundedResult);
        updateDisplay(displayValue);
        
        // Reset state
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        shouldResetDisplay = true;
    } catch (error) {
        // Handle division by zero
        updateDisplay(error.message);
        // Reset calculator state
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        shouldResetDisplay = true;
    }
}

// Handle backspace
function handleBackspace() {
    // Don't allow backspace if we're in the middle of an operation waiting for second number
    // or if display shows an error message
    const inputValue = parseFloat(displayValue);
    if (waitingForSecondNumber || isNaN(inputValue)) {
        return;
    }
    
    // If display is being reset (after equals), don't allow backspace
    if (shouldResetDisplay) {
        return;
    }
    
    // Remove last character, or set to "0" if only one character remains
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
});

