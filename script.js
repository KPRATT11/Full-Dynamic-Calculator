let displayTextString = '';
let modeError = false;

console.log('hey');
//Get access to the main calculators display 
const display = document.querySelector('.results');
const displayText = document.querySelector('.results p')

//Get acess to all the buttons, buttons that are functions eg ones that 
//Should not be displayed on the screen have a class of function 
//attatched to them
const buttons = document.querySelectorAll('.button');

let bracketCount = 0;
for (let i =0; i < buttons.length; i++){
    
    let currentInput = [];
    buttons[i].addEventListener('click', function(){
        if (modeError == true){
            displayTextString = '';
            displayText.textContent = displayTextString;
            modeError = false;
        }
        resizeText(displayText)
        displayTextString = displayText.textContent;

        if (buttons[i].classList == 'button function'){
            buttonFunction(buttons[i]);
        }
        else if (buttons[i].classList == 'button operator'){
            displayTextArray = displayTextString.split('')
            if (displayTextArray[displayTextArray.length - 1] === '+' || 
                displayTextArray[displayTextArray.length - 1] === "\u00F7" ||
                displayTextArray[displayTextArray.length - 1] === "\u00D7" ||
                displayTextArray[displayTextArray.length - 1] === "\u2212") {
                displayTextArray[displayTextArray.length - 1] = buttons[i].textContent;
                displayTextString = displayTextArray.join('')
            }
            else{
                displayTextString = displayTextString.concat(buttons[i].textContent)
            }
            
            displayText.textContent = displayTextString;
        }
        else{
            displayTextString = displayTextString.concat(buttons[i].textContent)
            displayText.textContent = displayTextString;
            
            //Checks for brackets and uses the count to add a psudeo bracket to the end
            if (buttons[i].getAttribute('id') === '('){
                bracketCount ++;
            }
            else if (buttons[i].getAttribute('id') === ')'){
                bracketCount --;
            }
        }
        
    })
}


function resizeText(displayText) {
    if (displayText.textContent.length < 10) {
        displayText.style.paddingTop = '20px'
        displayText.style.fontSize = '3em';
    }
    else if (displayText.textContent.length >= 10 && displayText.textContent.length <= 16){
        displayText.style.fontSize = '2em';
        displayText.style.paddingTop = '40px'
    }

    else if (displayText.textContent.length > 17 && displayText.textContent.length < 23) {
        displayText.style.fontSize = '1.5em';
        displayText.style.paddingTop = '50px'
    }

    else if (displayText.textContent.length >= 24) {
        displayText.style.fontSize = '1em';
        displayText.style.paddingTop = '60px'
    }
}


let calculationAnswer = undefined;
function buttonFunction(button) {
    let buttonId = button.getAttribute('id');
    switch (buttonId) {
        case 'delete':
            displayTextString = displayTextString.slice(0, displayTextString.length - 1)
            displayText.textContent = displayTextString;
            break;

        case 'clear':
            displayTextString = '';
            displayText.textContent = displayTextString;
            break;

        case 'P-N':
            convertDisplayToNegative(displayTextString);
            break;

        case 'submit':
            if (bracketCount > 0){
                for (let i = bracketCount; i > 0; i--){
                    displayTextString = displayTextString.concat(')')
                    console.log('clllose');
                }
            }
            console.log(bracketCount);
            let calculationInput = stringToCalculate(displayTextString);
            calculationAnswer = fullCalculation(calculationInput);
            if (calculationAnswer == zeroDivisionError || calculationAnswer == infiniteLoopError){
                modeError = true;
            }
            else{
                modeError = false;
            }
            bracketCount = 0;
            displayText.textContent = calculationAnswer;
            resizeText(displayText);
            break;
        default:
            break;
    }
}


function convertDisplayToNegative(displayTextString) {
    displayArray = displayTextString.split("");
    for (let i = displayArray.length - 1; i > 0; i--){
        if (displayArray[i] === '-'){
            displayArray.splice(i, 1)
            break;
        }
        else if (displayArray[i] === '+' || 
            displayArray[i] === "\u00F7" ||
            displayArray[i] === "\u00D7" ||
            displayArray[i] === "\u2212"){ //update with all characters
            displayArray.splice(i + 1, 0, "-");
            break;
        
        
        } 
        else if (i === 1 && displayArray[i - 1] != '-'){
            displayArray.unshift('-')
        }

        else if (i === 1 && displayArray[i - 1] === '-'){
            displayArray.splice(i - 1, 1);
        }

    }

    if (displayArray.length === 0) {
        displayArray = ['-']
    }
    displayTextString = displayArray.join('');
    displayText.textContent = displayTextString;
    return;
}


