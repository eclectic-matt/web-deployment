class Darts extends MiniGame {

  constructor(difficulty)
  {
    super(difficulty);
    this.simplified = false;
    this.values = [ 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5 ];
    this.dartCount = this.difficulty + 1;
    this.highlight = false;
    this.init();
  }

  init()
  {
    //this.target = this.randomInt(3, 60 * this.dartCount);
    this.target = 0;
    //end on a double - at least one value must be *2
    this.target += this.randomInt(1,20) * 2;
    //for the rest, generate random val + modifier (1-3)
    for(let i = 1; i < this.dartCount; i++){
      this.target += this.randomInt(1,20) * this.randomInt(1,3);
    }
    this.current = this.target;
    this.throws = this.current + ' -> ';

    document.getElementById('form').style.display = 'none';
    let el = document.getElementById('main');
    //CLEAR main
    el.innerHTML = '';

    this.endsOnDouble = true;

    let targetHead = document.createElement('h2');
    targetHead.innerHTML = 'Target: ' + this.target + ' in ' + this.dartCount + ' darts' + (this.endsOnDouble ? ' (ending on a double)' : '');
    targetHead.id = 'targetHead';
    targetHead.style.fontSize = '0.75rem';
    targetHead.style.width = '100%';
    targetHead.style.textAlign = 'center';
    el.appendChild(targetHead);

    let dartHead = document.createElement('h2');
    dartHead.innerHTML = '&nbsp;';
    dartHead.id = 'dartHead';
    dartHead.style.fontSize = '0.75rem';
    dartHead.style.width = '100%';
    dartHead.style.textAlign = 'center';
    el.appendChild(dartHead);

    let throwsHead = document.createElement('h2');
    throwsHead.innerHTML = '&nbsp;' + this.throws;
    throwsHead.id = 'throwsHead';
    throwsHead.style.fontSize = '0.5rem';
    throwsHead.style.width = '100%';
    throwsHead.style.textAlign = 'center';
    el.appendChild(throwsHead);

    let cnv = document.createElement('canvas');
    cnv.id = 'cnv';
    this.width = window.innerWidth - (window.innerWidth * 0.05);
    this.height = window.innerHeight - (window.innerHeight * 0.4);
    cnv.width = this.width;
    cnv.height = this.height;
    cnv.onclick = (event) => {
      this.checkClick(event);
    }
    /*cnv.ontouchstart = (event) => {
      this.checkHighlight(event);
    }*/
    el.appendChild(cnv);


    //Add button to switch
    let switchBtn = document.createElement('button');
    switchBtn.id = 'switchBtn';
    switchBtn.innerHTML = 'Switch to simplified';
    switchBtn.className = 'fullBtn';
    switchBtn.onclick = (ev) => {
      this.switchSimplified(ev);
    }
    el.appendChild(switchBtn);

    el.appendChild(document.createElement('br'));
    el.appendChild(document.createElement('br'));

    //Calculate and store radius values
    //Black backboard (where numbers displayed)
    if(this.width < this.height){
     this.radiusBackBoard = this.width / 2;
    }else{
      this.radiusBackBoard = this.height / 2;
    }

    /*
    //Outer circle (the full play area)
    this.radiusOuterCircle = this.radiusBackBoard - 20;
    //The size of the circle for the outer double arc
    this.radiusOuterDouble = this.radiusOuterCircle;
    //and the inner double arc
    this.radiusInnerDouble = this.radiusOuterDouble - 10;
    //and the outer triple arc
    this.radiusOuterTriple = this.radiusInnerDouble - 50;
    //and the inner triple arc
    this.radiusInnerTriple = this.radiusOuterTriple - 10;
    //outer bull
    this.radiusOuterBull = 10;
    //inner bull
    this.radiusInnerBull = 5;
    */

    //Outer circle (the full play area)
    this.radiusOuterCircle = this.radiusBackBoard * 0.90;
    //The size of the circle for the outer double arc
    this.radiusOuterDouble = this.radiusOuterCircle;
    //and the inner double arc
    this.radiusInnerDouble = this.radiusOuterDouble * 0.85;
    //and the outer triple arc
    this.radiusOuterTriple = this.radiusInnerDouble * 0.70;
    //and the inner triple arc
    this.radiusInnerTriple = this.radiusOuterTriple * 0.80;
    //outer bull
    this.radiusOuterBull = this.radiusInnerTriple * 0.3;
    //inner bull
    this.radiusInnerBull = this.radiusOuterBull * 0.5;


    //SimplifiedDartBoard
    //bull circle - bigger 1/4 of radius
    this.radiusSimpleBull = this.radiusBackBoard / 4;
    //double outer - space for numbers
    this.radiusSimpleDouble = this.radiusBackBoard - 20;
    //triple outer - 3/4 of remaining space
    this.radiusSimpleTriple = (3/4 * this.radiusSimpleDouble);
    //single outer - 1/3 of remaining space
    this.radiusSimpleSingle = (1/2 * this.radiusSimpleDouble);

    this.drawBoard();
  }

  switchSimplified(ev)
  {
    this.simplified = !this.simplified;
    ev.target.innerHTML = (this.simplified ? 'Switch to regular' : 'Switch to simplified');
    this.drawBoard();
  }

  drawBoard(highlight = false)
  {
    if(this.simplified){
      this.drawSimplifiedDartBoard(highlight);
    }else{
      this.drawDartBoard(highlight);
    }
  }

  drawSimplifiedDartBoard(highlight = false)
  {
    let cnv = document.getElementById('cnv');
    let ctx = cnv.getContext('2d');

    let width = cnv.width;
    let height = cnv.height;
    let midx = width / 2;
    let midy = height / 2;
    let bgCol = '#777';
    let blackCol = '#000';
    let whiteCol = '#fff';
    let redCol = '#e22';
    let greenCol = '#2e2';
    let highlightCol = '#a0b';

    //Fill BG
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, width, height);

    //Draw back board
    ctx.beginPath();
    ctx.fillStyle = blackCol
    ctx.moveTo(width, height/2);
    ctx.arc(midx, midy, this.radiusBackBoard, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();

    //White Outer Circle
    ctx.beginPath();
    ctx.fillStyle = whiteCol;
    ctx.moveTo(width, height/2);
    ctx.arc(midx, midy, this.radiusOuterCircle, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();

    //20 Dr Sb Tg Sb 
    //1  Dg Sw Tr Sw

    //Each segment is 2PI / 20 radians wide
    let angleSeg = 2*Math.PI/20;
    //Init to -Math.PI / 2 (0 rad = 3 o'clock)
    let angle = -Math.PI/2;
    //Move back by half a segment angle (20 spans 12 o'clock)
    angle -= angleSeg / 2;

    //Draw arcs
    for(let i = 0; i < this.values.length; i++){

      //Set colours
      let colourTriple = ( i % 2 === 0 ? redCol : greenCol);
      //let colourDouble = colourTriple;
      //Alternating double/triple colours
      let colourDouble = ( i % 2 === 0 ? greenCol : redCol);
      let colourSingle = ( i % 2 === 0 ? blackCol : whiteCol);

      //Init coords
      let startX = midx + this.radiusSimpleDouble * Math.cos(angle);
      let startY = midy + this.radiusSimpleDouble * Math.sin(angle);
      let x = startX;
      let y = startY;

      if((highlight) && (highlight.value === this.values[i])){
        if(highlight.modifier === 1) {
          colourSingle = highlightCol;
          //IF WHITE, MUST DRAW SINGLE SECTION IN
          if((i % 2) === 1){
            ctx.beginPath();
            ctx.fillStyle = colourSingle;
            ctx.moveTo(startX, startY);
            //ARC FORWARDS TO TOP RIGHT
            ctx.arc(midx, midy, this.radiusSimpleDouble, angle, angle + angleSeg);
            //MOVE DOWN TO CENTER
            ctx.lineTo(midx, midy);
            //MOVE BACK TO START
            ctx.lineTo(startX, startY);
            ctx.fill();
            ctx.closePath();
          }
        }else if (highlight.modifier === 2) {
          colourDouble = highlightCol;
        }else if (highlight.modifier === 3) {
          colourTriple = highlightCol;
        }
      }

      //SINGLES (BLACK ONLY, WHITE SINGLES DRAWN BY BACKGROUND)
      if ((i % 2) === 0) {
        ctx.beginPath();
        ctx.fillStyle = colourSingle;
        ctx.moveTo(startX, startY);
        //ARC FORWARDS TO TOP RIGHT
        ctx.arc(midx, midy, this.radiusSimpleDouble, angle, angle + angleSeg);
        //MOVE DOWN TO CENTER
        ctx.lineTo(midx, midy);
        //MOVE BACK TO START
        ctx.lineTo(startX, startY);
        ctx.fill();
        ctx.closePath();
      }

      //DOUBLE
      ctx.beginPath();
      ctx.fillStyle = colourDouble;
      ctx.moveTo(x, y);
      ctx.arc(midx, midy, this.radiusSimpleDouble, angle, angle + angleSeg);
      x = midx + this.radiusSimpleTriple * Math.cos(angle + angleSeg);
      y = midy + this.radiusSimpleTriple * Math.sin(angle + angleSeg);
      ctx.lineTo(x, y);
      ctx.arc(midx, midy, this.radiusSimpleTriple, angle + angleSeg, angle, true);
      ctx.lineTo(startX, startY);
      ctx.fill();
      //OUTPUT 2x LABEL
      let fontSize = (this.radiusBackboard * 2) / 30;
      fontSize = parseInt(fontSize);
      ctx.font = fontSize + 'pt Verdana';
      ctx.fillStyle = whiteCol;
      ctx.fillText(startX, startY, '2x', 20);
      //ctx.fill();
      ctx.closePath();

      //TRIPLES
      startX = midx + this.radiusSimpleTriple * Math.cos(angle);
      startY = midy + this.radiusSimpleTriple * Math.sin(angle);
      x = startX;
      y = startY;
      ctx.beginPath();

      //OUTER TRIPLE TOP LINE
      ctx.fillStyle = colourTriple;
      ctx.moveTo(x, y);
      //ARC FORWARDS TO TOP RIGHT
      ctx.arc(midx, midy, this.radiusSimpleTriple, angle, angle + angleSeg);
      x = midx + this.radiusSimpleSingle * Math.cos(angle + angleSeg);
      y = midy + this.radiusSimpleSingle * Math.sin(angle + angleSeg);
      //MOVE DOWN TO OUTER BOTTOM LINE
      ctx.lineTo(x, y);
      //ARC BACKWARDS
      ctx.arc(midx, midy, this.radiusSimpleSingle, angle + angleSeg, angle, true);
      //MOVE BACK TO START
      ctx.lineTo(startX, startY);
      ctx.fill();
      //OUTPUT 3x LABEL
      //fontSize = width / 30;
      //fontSize = fontSize.toFixed(0);
      //ctx.font = fontSize + 'pt Verdana';
      ctx.fillStyle = whiteCol;
      ctx.fillText(startX, startY, '3x');
      //ctx.fill();
      ctx.closePath();

      //SINGLES
      startX = midx + this.radiusSimpleSingle * Math.cos(angle);
      startY = midy + this.radiusSimpleSingle* Math.sin(angle);
      x = startX;
      y = startY;
      ctx.beginPath();

      //OUTER SINGLE TOP LINE
      ctx.fillStyle = colourSingle;
      ctx.moveTo(x, y);
      //ARC FORWARDS TO TOP RIGHT
      ctx.arc(midx, midy, this.radiusSimpleSingle, angle, angle + angleSeg);
      x = midx + this.radiusSimpleBull * Math.cos(angle + angleSeg);
      y = midy + this.radiusSimpleBull * Math.sin(angle + angleSeg);
      //MOVE DOWN TO OUTER BOTTOM LINE
      ctx.lineTo(x, y);
      //ARC BACKWARDS
      ctx.arc(midx, midy, this.radiusSimpleBull, angle + angleSeg, angle, true);
      //MOVE BACK TO START
      ctx.lineTo(startX, startY);
      ctx.fill();
      //OUTPUT 2x LABEL
      //fontSize = width / 30;
      //fontSize = fontSize.toFixed(0);
      //ctx.font = fontSize + 'pt Verdana';
      ctx.fillStyle = whiteCol;
      ctx.fillText(startX, startY, '1x', 20);
      //ctx.fill();
      ctx.closePath();

      //outer bull - LHS
      ctx.moveTo(midx, midy);
      ctx.beginPath();
      //move to bottom
      ctx.lineTo(midx, midy - this.radiusSimpleBull);
      ctx.arc(midx, midy, this.radiusSimpleBull, Math.PI/2, 3 
      *Math.PI/2);
      ctx.lineTo(midx, midy);
      ctx.fillStyle = '#d55';
      ctx.fill();
      ctx.closePath();

      //inner bull - RHS
      ctx.moveTo(midx, midy);
      ctx.beginPath();
      //move to bottom
      ctx.lineTo(midx, midy + this.radiusSimpleBull);
      ctx.arc(midx, midy, this.radiusSimpleBull, 3*Math.PI/2, Math.PI/2);
      ctx.lineTo(midx, midy);
      ctx.fillStyle = '#5d5';
      ctx.fill();
      ctx.closePath();
      
      //Output value
      ctx.beginPath();
      ctx.fillStyle = whiteCol;
      let fontWidth = (this.radiusBackBoard * 2);
      fontSize = fontWidth / 30;
      fontSize = fontSize.toFixed(0);
      ctx.font = fontSize + 'pt Verdana';
      x = midx + (0.95*(fontWidth/2)) * Math.cos((i/20)* (2*Math.PI) + (3*Math.PI/2));
      y = midy + (0.95*(fontWidth/2)) * Math.sin((i/20)* (2*Math.PI) + (3*Math.PI/2));
      //console.log(i, values[i], x, y);
      // Adjust as text drawn from top left (alignment)
      x = x - 0.03*fontWidth;
      y = y + 0.02*fontWidth;
      ctx.fillText(this.values[i], x, y);
      //ctx.fill();
      ctx.closePath;

      angle += angleSeg;
    }
  }

  drawDartBoard(highlight = false)
  {
    let cnv = document.getElementById('cnv');
    let ctx = cnv.getContext('2d');

    let width = cnv.width;
    let height = cnv.height;
    let midx = width / 2;
    let midy = height / 2;
    let bgCol = '#777';
    let blackCol = '#000';
    let whiteCol = '#fff';
    let redCol = '#e22';
    let greenCol = '#4e4';
    let highlightCol = '#a0b';

    //Fill BG
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, width, height);

    //Draw back board
    ctx.beginPath();
    ctx.fillStyle = blackCol
    ctx.moveTo(width, height/2);
    ctx.arc(midx, midy, this.radiusBackBoard, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();

    //White Outer Circle
    ctx.beginPath();
    ctx.fillStyle = whiteCol;
    ctx.moveTo(width, height/2);
    ctx.arc(midx, midy, this.radiusOuterCircle, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();

    //20 Dr Sb Tg Sb 
    //1  Dg Sw Tr Sw

    //Each segment is 2PI / 20 radians wide
    let angleSeg = 2*Math.PI/20;
    //Init to -Math.PI / 2 (0 rad = 3 o'clock)
    let angle = -Math.PI/2;
    //Move back by half a segment angle (20 spans 12 o'clock)
    angle -= angleSeg / 2;

    //Draw arcs
    for(let i = 0; i < this.values.length; i++){

      //Set colours
      let colourTriple = ( i % 2 === 0 ? redCol : greenCol);
      let colourDouble = colourTriple;
      //Alternating double/triple colours
      //let colourDouble = ( i % 2 === 0 ? greenCol : redCol);
      let colourSingle = ( i % 2 === 0 ? blackCol : whiteCol);

      //Init coords
      let startX = midx + this.radiusOuterDouble * Math.cos(angle);
      let startY = midy + this.radiusOuterDouble * Math.sin(angle);
      let x = startX;
      let y = startY;

      if((highlight) && (highlight.value === this.values[i])){
        if (highlight.modifier === 1){
          colourSingle = highlightCol;
          //IF WHITE, MUST DRAW SINGLE SECTION IN
          if((i % 2) === 1){
            ctx.beginPath();
            ctx.fillStyle = colourSingle;
            ctx.moveTo(startX, startY);
            //ARC FORWARDS TO TOP RIGHT
            ctx.arc(midx, midy, this.radiusOuterDouble, angle, angle + angleSeg);
            //MOVE DOWN TO CENTER
            ctx.lineTo(midx, midy);
            //MOVE BACK TO START
            ctx.lineTo(startX, startY);
            ctx.fill();
            ctx.closePath();
          }
        }else if(highlight.modifier === 2){
          colourDouble = highlightCol;
        }else if(highlight.modifier === 3){
          colourTriple = highlightCol;
        }
      }

      //SINGLES (BLACK ONLY, WHITE SINGLES DRAWN BY BACKGROUND)
      if ((i % 2) === 0) {
        ctx.beginPath();
        ctx.fillStyle = colourSingle;
        ctx.moveTo(startX, startY);
        //ARC FORWARDS TO TOP RIGHT
        ctx.arc(midx, midy, this.radiusOuterDouble, angle, angle + angleSeg);
        //MOVE DOWN TO CENTER
        ctx.lineTo(midx, midy);
        //MOVE BACK TO START
        ctx.lineTo(startX, startY);
        ctx.fill();
        ctx.closePath();
      }

      //OUTER DOUBLE TOP LINE
      ctx.beginPath();
      ctx.fillStyle = colourDouble;
      ctx.moveTo(x, y);
      ctx.arc(midx, midy, this.radiusOuterDouble, angle, angle + angleSeg);
      x = midx + this.radiusInnerDouble * Math.cos(angle + angleSeg);
      y = midy + this.radiusInnerDouble * Math.sin(angle + angleSeg);
      ctx.lineTo(x, y);
      ctx.arc(midx, midy, this.radiusInnerDouble, angle + angleSeg, angle, true);
      ctx.lineTo(startX, startY);
      ctx.fill();
      ctx.closePath();

      //TRIPLES
      startX = midx + this.radiusOuterTriple * Math.cos(angle);
      startY = midy + this.radiusOuterTriple * Math.sin(angle);
      x = startX;
      y = startY;
      ctx.beginPath();

      //OUTER TRIPLE TOP LINE
      ctx.fillStyle = colourTriple;
      ctx.moveTo(x, y);
      //ARC FORWARDS TO TOP RIGHT
      ctx.arc(midx, midy, this.radiusOuterTriple, angle, angle + angleSeg);
      x = midx + this.radiusInnerTriple * Math.cos(angle + angleSeg);
      y = midy + this.radiusInnerTriple * Math.sin(angle + angleSeg);
      //MOVE DOWN TO OUTER BOTTOM LINE
      ctx.lineTo(x, y);
      //ARC BACKWARDS
      ctx.arc(midx, midy, this.radiusInnerTriple, angle + angleSeg, angle, true);
      //MOVE BACK TO START
      ctx.lineTo(startX, startY);
      ctx.fill();
      ctx.closePath();

      //outer bull
      let colourOuterBull = greenCol;
      if(
        (highlight.value === 25) &&
        (highlight.modifier === 1)
      ){
        colourOuterBull = highlightCol;
      }
      ctx.moveTo(midx, midy);
      ctx.beginPath();
      ctx.arc(midx, midy, this.radiusOuterBull, 0, 2*Math.PI);
      ctx.fillStyle = colourOuterBull;
      ctx.fill();
      ctx.closePath();
      //inner bull
      let colourInnerBull = redCol;
      if(
        (highlight.value === 25) &&
        (highlight.modifier === 2)
      ){
        colourInnerBull = highlightCol;
      }
      ctx.moveTo(midx, midy);
      ctx.beginPath();
      ctx.arc(midx, midy, this.radiusInnerBull, 0, 2*Math.PI);
      ctx.fillStyle = colourInnerBull;
      ctx.fill();
      ctx.closePath();

      //Output value
      ctx.beginPath();
      ctx.fillStyle = whiteCol;
      let fontWidth = (this.radiusBackBoard * 2);
      let fontSize = fontWidth / 30;
      fontSize = fontSize.toFixed(0);
      ctx.font = fontSize + 'pt Verdana';
      x = midx + (0.95*(fontWidth/2)) * Math.cos((i/20)* (2*Math.PI) + (3*Math.PI/2));
                        y = midy + (0.95*(fontWidth/2)) * Math.sin((i/20)* (2*Math.PI) + (3*Math.PI/2));
                        //console.log(i, values[i], x, y);
                        // Adjust as text drawn from top left (alignment)
                        x = x - 0.03*fontWidth;
                        y = y + 0.02*fontWidth;
                        ctx.fillText(this.values[i], x, y);
      ctx.closePath;

      angle += angleSeg;
    }
  }

  getAngleAndDistanceFromMidpoint(x, y)
  {
    let distance = this.getDistanceFromMidPoint(x, y);
    let angle = this.getAngleFromMidPoint(x, y);
    //console.log('board', distance, angle);
    return { distance: distance, angle: angle };
  }

  getDistanceFromMidPoint(x, y)
  {
    const xDist = Math.abs((this.width / 2) - x);
    const yDist = Math.abs((this.height / 2) - y);
    // (a2 + b2 = c2), c2 = a2 + b2, c = root(a2 + b2)
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

  getAngleFromMidPoint(x, y)
  {
    let midx = (this.width / 2);
    let midy = (this.height / 2);
    return Math.atan2(midy - y, midx - x) * 180 / Math.PI + 180;
  }

  detectBoardValue(ev)
  {
    const {x, y} = this.touchCanvas(ev);
    const {distance, angle} = this.getAngleAndDistanceFromMidpoint(x, y);

    //THE WIDTH OF EACH SEGMENT
    let segAngle = 2 * Math.PI / 20;
    //ANGLE MUST BE ROTATED BY 90DEG (AND WITHIN 0-360) PLUS ADJUSTED BACK BY HALF A SEGMENT (20 spans 12 o'clock)
    let adjAngle = ((angle + 90 - (segAngle/2)) % 360);

    let segNumber = Math.floor(20 * (adjAngle / 360));
    // STORE NUMBER FOR THIS SEGMENT
    let val = this.values[segNumber];

    if(this.simplified){
      return this.detectSimplifiedBoard(distance, angle, val);
    }else{
      return this.detectRegularBoard(distance, angle, val);
    }
  }

  detectSimplifiedBoard(distance, angle, val)
  {
    /*
      --simple double
      --simple triple
      --simple single
      --simple bull
    */

    let mod = 1;
    let totalVal = val;

    if(
     (distance <= this.radiusSimpleDouble) &&
     (distance > this.radiusSimpleTriple)
    ){
      //DOUBLE ZONE
      //console.log('double', distance, this.radiusInnerDouble, this.radiusOuterDouble);
      mod = 2;
    }else if (
      (distance <= this.radiusSimpleTriple) &&
      (distance > this.radiusSimpleSingle)
    ){
      //TRIPLE ZONE
      //console.log('single', distance, this.radiusInnerDouble, this.radiusOuterTriple);
      mod = 3;
    }else if (
      (distance <= this.radiusSimpleSingle) &&
      (distance > this.radiusSimpleBull)
    ){
      //SINGLE ZONE
      mod = 3;
    }else if(
      distance <= this.radiusSimpleBull
    ){
      //IN THE BULL - LEFT/RIGHT IS INNER/OUTER
      if( (angle > 0) && (angle <= 180) ){
        //RHS - INNER BULL
        val = 25;
        mod = 2;
      }else{
        //LHS - OUTER BULL
        val = 25;
        mod = 1;
      }
    }else{
      //OFF BOARD
      val = '';
      mod = '';
      return false;
    }

    if ((val !== '') && (mod !== '')) {
      totalVal = mod * val;
    }

    let boardValue = { value: val, modifier: mod, totalValue: totalVal };

    return boardValue;
  }

  detectRegularBoard(distance, angle, val)
  {
    /*
    -- outer double
    -- inner double
    -- outer single
    -- outer triple
    -- inner triple
    -- inner single
    -- outer bull
    -- inner bull
    */

    let mod = 1;
    let totalVal = val;

    if(
     (parseInt(distance) <= this.radiusOuterDouble) &&
     (parseInt(distance) > this.radiusInnerDouble)
    ){
      //DOUBLE ZONE
      //console.log('double', distance, this.radiusInnerDouble, this.radiusOuterDouble);
      mod = 2;
    }else if (
      (distance <= this.radiusInnerDouble) &&
      (distance > this.radiusOuterTriple)
    ){
      //OUTER SINGLE ZONE
      //console.log('single', distance, this.radiusInnerDouble, this.radiusOuterTriple);
      mod = 1;
    }else if (
      (distance <= this.radiusOuterTriple) &&
      (distance > this.radiusInnerTriple)
    ){
      //TRIPLE ZONE
      mod = 3;
    }else if (
      (distance <= this.radiusInnerTriple) &&
      (distance > this.radiusOuterBull)
    ){
      //INNER SINGLE ZONE
      mod = 1;
    }else if(
      (distance <= this.radiusOuterBull) &&
      (distance > this.radiusInnerBull)
    ){
      //OUTER BULL
      val = 25;
      mod = 1;
    }else if(
      distance <= this.radiusInnerBull
    ){
      //INNER BULL
      val = 25;
      mod = 2;
    }else{
      //OFF BOARD
      val = '';
      mod = '';
      return false;
    }

    if( (val !== '') && (mod !== '') ){
      totalVal = mod * val;
    }

    let boardValue = { value: val, modifier: mod, totalValue: totalVal };

    return boardValue;
  }

  checkClick(ev)
  {
    //console.log('checkClick', ev);

    //Pass to detect method
    let board = this.detectBoardValue(ev);
    if(!board) return;

    //Take board values and apply
    const { value, modifier, totalValue } = board;

    let dartHead = document.getElementById('dartHead');
    dartHead.innerHTML = 'Clicked ' + value + ' (x' + modifier + ') = ' + totalValue;
    dartHead.style.fontSize = '0.75rem';

    let confirmBtn = document.createElement('button');
    confirmBtn.onclick = (ev) => {
      this.applyClick(value, modifier, totalValue);
    }
    confirmBtn.innerHTML = 'Confirm: ' + value + ' x' + modifier;
    confirmBtn.style.fontSize = '0.75rem';
    confirmBtn.style.marginLeft = '25px';
    dartHead.appendChild(confirmBtn);

    let highlight = { value: value, modifier: modifier, totalValue: totalValue };
    this.drawBoard(highlight);
  }

  //Confirm target
  applyClick(value, modifier, totalValue)
  {
    this.current -= totalValue;
    this.dartCount--;

    let targetHead = document.getElementById('targetHead');
    targetHead.innerHTML = 'Target: ' + this.target + ' in ' + this.dartCount + ' darts' + (this.endsOnDouble ? ' (ending on a double)' : '');
    
    let dartHead = document.getElementById('dartHead');
    dartHead.innerHTML = 'Clicked ' + value + ' (x' + modifier + ') = ' + totalValue;

    this.throws += value + 'x' + modifier + ' = ' + this.current + (this.current !== 0 ? ' -> ' : '');
    document.getElementById('throwsHead').innerHTML = this.throws;

    if (this.current === 0) {
      if ((this.endsOnDouble === true) && (modifier === 2)) {
        this.win(this.target);
      } else {
        document.getElementById('dartHead').innerHTML += 'YOU MUST END ON A DOUBLE!';
        this.lose();
      }
    } else if (this.dartCount === 0) {
      this.lose();
    }
  }

  checkHighlight(ev)
  {
    //console.log('checkHighlight', ev);
    //ev.preventDefault();
    //Pass to detect method
    const { value, modifier, totalValue } = this.detectBoardValue(ev);
    const highlight = { value: value, modifier: modifier, totalValue: totalValue };

    if(JSON.stringify(highlight) === JSON.stringify(this.highlight)){
      //Highlight already applied, do not re-draw
      return false;
    }else{
      this.highlight = highlight;
      this.drawBoard(highlight);
    }
  }

  touchCanvas(e)
  {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    //Return as coordinates object
    return { x: x, y: y };
  }

}