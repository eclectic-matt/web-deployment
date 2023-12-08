class Poker extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    
    //SET DIFFICULTY DEFAULTS
    this.handSize = 5;
    this.suits = ['H','C','D','S'];
    this.names = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
    this.values = [14,2,3,4,5,6,7,8,9,10,11,12,13];
    this.hands = [
      'Straight Flush',
      'Four of a Kind',
      'Full House',
      'Flush',
      'Straight',
      'Three of a Kind',
      'Two Pair',
      'One Pair',
      'High Card'
    ];
    this.stages = [ 
      'initialDeal',
      'discard',
      'scoreHand',
      'payout'
    ];
    this.stage = this.stages[0];
    this.init();
    this.play();
  }
  
  init()
  {
    //GENERATE DECK
    this.deck = [];
    for(let suit = 0; suit < this.suits.length; suit++){
      for(let val = 0; val < this.values.length; val++){
        let thisSuit = this.suits[suit];
        let thisName = this.names[val];
        let thisVal = this.values[val];
        this.deck.push( { suit: thisSuit, value: thisVal, name: thisName } );
      }
    }
    this.deck = this.shuffle(this.deck);
    //console.log(this.deck);
  }
  
  
  play()
  {
    switch(this.stage){
      case 'initialDeal':
        this.cards = [];
        for(let i = 0; i < this.handSize; i++){
          this.cards.push(this.deck.splice(0,1)[0]);
          this.cards[i].markedForDiscard = false;
        }
        //console.log('initialDraw', this.cards);
        this.cards = this.cards.sort( (a, b) => { return a.value - b.value;});
        this.displayCards();
        this.updateRedrawButton();
        this.getCurrentBestHand(this.cards);
      break;
      case 'discard':
        for(let i = 0; i < this.cards.length; i++){
          if(this.cards[i].markedForDiscard){
            //console.log('discarding', this.cards[i]);
            this.cards.splice(i,1);
            i -= 1;
          }
        }
        let drawCount = this.handSize - this.cards.length;
        for(let i = 0; i < drawCount; i++){
          let newCard = this.deck.splice(0,1)[0];
          //console.log('drawing',i,'of',drawCount-1,newCard);
          this.cards.push(newCard);
        }
        this.cards = this.cards.sort( (a, b) => { return a.value - b.value;});
        this.displayCards();
        //this.getCurrentBestHand(this.cards);
        this.stage = 'scoreHand';
        this.play();
      break;
      case 'scoreHand':
        //console.log('scoring now!');
        let bestHand = this.getCurrentBestHand(this.cards.slice());
        let score = 0;
        for(let i = 0; i < this.hands.length; i++){
          if(bestHand.includes(this.hands[i])){
            let scoreMult = (this.hands.length - i);
            score = scoreMult * scoreMult;
          }
        }
        document.getElementById('bestHandHead').innerHTML = bestHand + ' which scores: ' + score + '!';
        this.showReplayButton();
      break;
    }
  }
  
  displayCards()
  {
    document.getElementById('form').style.display = 'none';
    let el = document.getElementById('main');
    el.innerHTML = '';
    
    let cardTable = document.createElement('table');
    let cardRow = document.createElement('tr');
    
    for(let i = 0; i < this.cards.length; i++){
      let td = document.createElement('td');
      td.style.border = '1px solid black';
      
      let discardBtn = document.createElement('button');
      discardBtn.id = 'discardBtn' + i;
      discardBtn.setAttribute('i', i);
      //discardBtn.innerHTML = 'Discard ' + this.cards[i].name + '' + this.cards[i].suit;
      discardBtn.innerHTML = 'Discard ';
      discardBtn.className = 'discard';
      discardBtn.onclick = (ev) => {
        //ev.stopPropagation();
        this.discardBtn(ev);
      }
      
      let discardInner = document.createElement('span');
      discardInner.innerHTML = this.cards[i].name;
      discardInner.className = this.cards[i].suit;
      discardBtn.appendChild(discardInner);
      
      //td.innerHTML = this.cards[i].name + ' ' + this.cards[i].suit;
      td.appendChild(discardBtn);
      
      let card = document.createElement('div');
      card.innerHTML = this.cards[i].name;
      card.className = 'card ' + this.cards[i].suit;
      td.appendChild(card);
      cardRow.appendChild(td);
    }
    
    cardTable.appendChild(cardRow);
    el.appendChild(cardTable);
    
    let bestHand = this.getCurrentBestHand(this.cards.slice());
    
    let bestHandHead = document.createElement('h2');
    bestHandHead.id = 'bestHandHead';
    bestHandHead.innerHTML = bestHand;
    
    el.appendChild(bestHandHead);
    
    
    
    //this.showReplayButton();
  }
  
  updateRedrawButton()
  {
    let redrawBtn = document.getElementById('redrawBtn');
    if(!redrawBtn){
      redrawBtn = document.createElement('button');
      redrawBtn.id = 'redrawBtn';
      document.getElementById('main').appendChild(redrawBtn);
    }
    let redrawCount = this.cards.filter( c => { return c.markedForDiscard === true; }).length;
    redrawBtn.innerHTML = 'Redraw ' + redrawCount + ' cards';
    redrawBtn.onclick = (ev) => {
      this.redrawBtn(ev);
    }
  }
  
  discardBtn(ev)
  {
    let i = ev.target.getAttribute('i');
    //console.log(ev.target.tagName);
    if(ev.target.tagName !== 'BUTTON'){
      i = ev.target.parentNode.getAttribute('i');
    }
    let el = document.getElementById('discardBtn' + String(i));
    //console.log('discardBtn', ev.target, this.cards[i]);
    
    if(el.className.indexOf('marked') === -1){
      el.className += ' marked';
      //el.innerHTML += ' ✔️';
      //console.log('discardBtn.target', el);
    }else{
      el.className = el.className.replace(' marked','');
    }
    //FLIP MARKED FLAG
    this.cards[i].markedForDiscard = !this.cards[i].markedForDiscard;
    this.updateRedrawButton();
  }
  
  redrawBtn(ev)
  {
    //console.log('redrawClick');
    let btn = document.getElementById('redrawBtn');
    btn.style.display = 'none';
    btn.disabled = true;
    //ev.target.style.display = 'hidden';
    this.stage = 'discard';
    this.play();
  }
  
  getCurrentBestHand(cards){
    if(cards.length !== 5) return false;
    for(let i = 0; i < this.hands.length; i++){
      switch(this.hands[i]){
        case 'Straight Flush':
          let validFlush = this.checkFlush(cards);
          let validStraight = this.checkStraight(cards);
          if( 
            (validFlush !== false) && 
            (validStraight !== false)
          ){
            //MATCH - RETURN THIS HAND
            return this.hands[i] + ' up to ' + this.getName(validStraight);
          }
        break;
        case 'Four of a Kind':
          let validFour = this.checkFourOfAKind(cards);
          if(validFour !== false){
            //MATCH - RETURN THIS HAND 
            return this.hands[i] + ' - ' + this.getName(validFour) + '!';
          }
        break;
        case 'Full House':
          let validFull = this.checkFullHouse(cards);
          if(validFull !== false){
            //Matched Full House, split return array
            return this.hands[i] + ' ' + this.getName(validFull[0]) + ' and ' + this.getName(validFull[1]);
          }
        break;
        case 'Flush':
          let flushOk = this.checkFlush(cards);
          if(flushOk !== false){
            return this.hands[i] + ' with ' + this.getName(flushOk) + ' high';
          }
        break;
        case 'Straight':
          let straightOk = this.checkStraight(cards);
          if (straightOk !== false) {
            return this.hands[i] + ' with ' + this.getName(straightOk) + ' high';
          }
        break;
        case 'Three of a Kind':
          let threeOk = this.checkThreeOfAKind(cards);
          if (threeOk !== false) {
            return this.hands[i] + ' with ' + this.getName(threeOk);
          }
        break;
        case 'Two Pair':
          let firstPair = this.checkOnePair(cards);
          if(firstPair !== false){
            let remaining = this.cards.filter( c => { return c.value !== firstPair});
            let twoPair = this.checkOnePair(remaining);
            //console.log('twoPair', firstPair, remaining, twoPair);
            if(twoPair !== false){
              return this.hands[i] + ' - ' + this.getName(twoPair) + ' and ' + this.getName(firstPair);
            }
          }
        break;
        case 'One Pair':
          let onePair = this.checkOnePair(cards);
          if(onePair !== false){
            return this.hands[i] + ' - ' + this.getName(onePair);
          }
        break;
        case 'High Card':
        default:
          let cVals = cards.map( c => { return parseInt(c.value)});
          let highVal = Math.max(...cVals);
          return this.hands[i] + ' with ' + this.getName(highVal);
        break;
      }
    }
  }
  
  getName(val)
  {
    let returnVal = val;
    if( (val < 2) || (val > 10) ){
      returnVal = this.names[this.values.indexOf(val)];
    }
    return returnVal;
  }
  
  checkFlush(cards)
  {
    let valid = false;
    cards.sort( (a, b) => { return (a.value - b.value); });
    if(cards.filter( el => { return el.suit == cards[0].suit; }).length === cards.length){
      //All cards same suit - return highest
      valid = cards[cards.length - 1].value;
    }
    //console.log('checkFlush',cards, valid);
    return valid;
  }
  
  checkStraight(cards)
  {
    //SORT IN PLACE
    cards.sort( (a, b) => { return (a.value - b.value); });
    let index = cards[0].value;
    let valid = true;
    for(let i = 1; i < cards.length; i++){
      if(cards[i].name === 'A'){
        //CHECK VALID AS 1 OR 14
        if(
          (14 - index !== i) ||
          (1 - index !== i)
        ){
          valid = false;
        }
      }else if(cards[i].value - index != i){
        valid = false;
      }
    }
    //console.log('checkStraight',cards, valid);
    if(valid){
      return cards[i].value;
    }
    return valid;
  }
  
  /**
   * Checks for 4 of a Kind and returns the matched value, or false if not matched.
   * @param {array} cards The array of cards to search.
   * @return {int|boolean} The value of a matching 4 of a Kind, or false if no valid match found.
   */
  checkFourOfAKind(cards){
    let values = cards.map( c => { return c.value; } );
    let mostCommon = this.mode(values.slice());
    let commonCount = values.filter( val => { return val === mostCommon }).length;
    let returnVal = false;
    if(commonCount === 4){
      returnVal = mostCommon;
    }
    //console.log('fourOfAKind', mostCommon, commonCount, returnVal);
    return returnVal;
  }
  
  checkFullHouse(cards)
  {
    let returnVal = false;
    let threeMatch = this.checkThreeOfAKind(cards);
    if(threeMatch){
      //CHECK REMAINING TWO FORM A PAIR
      let values = cards.map( c => { return c.value; } );
      values = values.filter( c => { return c !== threeMatch});
      if(values[0] == values[1]){
        returnVal = [threeMatch, values[0]];
      }
    }
    //console.log('fullHouse', threeMatch, returnVal);
    return returnVal;
  }
  
  checkThreeOfAKind(cards)
  {
    let returnVal = false;
    let values = cards.map(c => { return c.value; });
    let mostCommon = this.mode(values.slice());
    let commonCount = values.filter(val => { return val === mostCommon }).length;
    if (commonCount === 3) {
      returnVal = mostCommon;
    }
    //console.log('threeOfAKind', mostCommon, commonCount, returnVal);
    return returnVal;
  }
  
  checkOnePair(cards)
  {
    let returnVal = false;
    let values = cards.map(c => { return c.value; });
    let mostCommon = this.mode(values.slice());
    let commonCount = values.filter(val => { return val === mostCommon }).length;
    if (commonCount === 2) {
      returnVal = mostCommon;
    }
    //console.log('onePair', mostCommon, commonCount, returnVal);
    return returnVal;
  }
}