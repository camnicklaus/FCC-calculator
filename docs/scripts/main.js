console.clear();
var model = {
  mainDis: document.getElementById("mainDis-content"),
  memDis: document.getElementById("memDis-content"),
  keypad: document.getElementsByClassName("keypad")[0],
  mathEntry: [],
  mainEntry: [],
  memEntry: [],
  lastKey: "",
  temp: [],
  result: [] 
};
var m = model;
//end model object

var control = {
  //set event listeners
  init: function() {
    m.keypad.addEventListener("click", c.getEntry);
document.addEventListener("keydown", c.getEntry);
  },
  //get input type
  getEntry: function(e) {
    control.checkMainLength()
    switch (e.type) {
      case "keydown":
        control.buttonPush(e.key);
        break;
      case "click":
        control.buttonPush(e.target.id);
        break;
      default:
        alert("invalid entry");
                  }
    
  },
  //sort input type and call functions
  buttonPush: function(key) {
    console.log(key)
    switch (true) {
      case key === "divide":
        key = "/";
        break;
      case key === "multiply":
        key = "*";
        break;
      case key === "minus":
        key = "-";
        break;
      case key === "plus":
        key = "+";
        break;
        case key === "equal":
        key = "=";
        break;
                }
    var numRegex = /[\d\.]/;
    var operatorRegex = /[\/*\+-]/;   
    switch (true) {
      case numRegex.test(key):
        control.numbers(key)
        break;
      case operatorRegex.test(key):
        control.operators(key)
        break;
      case key == "Enter" || key == "=":
        control.solve(m.mathEntry, m.temp);
        break;
      case key == "AC": 
        control.allClear();
        break;
      case key == "CE" || key == "Clear":
        control.clearEntry();
        break;
               }
  },
  allClear: function() {
    m.mainEntry = ["0"];
    m.memEntry = ["0"];
    m.mathEntry = [];
    m.result = [];
    m.temp = [];
    v.displayMain(m.mainEntry);
    v.displayMem(m.memEntry);
  },
  clearEntry: function() {
      //sort which operation used last
    switch (m.lastKey) {
      case "solve":
        control.allClear();
        break;
      case "op":
        m.mainEntry = ["0"];
        m.memEntry.pop();
        m.mathEntry.pop();
        // m.temp = [];
        break;
      case "num":
        m.mainEntry = ["0"];
        m.memEntry.splice(-m.temp.length);
        m.temp = [];
        break;
      default:
        m.mainEntry = ["0"];
        m.memEntry = ["0"];
        m.temp = [];
        break;
                     }      
      v.displayMain(m.mainEntry);
    if (!m.memEntry[0]) {m.memEntry = [0]}
      v.displayMem(m.memEntry);
      m.lastKey = "clearEntry";
  },
  
  numbers: function(val) {
    //reset from last eval
    if (m.lastKey === "solve") {control.allClear();}
    //clear initial 0 value
    if (m.memEntry.length === 1 && m.memEntry[0] === "0") {m.memEntry = [];}
    if (m.mainEntry.length === 1 && m.mainEntry[0] === "0") {m.mainEntry = [];}
    m.temp.push(val);
    m.memEntry.push(val);
    m.mainEntry.push(val);
    v.displayMem(m.memEntry);
    v.displayMain(m.mainEntry);
    m.lastKey = "num";
  },
  
  operators: function(val) {   
    var operatorRegex = /[\/*\+-]/;
    //after solve function remove last op key from mathEntry array
    if (m.lastKey === "solve") {
      m.mathEntry.splice(-1, 1);
      m.temp = [];
    }
    //keep from pushing more than one op entry
    if (m.lastKey === "op" || m.lastKey === "clearEntry" && operatorRegex.test(m.mathEntry[m.mathEntry.length-1])) {
      alert('invalid entry');
      return;
    }
    if (!m.lastKey || m.lastKey !== "num" && m.mathEntry.length < 1) {
      alert('invalid entry');
      return;
    }
    //check if temp array empty before pushing op value
    m.temp[0] ? m.mathEntry.push(m.temp.join(''), val) : m.mathEntry.push(val);
    m.memEntry.push(val);
    m.mainEntry = [val];
    v.displayMem(m.memEntry);
    v.displayMain(m.mainEntry);
    m.temp = [];
    m.lastKey = "op";
  },
  
  solve: function(val1, val2) { 
    var operatorRegex = /[\/*\+-]/;
    //make sure last user entry is a valid math entry
    if (m.lastKey === "op" || !val2[0] && operatorRegex.test(val1[val1.length-1])) {alert('invalid entry'); return;}
    m.result = eval(val1.join('')+val2.join(''));
    //keep from dealing w/pain in the ass numbers!
    if (/[^\d\.]/.test(m.result)) {
      control.allClear();
      alert('digital limit met');
      return;
    }
    //cheesy faux rounding method
    if (/\./.test(m.result)) {
      m.result = control.round(m.result);
    }
    //prep mathEntry function for next operation
    var memtemp = val1.concat(val2.join(''));
    memtemp.push("=" + m.result);
    m.mathEntry.splice(0, m.mathEntry.length-1, m.result);
    m.memEntry = memtemp;
    m.mainEntry = [m.result];
    v.displayMem(m.memEntry);
    v.displayMain(m.mainEntry);
    m.lastKey = "solve";
    control.checkMainLength();
  },
  
  round: function(val) {
    val = val.toString().split('.'); 
      var dec = val[1].slice(0, 3);
      return val[0] + ".".concat(dec);  
  },
  //keep user from entering large numbers
  checkMainLength: function() {
    if (m.memDis.clientWidth > 375) {  
      alert('digital limit met');
      control.allClear();
      return;
    }
  },
};
var c = control;
//end controller obj

var view = {
  displayMain: function(content) {
    m.mainDis.innerHTML = content.join('');
  },
  displayMem: function(content) {
    m.memDis.innerHTML = content.join('');
  }
};
var v = view;
//end view object
//initiate app
window.focus();
c.init();