/*
   Calculator for The Odin Project lesson
   Coded by: Theo See aka Tsee90 
*/
let firstNum = '';
let secondNum = '';
let operator = null;
let chain = false; //True if we are in a chain of calculations
let isKeyPressed = false; //True on keydown, false on keyup

//Add even listener to all buttons which returns text inside button when clicked
const btnList = document.querySelectorAll('button');
btnList.forEach(btn => btn.addEventListener('click', (e) => btnClick(e.target.textContent)));

//Set display variables
const display = document.querySelector('.num-display');
const opDisplay = document.querySelector('.op-display');

document.addEventListener('keydown', (e) => {
    //Checks keydown to prevent repeated triggering when key held down
    if(!isKeyPressed){
        isKeyPressed = true;
        //Code below prevents default behaviors of enter key that can cause issues with the calculator
        e.preventDefault();
        const activeButton = document.activeElement; 
        if (activeButton.tagName === 'BUTTON') {
            activeButton.blur(); // Remove focus from the button if it's focused
        }
        btnClick(e.key);
        highlightBtn(e.key);//Highlight key pressed
    }
});

//Keyup removes highlight
document.addEventListener('keyup', (e) => {
    isKeyPressed = false;
    unhighlightBtn(e.key);
});


//btnClick determines what to do based on the button text of the button that was clicked and the overall state of the global variables
function btnClick(e) {
    //Checks if button text is integer or '.'
    //If true it will attempt to update variables and display
    if (!isNaN(parseInt(e)) || e === '.'){
        //Checks if operator variable has been assigned
        //If operator is null, then we proceed with assigning firstNum variable
        //If operator is not null, then we move on to see if secondNum is being attempted to be changed
        if (operator === null){
            //chain checks if we are in a chain or if no prior calculations have been done
            //If true, we must clear calculator to continue, otherwise we will attempt to change firstNum when it is not empty and not needing to be changed
            if(chain){
                clear();
            }
            //Checks and disallows for starting numbers with 0 (ex. 001) and multiple '.' (ex. 1.02.3)
            if (firstNum === '0' && e === '0' || firstNum.includes('.') && e === '.'){
                flicker();
            //All conditions for assigning or addending firstNum satisfied
            }else {
                if(firstNum === '0' && e !== '.'){
                    firstNum = '';
                }
                //Checks and adds 0 infront of empty '.'(ex. 0.1 for readability)
                if(firstNum === '' && e === '.' || firstNum === '-' && e === '.'){
                    firstNum += '0';
                }
                //Add to end of firstNum
                firstNum += e;
                display.textContent = firstNum;
                checkOverflow();
            }
        //Checks for double '.' in secondNum
        }else if(!secondNum.includes('.') || e !== '.'){
            //Checks and adds 0 infront of empty '.'(ex. 0.1 for readability)
            if(secondNum === '' && e === '.' || secondNum === '-' && e === '.'){
                secondNum += '0';
            }
            //Checks for double zero infront
            if(secondNum === '0' && e ==='0'){
                flicker();
            }else if(secondNum === '0' && e !== '.'){
                //Add to end of secondNum 
                secondNum = '';
                secondNum += e;
                display.textContent = secondNum;
                checkOverflow();
                if(secondNum === firstNum && secondNum.length === 1){
                    flicker();
                }
            }else{
                //Add to end of secondNum 
                secondNum += e;
                display.textContent = secondNum;
                checkOverflow();
                if(secondNum === firstNum && secondNum.length === 1){
                    flicker();
                }
            }
        //Invalid input will flicker display
        }else{
            flicker();
        }
    //When button text is not integer or '.' we move into else
    }else{
        //Switch check for 'C' and '=', all other remaining inputs are operators which are handled by operate()
        switch(e) {
            //Case checks for delete button unicode u232B and Backspace
            case '\u232B':
            case 'Backspace':
                if(firstNum !== '' && operator === null && !chain){
                    firstNum = firstNum.slice(0, -1);
                    if (firstNum.length === 0){
                        display.textContent = '';
                    }else{
                        display.textContent = firstNum;
                    }
                    break;
                }else if(secondNum != ''){
                    secondNum = secondNum.slice(0, -1);
                    if (secondNum.length === 0){
                        display.textContent = firstNum;
                        flicker();
                        flickerOp();
                    }else{
                        display.textContent = secondNum;
                    }
                        
                    break;
                }else if(secondNum === '' && operator !== null){
                    operator = null;
                    display.textContent = firstNum;
                    opDisplay.textContent = '';
                    if(chain){
                        opDisplay.textContent = '=';
                    }
                    break;
                }else {
                    flickerOp();
                    break;
                }
            case 'C':
            case 'Delete':
                clear();
                break;  
            case '=':
            case 'Enter':
                //Button will not work if any variable is missing
                if(firstNum === '' || secondNum === '' || operator === null || firstNum === '-' || secondNum === '-'){
                    if(chain){
                        flickerOp();
                    }else{
                        flicker();
                    }
                    break;
                }else{
                    opDisplay.textContent = '=';
                    operate(firstNum, secondNum, operator);
                    break;
                }
            //'-' can be both operator and negative symbol. As such it needs to be handled with specific criteria
            case '-':
                //First checks if - is already in display
                if (firstNum === '-' || secondNum === '-'){
                    flicker();
                    break;
                //Add - to display if all things empty
                }else if (firstNum === '' && operator === null){
                    firstNum += e;
                    display.textContent = firstNum;
                    break;
                //Checks if attempting to change secondNum
                }else if(operator !== null && firstNum !== ''){
                    if(secondNum === ''){  
                        secondNum += e;
                        display.textContent = e;
                        break;
                    }else if (secondNum !== '' && secondNum === '-'){
                        flicker();
                        break;
                    }else if (secondNum !== '' && secondNum !== '-'){
                        operate(firstNum, secondNum, operator);
                        //Check for divide by zero
                        if(display.textContent !== 'IMPLOSION!'){
                            if(chain){
                            opDisplay.textContent = '=' + e;
                            }else{
                            opDisplay.textContent = e;
                            }
                            operator = e; //Operator value needs to be reassigned to continue chain calculations
                        }
                        break;
                    }
                    else{
                        secondNum += e;
                        display.textContent = secondNum;
                        break;
                    }
                //Checks if - will be used as operator
                }else if(firstNum !== '' && operator === null && firstNum !== '-'){
                    operator = e;
                    if(chain){
                        opDisplay.textContent = '=' + e;
                    }else{
                        opDisplay.textContent = e;
                    }
                    break;
                //Calculate if conditions met
                }else if(firstNum !== '' && operator !== null && secondNum !== ''){
                    operate(firstNum, secondNum, operator);
                    if(display.textContent !== 'IMPLOSION!'){
                        if(chain){
                        opDisplay.textContent = '=' + e;
                        }else{
                        opDisplay.textContent = e;
                        }
                        operator = e; //Operator value needs to be reassigned to continue chain calculations
                    }
                    break;
                //All cases fail
                }else{
                    flickerOp();
                    break;
                }
            case '/':
            case '*':
            case '+':
                //Checks if operator variable is assigned and first num is empty
                //If true it will update the operator to the selected button text
                if(operator === null && firstNum !== '' && firstNum !== '-'){
                    operator = e;
                    if(chain){
                        opDisplay.textContent = '=' + e;
                    }else{
                        opDisplay.textContent = e;
                    }
                    break;
                //If all variables are assigned it will calculate instead
                }else if(operator !== null && firstNum !== '' && secondNum !== '' && firstNum !== '-' && secondNum !== '-'){
                    operate(firstNum, secondNum, operator);
                    if(display.textContent !== 'IMPLOSION!'){
                        if(chain){
                        opDisplay.textContent = '=' + e;
                        }else{
                        opDisplay.textContent = e;
                        }
                        operator = e; //Operator value needs to be reassigned to continue chain calculations
                    }
                    break;    
                }else{
                    if(firstNum === '-' || secondNum === '-'){
                        flicker();
                    }else{
                        flickerOp();
                    }
                    break;
                }
            default:
                break;
        }
    }
    
}

