let firstNum = '';
let secondNum = '';
let operator = null;
let chain = false; //True if we are in a chain of calculations
let isKeyPressed = false; //True on keydown, false on keyup

//Add even listener to all buttons which returns text inside button when clicked
const btnList = document.querySelectorAll('button');
btnList.forEach(btn => btn.addEventListener('click', (e) => btnClick(e.target.textContent)));

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
                if(secondNum === firstNum){
                    flicker();
                }
            }else{
                //Add to end of secondNum 
                secondNum += e;
                display.textContent = secondNum;
                checkOverflow();
                if(secondNum === firstNum){
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
            //Case checks for delete button unicode u232B
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
                        display.textContent = '';
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
                    flicker();
                    break;
                }
            case 'C':
            case 'Delete':
                clear();
                break;  
            case '=':
                //Button will not work if any variable is missing
                if(firstNum === '' || secondNum === '' || operator === null || firstNum === '-' || secondNum === '-'){
                    flicker();
                    break;
                }else{
                    operate(firstNum, secondNum, operator);
                    opDisplay.textContent = e;
                    break;
                }
            case 'Enter':
                //Button will not work if any variable is missing
                if(firstNum === '' || secondNum === '' || operator === null || firstNum === '-' || secondNum === '-'){
                    flicker();
                    break;
                }else{
                    operate(firstNum, secondNum, operator);
                    opDisplay.textContent = '=';
                    break;
                }
            //'-' can be both operator and negative symbol. As such it needs to be handled with specific criteria
            case '-':
                if (firstNum === '-' || secondNum === '-'){
                    flicker();
                    break;
                }else if (firstNum === '' && operator === null){
                    firstNum += e;
                    display.textContent = firstNum;
                    break;
                }else if(operator !== null && firstNum !== ''){
                    if(secondNum === ''){  
                        secondNum += e;
                        display.textContent = secondNum;
                        break;
                    }else if (secondNum !== '' && secondNum === '-'){
                        flicker();
                        break;
                    }else if (secondNum !== '' && secondNum !== '-'){
                        operate(firstNum, secondNum, operator);
                        operator = e; //Operator value needs to be reassigned to continue chain calculations
                        opDisplay.textContent = e;
                        break;
                    }
                    else{
                        secondNum += e;
                        display.textContent = secondNum;
                        break;
                    }
                }else if(firstNum !== '' && operator === null && firstNum !== '-'){
                    operator = e;
                    opDisplay.textContent = e;
                    break;
                }else if(firstNum !== '' && operator !== null && secondNum !== ''){
                    operate(firstNum, secondNum, operator);
                    operator = e; //Operator value needs to be reassigned to continue chain calculations
                    opDisplay.textContent = e;
                    break;
                }else{
                    flicker();
                    break;
                }
            //All default buttons are operators
            default:
                //Checks if operator variable is assigned and first num is empty
                //If true it will update the operator to the selected button text
                if(operator === null && firstNum !== '' && firstNum !== '-'){
                    operator = e;
                    opDisplay.textContent = e;
                    break;
                //If all variables are assigned it will calculate instead
                }else if(operator !== null && firstNum !== '' && secondNum !== '' && firstNum !== '-' && secondNum !== '-'){
                    operate(firstNum, secondNum, operator);
                    operator = e; //Operator value needs to be reassigned to continue chain calculations
                    opDisplay.textContent = e;
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
    //All operations move result into firstNum and clear other variables to allow chain calculation
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
                display.textContent = 'IMPLOSION!'
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
    chain = true;
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

function findButtonByText(text) {
    const buttons = document.querySelectorAll('button'); 
    for (const button of buttons) {
        if (button.textContent.trim() === text) { 
            return button; 
        }
    }
    return null;
}