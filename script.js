/*Script.js*/
//------------------------
//Operator Functions
//------------------------
function add(a,b)   {
    return (a+b);   
}
function sub(a,b)   {
    return (a-b);
}
function mult(a,b)  {
    return (a*b);
}
function div(a,b)   {
    return (b !== 0) ? (a/b) : false;
}
function operate(a,b,operation)  {
    switch(operation)    {
        case "+":
            return add(a,b);
            break;
        case "-":
            return sub(a,b);
            break;
        case "*":
            return mult(a,b);
            break;
        case "/":
            if(b===0)   {
                alert('Funny Guy...Cannot divide by 0!\nDelete the 0 and try again.');
                return;
            }    
            return div(a,b);
            break;
    } 
}

//------------------------
//User interface globals and events
//------------------------
const globalScope = {};
globalScope.display = document.querySelector('#display');
globalScope.num_ops = new Array();
globalScope.decFlag = false;

allButtons = document.querySelectorAll('button');
allButtons.forEach(button => button.addEventListener('click', (e) => {
    let pos = e.target.id.search('-');
    let key = e.target.id.slice(0,pos);
    let value = e.target.id.slice(pos+1);
    switch(key) {
        case 'num':
            parseNum(value);
            break;
        case 'opr':
            parseOpr(value);
            break;
        case 'func':
            parseFunc(value);
            break;
    }
    globalScope.display.textContent = globalScope.num_ops.join('');
}));
//------------------------
//Functions for the event callback 
//------------------------
function parseNum(val)  {
    let num;
    switch(val) {
        case 'dec':
            if(globalScope.decFlag) {
                return;
            }
            num = '.';
            globalScope.decFlag = true;
            break;
        default:
            num = val;
            break;    
    }
    globalScope.num_ops.push(num);
}

function parseOpr(val)  {
    let sym;
    switch (val)   {
        case 'add':
            sym = '+';
            break;
        case 'sub':
            sym = '-';
            break;
        case 'mult':
            sym = '*';
            break;
        case 'div':
            sym = '/';
            break;     
    }
    if(!(globalScope.num_ops[globalScope.num_ops.length-1] === '+' ||
    globalScope.num_ops[globalScope.num_ops.length-1] === '-' ||
    globalScope.num_ops[globalScope.num_ops.length-1] === '*' ||
    globalScope.num_ops[globalScope.num_ops.length-1] === '/')&&
    globalScope.num_ops[0]!==undefined)  {   
        globalScope.decFlag = false;
        globalScope.num_ops.push(sym);
    }
    if(globalScope.num_ops[0] === undefined && sym === '-') {
        globalScope.num_ops.push(sym);
    }
}

function parseFunc(val)  {
    switch (val)   {
        case 'eq':
            evalOps();
            break;
        case 'clear':
            clearAll();
            break;
        case 'delete':
            clearChar();
            break;
    }
}
//------------------------
//parseFunc functions
//------------------------
function evalOps()   {
    let tmp, opr, decCheck = false;
    let oprPos = [], a = [], b = [], tmpArr = [];
    /*Parse num_ops array. Check for leading '-' (negative number) and ignore it. Slice 'a' (ending at firstoperator), 'opr' and 'b' (ending at second operator or end of array as applicable). If a, b, opr are valid, continue. If 'operate' returns valid number ('tmp') continue. check if 'tmp' magnitude is over 10e18 (if so, exit and alert user). Splice up to second operator/end of array (as applicable). Add 'tmp' to the beginning of array. Check if decimal is contained in the number after the last operator and set flag. */
    for(let i = 0; i<globalScope.num_ops.length; i++)   {
        if( globalScope.num_ops[i] === '+' ||
            globalScope.num_ops[i] === '-' ||
            globalScope.num_ops[i] === '*' ||
            globalScope.num_ops[i] === '/'  )   {
                oprPos.push(i);
            }
    }
    if(oprPos[0]===0)    {
        oprPos.shift();
    }
    if(oprPos.length === 1) {decCheck = true;}

    if(oprPos.length > 0)   {
        a = globalScope.num_ops.slice(0,oprPos[0]);
        opr = globalScope.num_ops[oprPos[0]];
        if(oprPos[1] === undefined) {
            b = globalScope.num_ops.slice(oprPos[0]+1);
        } else{
            b = globalScope.num_ops.slice(oprPos[0]+1,oprPos[1]);
        }
    }   else    {
        return;
    }

    if(!(a.length>0 && b.length>0 && opr.length>0)) {
        return;
    } 

    tmp = operate(+(a.join('')),+(b.join('')),opr);
    
    if(!tmp)    {
        return;
    }
    if(tmp > 10e18 || tmp < -10e18)   {
        alert("Calculated value exceeds |10e18|!\nTry using smaller numbers.");
        return;
    }
    
    (oprPos.length > 1) ? globalScope.num_ops.splice(0,oprPos[1]) : globalScope.num_ops = [];

    if(tmp%1===0)   {
        tmpArr = (''+tmp).split('')
        if(decCheck) globalScope.decFlag = false; 
    }   else    {
        tmpArr = (tmp.toFixed(2)).split('');
        if(decCheck) globalScope.decFlag = true;
    }
    
    globalScope.num_ops.unshift(...tmpArr);   
    
    return;
}

function clearAll()   {    
    globalScope.displayContent = [];
    globalScope.num_ops = [];
    globalScope.decFlag = false;       
    return;
}

function clearChar()    {
    let tmp = globalScope.num_ops.pop(); 
    if(tmp ==='.') {
        globalScope.decFlag = false;
    } else if( tmp === '+' || tmp === '-' || tmp === '*' || tmp === '/')    {
        let oprPos = [];
        for(let i = 0; i<globalScope.num_ops.length; i++)   {
            if( globalScope.num_ops[i] === '+' ||
                globalScope.num_ops[i] === '-' ||
                globalScope.num_ops[i] === '*' ||
                globalScope.num_ops[i] === '/'  )   {
                    oprPos.push(i);
                }
        }
        if(globalScope.num_ops.includes('.',oprPos[oprPos.length-1]))  {
            globalScope.decFlag = true;
        }
    }
    return;
} 