//operate() accepts two numbers and an operator: +, -, *, /
function operate(numOne, numTwo, op){
    numOne = parseFloat(numOne);
    numTwo = parseFloat(numTwo);
    //Switch determines which operation will occur
    //All operations move result into firstNum and clear other variables to allow chain calculation
    switch (op){
        case '*':
            firstNum = round(numOne * numTwo);
            secondNum = '';
            operator = null;
            display.innerHTML = firstNum;
            chain = true;
            checkOverflow();
            break;
        case '/':
            if(numTwo !== 0){
                firstNum = round(numOne / numTwo);
                secondNum = '';
                operator = null;
                display.innerHTML = firstNum;
                chain = true;
                checkOverflow();
                break;
            }else{
                clear();
                display.textContent = 'IMPLOSION!'
                break;
            }
        case '+':
            firstNum = round(numOne + numTwo);
            secondNum = '';
            operator = null;
            display.innerHTML = firstNum;
            chain = true;
            checkOverflow();
            break;
        case '-':
            firstNum = round(numOne - numTwo);
            secondNum = '';
            operator = null;
            display.innerHTML = firstNum;
            chain = true;
            checkOverflow();
            break;
    }
}

//Reset calculator to default state
function clear(){
    firstNum = '';
    secondNum = '';
    operator = null;
    display.textContent = '';
    chain = false;
    opDisplay.textContent = '';
}

