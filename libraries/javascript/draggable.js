class Draggable {
  
  constructor(element, type = 'move')
  {
    //The DOM element
    this.element = element;
    //move, copy, link
    this.type = type;
    //Setup event listeners
    this.init();
  }

  init()
  {
    //console.log('drag init');
    this.element.setAttribute('draggable', true);
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('click', () => { console.log('drag click')});
  }
  
  dragStartHandler(ev)
  {
    //console.log('drag dragstart');
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = this.type;
  }
  
}

class DropZone {
  constructor(element, type, dropEv){
    this.element = element;
    this.type = type;
    this.dropEv = dropEv;
    this.init();
  }
  
  init(){
    //console.log('drop init', this.dropEv);
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
  }
  
  dragOverHandler(ev) {
    //console.log('drop dragover');
    ev.preventDefault();
    ev.dataTransfer.dropEffect = this.type;
  }
  
  dropHandler(ev) {
    //console.log('drop dropHandler');
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    ev.target.appendChild(document.getElementById(data));
    let ans = document.getElementById(data).innerHTML;
    let i = ev.target.getAttribute('i');
    let j = ev.target.getAttribute('j');
    game.dropEv(i, j, ans);
  }
}