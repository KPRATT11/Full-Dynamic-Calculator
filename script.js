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
        console.log('full input '+ input);
        if (input.includes('(')){
            for (let i =0; i < input.length; i++){
                if (input[i] == '('){
                    let newArray = [];
                    let bracketPos = 0;
                    for (let e = i; e < input.length; e++){
                        //console.log('Bracket Position ' + bracketPos);
                        if (input[e] === ')'){
                            newArray.push(input[e]);
                            //console.log(newArray);
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
                    console.log('before splice ' + input);
                    console.log(newArrayLength);
                    input.splice(i + 1, newArrayLength - 1)
                    console.log('after splice ' + input);
                }
            }
        }
        else{
            console.log('Final Input ' + input);
            input = calculate(input)
            if (input === zeroDivisionError){
                return zeroDivision;
            }
            return input[0]
        }
    }
    return input[0]
}

let calculation = [18,'*',19,'+',22,'*',33,'/',12];
// 4+(2+(4+(4+1)))+4-(3+2)
let bracketInput = ['(',4,'+','(',4,'/','(',4,'+',2,')',')',')','+','(',2, '+', '(',2.2,'/',2,')',')'];
let bracketInput2 = ['(',4,'+',3,')','+',2];
let zeroDivision = [2, '/', 0];
let negativeInputs = [-12,'-',13];
//console.log(getInsideBrackets(bracketInput));
console.log(fullCalculation(negativeInputs));
