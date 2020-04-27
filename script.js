


let dmasValue = undefined;
function calculate(input) {
    dmasValue = scanBidmas(input);
    while(input.length > 1){
        for (let i =0;i < input.length; i++){
            let answer = 0;
            switch (input[i]) {
                //Division
                case '/':
                    if (dmasValue == 0){
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
        console.log(input);
        if (input.includes('(')){
            for (let i =0; i < input.length; i++){
                if (input[i] === '('){
                    let insidebracketArray = input;
                    let insideBrackets = getInsideBrackets(insidebracketArray);
                    
                    if (insideBrackets.includes('(')){
                        const innerInsideBracketLength = insideBrackets.length;
                        insideBracketsAnswer = fullCalculation(insideBrackets)
                        input.splice(i, innerInsideBracketLength);
                        
                    }
                    const insideBracketLength = insideBrackets.length;
                    insideCalculation = calculate(insideBrackets);
                    input.splice(i, insideBracketLength + 1);
                    input[i] = insideCalculation[0];
                    
                }
            }
        }
        else{
            input = calculate(input);
            return input[0];
        }
        
    }
}

let calculation = [18,'*',19,'+',22,'*',33,'/',12];
// 4+(2+(4+(4+1)))+4-(3+2)
let bracketInput = [4, '+', 5, '+', '(', 9, '+', '(',5,'+',4,')', ')', '+', '(', 2, '+', 2, ')'];
//console.log(getInsideBrackets(bracketInput));
console.log(fullCalculation(bracketInput));
