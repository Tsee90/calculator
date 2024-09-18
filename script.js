let firstNum = '';
let secondNum = '';
let operator = null;
let isCalc = false; //True if we are in a chain of calculations

//Add even listener to all buttons which returns text inside button when clicked
const btnList = document.querySelectorAll('button');
btnList.forEach(btn => btn.addEventListener('click', (e) => btnClick(e.target.textContent)));

const display = document.querySelector('.display');

//btnClick determines what to do based on the button text of the button that was clicked and the overall state of the global variables
function btnClick(e) {
    //Checks if button text is integer or '.'
    //If true it will attempt to update variables and display
    if (!isNaN(parseInt(e)) || e === '.'){
        //Checks if operator variable has been assigned
        //If operator is null, then we proceed with assigning firstNum variable
        //If operator is not null, then we move on to see if secondNum is being attempted to be changed
        if (operator === null){
            //isCalc checks if we are in a chain or if no prior calculations have been done
            //If true, we must clear calculator to continue, otherwise we will attempt to change firstNum when it is not empty and not needing to be changed
            if(isCalc){
                clear();
            }
            //Checks and disallows for starting numbers with 0 (ex. 001) and multiple '.' (ex. 1.02.3)
            if (firstNum === '' && e === '0' || firstNum.includes('.') && e === '.'){
                flicker();
            //All conditions for assigning or addending firstNum satisfied
            }else {
                //Checks and adds 0 infront of empty '.'(ex. 0.1 for readability)
                if(firstNum === '' && e === '.'){
                    firstNum = '0';
                }
                //Add to end of firstNum
                firstNum += e;
                display.innerText = firstNum;
                checkOverflow();
            }
        //Checks for double '.' in secondNum
        }else if(!secondNum.includes('.') || e !== '.'){
            //Checks and adds 0 infront of empty '.'(ex. 0.1 for readability)
            if(secondNum === '' && e === '.'){
                secondNum = '0';
            }
            //Add to end of secondNum 
            secondNum += e;
            display.innerText = secondNum;
            checkOverflow();
        //Invalid input will flicker display
        }else{
            flicker();
        }
    //When button text is not integer or '.' we move into else
    }else{
        //Switch check for 'C' and '=', all other inputs are operators which are handled by operate()
        switch(e) {
            case 'C':
                clear();
                break;
            case '=':
                //Button will not work if any variable is missing
                if(firstNum === '' || secondNum === '' || operator === null){
                    flicker();
                    break;
                }else{
                    operate(firstNum, secondNum, operator);
                    break;
                }
            //All default buttons are operators
            default:
                //Checks if operator variable is assigned and first num is empty
                //If true it will update the operator to the selected button text
                if(operator === null && firstNum !== ''){
                    operator = e;
                    display.innerText = e;
                    break;
                //If all variables are assigned it will calculate instead
                }else if(operator !== null && firstNum !== '' && secondNum !== ''){
                    operate(firstNum, secondNum, operator);
                    operator = e; //Operator value needs to be reassigned to continue chain calculations
                    break;
                }else{
                    flicker();
                    break;
                }
        }
    }
    
}
//operate() accepts two numbers and an operator: +, -, *, /
function operate(numOne, numTwo, op){
    numOne = parseFloat(numOne);
    numTwo = parseFloat(numTwo);
    //Switch determines which operation will occur
    //All operations move result into firstNum and clear other variables for chain calculation
    switch (op){
        case '*':
            firstNum = round(numOne * numTwo);
            secondNum = '';
            operator = null;
            display.innerHTML = firstNum;
            checkOverflow();
            break;
        case '/':
            if(numTwo !== 0){
                firstNum = round(numOne / numTwo);
                secondNum = '';
                operator = null;
                display.innerHTML = firstNum;
                checkOverflow();
                break;
            }else{
                clear();
                display.innerText = 'UNIVERSE END!'
                break;
            }
        case '+':
            firstNum = round(numOne + numTwo);
            secondNum = '';
            operator = null;
            display.innerHTML = firstNum;
            checkOverflow();
            break;
        case '-':
            firstNum = round(numOne - numTwo);
            secondNum = '';
            operator = null;
            display.innerHTML = firstNum;
            checkOverflow();
            break;
        
    }
    isCalc = true;
}
//Reset calculator to default state
function clear(){
    firstNum = '';
    secondNum = '';
    operator = null;
    display.innerText = '0';
    isCalc = false;
}
//Checks if any number is larger than 15, which is the maximum length of display
function checkOverflow(){
    firstNum = firstNum.toString();//firstNum converts to a number during calculation and thus needs to be converted back into a string. secondNum is never converted
    if(firstNum.length > 15 || secondNum.length >15){
        clear();
        display.innerText = "OVERFLOW ERROR"
    }
}

//Flickers the display, used to indicate invalid button presses
function flicker(){
    const current = display.innerText;
    function textDisplay(){
        display.innerText = current;
    }
    display.innerText = '';
    setTimeout(textDisplay, 100);
}

//roundToDecimals() takes a number and number of decimal places and rounds to that length
function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

//round() takes a number and returns a rounded number with a maximum length of 15 
function round(num){
    num = num.toString();
    if(num.length <= 15 || !num.includes('.')){
        return num;
    }else{
        let intLength = num.slice(0, num.indexOf('.') + 1).length;//retrieves the length of numbers before decimal and includes decimal
        num = roundToDecimals(num, 15 - intLength);//rounds the number to a length of 15
        return num;
    }
}