let calculationArray = [];
function stringToCalculate(str) {
    calculationArray = [];
    let currentArray = [];
    strArray = str.split('')
    for (let i =0; i < strArray.length; i++){
        switch (strArray[i]) {
            case '+':
                calculationArray = pushPrevious('+', currentArray, calculationArray);
                currentArray = [];
                break;
            
            case "\u00F7":
                calculationArray = pushPrevious('/', currentArray, calculationArray);
                currentArray = [];
                break;

            case "\u00D7":
                calculationArray = pushPrevious('*', currentArray, calculationArray)
                currentArray = [];
                break;

            case '\u2212':
                calculationArray = pushPrevious('-', currentArray, calculationArray)
                currentArray = [];
                break;

            case '(':
                if (currentArray.length > 0) {
                    calculationArray = pushPrevious('(', currentArray, calculationArray);  
                }
                else{
                    calculationArray.push('(')
                }
                currentArray = [];
                break;

            case ')':
                if (currentArray.length > 0) {
                    calculationArray = pushPrevious(')', currentArray, calculationArray);  
                }
                else{
                    calculationArray.push(')')
                }
                currentArray = [];
                break;

            default:
                currentArray.push(strArray[i]);
                break;
        }
        
    }
    if (currentArray.length > 0){
        calculationArray.push(condenseToNumber(currentArray));
    }
    return calculationArray;
}

function pushPrevious(symbol, currentArray, calculationArray) {
    if (currentArray.length === 0){
        
    }
    else {
        calculationArray.push(condenseToNumber(currentArray));
    }
    calculationArray.push(symbol)
    currentArray = [];
    return calculationArray;
}

function condenseToNumber(array) {
    let tmp = array.join('')
    tmp = parseFloat(tmp)
    return tmp;
}


const zeroDivisionError = 'Cannot Divide By Zero';
const infiniteLoopError = 'Error'

//calculate Individual Results
let dmasValue = undefined;
function calculate(input) {
    dmasValue = scanBidmas(input);
    while(input.length > 1){
        for (let i =0;i < input.length; i++){
            let answer = 0;
            switch (input[i]) {
                //Division
                case '/':
                    if (input[i - 1] === 0 || input[i + 1] === 0){
                        return zeroDivisionError
                    }
                    else if (dmasValue == 0){
                        answer = input[i - 1] / input[i + 1]
                        input.splice(i - 1, 2)
                        input[i - 1] = answer
                        dmasValue = scanBidmas(input)
                        break;
                    }
                    

                
                //Multiplication
                case '*':
                    if (dmasValue == 1){
                        answer = input[i - 1] * input[i + 1]
                        input.splice(i - 1, 2)
                        input[i - 1] = answer
                        dmasValue = scanBidmas(input)
                        break;
                    }
                    
                    
                //Addition
                case '+':
                    if (dmasValue == 2){
                        answer = input[i - 1] + input[i + 1]
                        input.splice(i - 1, 2)
                        input[i - 1] = answer
                        dmasValue = scanBidmas(input)
                        break;
                    }
                    

                
                //Subtraction
                case '-':
                    if (dmasValue == 3){
                        answer = input[i - 1] - input[i + 1]
                        input.splice(i - 1, 2)
                        input[i - 1] = answer
                        dmasValue = scanBidmas(input)
                        break;
                    }
                    
            }
        }
    }
    return input;
    
}



//takes an array and returns the current position of bidmas the array contains
function scanBidmas(input) {
    let dmasValue = 0;

    if (input.includes('/')){
        return dmasValue;
    }
    else{
        dmasValue ++;
    }

    if (input.includes('*')){
        return dmasValue;
    }
    else{
        dmasValue ++;
    }

    if (input.includes('+')){
        return dmasValue;
    }
    else{
        dmasValue ++;
    }

    return dmasValue;
}



function getInsideBrackets(input) {
    if (input.includes('(')){
        let returnArray = [];
        let bracketPos = 0;
        let foundBracket = false;
        for (let i =0; i < input.length; i++){
            if (input[i] === '('){
                bracketPos ++;
                foundBracket = true;
            }
            else if (input[i] === ')'){
                bracketPos --;
            }

            if (bracketPos >= 1 && (input[i] !== '(' || bracketPos > 1)){
                returnArray.push(input[i]);
            }

            if (foundBracket === true && bracketPos === 0){
                return returnArray;
            }
        }

        return input;


    }
    else{
        return input;
    }
}


function fullCalculation(input) {
    while (input.length > 1){
        if (input.includes(zeroDivisionError)){
            input = zeroDivisionError
        }

        else if (input === zeroDivisionError){
            return zeroDivisionError
        }
        if (input.includes('(')){
            for (let i =0; i < input.length; i++){
                if (input[i] == '('){
                    let newArray = [];
                    let bracketPos = 0;
                    for (let e = i; e < input.length; e++){
                        if (input[e] === ')'){
                            newArray.push(input[e]);
                            bracketPos -= 1;
                            if (bracketPos == 0){
                                break;
                            }
                        }
                        else if (input[e] === '(') {
                            newArray.push(input[e]);
                            bracketPos += 1;
                        }
                        else {
                            newArray.push(input[e]);
                        }
                    }
                    const newArrayLength = newArray.length;
                    newArray = getInsideBrackets(newArray)
                    answer = fullCalculation(newArray);
                    input[i] = answer;
                    input.splice(i + 1, newArrayLength - 1)
                }
            }
        }
        else{
            input = calculate(input)
            if (input === zeroDivisionError){
                return zeroDivisionError;
            }
            return input[0]
        }
    }
    return input[0]
}