//Checks if any number is larger than 15, which is the maximum length of display
function checkOverflow(){
    firstNum = firstNum.toString();//firstNum converts to a number during calculation and thus needs to be converted back into a string. secondNum is never converted
    if(firstNum.length > 15 || secondNum.length >15){
        clear();
        display.textContent = "OVERFLOW ERROR"
    }
}

//Flickers the display, used to indicate invalid button presses
function flicker(){
    const current = display.textContent;
    function textDisplay(){
        display.textContent = current;
    }
    display.textContent = '';
    setTimeout(textDisplay, 100);
}

//Flickers operation display
function flickerOp(){
    const current = opDisplay.textContent;
    function textDisplay(){
        opDisplay.textContent = current;
    }
    opDisplay.textContent = '';
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

//Highlight button on keydown
function highlightBtn(key){
    let button = null;
    switch (key){
        case 'Backspace':
            button = findButtonByText('\u232B');
            button.classList.add('highlight');
            break;
        case 'Delete':
            button = findButtonByText('C');
            button.classList.add('highlight');
            break;
        case 'Enter':
            button = findButtonByText('=');
            button.classList.add('highlight');
            break;
        default:
            button = findButtonByText(key);
            if(button !== null){
                button.classList.add('highlight');
                break;
            }else{
                break;
            }
    }
}

//Remove highlight on keyup
function unhighlightBtn(key){
    let button = null;
    switch (key){
        case 'Backspace':
            button = findButtonByText('\u232B');
            button.classList.remove('highlight');
            break;
        case 'Delete':
            button = findButtonByText('C');
            button.classList.remove('highlight');
            break;
        case 'Enter':
            button = findButtonByText('=');
            button.classList.remove('highlight');
            break;
        default:
            button = findButtonByText(key);
            if(button !== null){
                button.classList.remove('highlight');
                break;
            }else{
                break;
            }
    }
}

//Supports highlighter functions
function findButtonByText(text) {
    const buttons = document.querySelectorAll('button'); 
    for (const button of buttons) {
        if (button.textContent.trim() === text) { 
            return button; 
        }
    }
    return null;
}
