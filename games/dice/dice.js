class Game {
  tasks = [];
  completed = [];
  cash = 0;
  lives = 10;
  __constructor(tasks){
    this.tasks = tasks;
    this.completed = [];
    this.cash = 0;
    this.lives = 10;
  }
  start(){
    
  }
}

function init(){
  let diceTray = document.getElementById('diceTray');
  let newDie = createDie();
  //console.log('newDie', newDie);
  diceTray.appendChild(newDie);
  let newDie2 = createDie();
  diceTray.appendChild(newDie2);
  //Load tasks and start game
  getJson('tasks.json', loadTasks);
}

const loadTasks = (json) => {
  json.list.forEach( (task) => {
    console.log(task.name);
  });
  startGame(json.list);
}

const startGame = (tasks) => {
  let game = new Game(tasks);
  console.log('lives', game.lives);
}

/**
 * Handles the fetching of local or remote json payloads and executes the handle function with the result.
 * @param {string} file The name of the json file to load.
 * @param {function} handle The function to call on the returned json payload.
 * @return void
 */
const getJson = (file, handle) => {
  fetch(file).then(res => res.json()).then(json => handle(json));
}

function createDie(faces=6){
  let die = document.createElement('div');
  die.className = 'die draggable';
  //die.id = 'die_' + Date.now();
  die.id = generateUUID();
  //die.onClick() = (ev) => { rollDie(ev); };
  //die.addEventListener("click", function(e){ rollDie(e); } );
  die.addEventListener("click", function(event){ clickDie(event); } );
  
  //Drag events
  //die.addEventListener("dragstart", () => { dragDie(die.id); });
  //die.addEventListener("drop", () => { dropDie(die.id); });
    
  //die.draggable = true;
  die.width = "100px";
  die.height = "100px";
  die.faces = faces;
  //Set current face to max
  die.value = faces;
  die.innerHTML = getFacePips(faces);
  return die;
}

const rollAllDice = () => {
  let dice = document.getElementsByClassName('die');
  for(let i = 0; i < dice.length; i++){
    let die = dice[i];
    rollDie(die);
  }
}

const clickDie = (event) => {
  let die = document.getElementById(event.target.id);
  rollDie(die);
}

/*function rollDie(die){
  let value = 1 + Math.floor(Math.random() * (die.faces));
  //die.value = 1 + Math.floor(Math.random() * (die.faces));
  //die.innerHTML = getFacePips(die.value);
  //console.log('roll', event.target, die.value);
  var start = new Date().getTime();
  //setTimeout(functionRef, delay, param1, param2)
  setTimeout(function(){
    console.log('change', die, value);
    die.value = value;
    die.innerHTML = getFacePips(die.value);
  }, 1000, die, value);
  //Execute a loop while the timeout delays
  while (new Date().getTime() - start < 990) {
    let rndValue = 1 + Math.floor(Math.random() * (die.faces));
    //console.log(rndValue);
    //die.innerHTML = getFacePips(rndValue);
    setInterval(requestAnimationFrame(showDieValue, die, rndValue), 40);
  }
  
  let rollDelay = 0;
  
  //Rolling animation
  die.style.background = '#0ff';
  let rollDelay = 20;
  for(let i = 1; i < rollDelay; i++){
    let rndValue = 1 + Math.floor(Math.random() * (die.faces));
    let t = setTimeout( showDieValue, (i* 100), rndValue);
  }
  
  
  //Finished rolling
  die.style.background = '#fff';
  die.value = value;
  //Show final value after max timeout
  let t = setTimeout( showDieValue, (rollDelay * 100), die, die.value);
  //die.innerHTML = getFacePips(die.value);
}
*/

const rollDie = (die) => {
  if(die.rolling) return;
  let value = 1 + Math.floor(Math.random() * (die.faces));
  showDieValue(die, value);
}


const clearClasses = (die) => {
  die.className = 'die';
  die.rolling = false;
}

function showDieValue(die, value){
  die.rolling = true;
  die.classList.remove('rolling');
  die.classList.add('rolling');
  //die.className = 'rolling';
  //console.log('showVal', die, value);
  die.innerHTML = getFacePips(value);
  setTimeout( clearClasses, 500, die);
}

if(window.DeviceMotionEvent){
  console.log('deviceMotionEvent', window.DeviceAcceleration)
}


/*
var start = new Date().getTime();
setInterval(function() {
    var now = new Date().getTime();
    xElement.innerHTML = (now - start) + 'ms elapsed';
}, 40);
*/




//https://stackoverflow.com/a/8809472
const generateUUID = () => {
  let
    d = new Date().getTime(),
    d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
};
//End SO

function displayUntil(fWhile, fDelay, fThen){
  let t = setTimeout(fThen, fDelay);
  while(t){
    let i = setInterval(fWhile,0);
  }
}

function dragDie(id){
  console.log('drag', id);
  let die = document.getElementById(id);
}

function dropDie(id){
  
}

function getFacePips(num){
  switch(num){
    case 1:
      return '&#x2680;';
    break;
    case 2:
      return '&#x2681;';
    break;
    case 3:
      return '&#x2682;';
    break;
    case 4:
      return '&#x2683;';
    break;
    case 5:
      return '&#x2684;';
    break;
    case 6:
    default:
      return '&#x2685;';
    break;
    case 7:
      //1 + 6
       '&#x2680;&#x2685;';
    break;
    case 8:
      //2 + 6
      '&#x2681;&#x2685;';
    break;
    case 9:
      //3 + 6
       '&#x2682;&#x2685;';
    break;
    case 10:
      //4 + 6
      '&#x2683;&#x2685;';
    break;
    case 11:
      //5 + 6
      '&#x2684;&#x2685;';
    break;
    case 12:
      //6 + 6
      '&#x2685;&#x2685;';
    break;
  }
}