class Poker extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    
    //SET DIFFICULTY DEFAULTS
    this.cash = 1000 * (6 - difficulty);
    this.currentScore = 0;
    this.currentBet = 0;
    this.betAmount = 200;
    this.handSize = 5;
    this.winningCash = 10000 * difficulty;
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
      'bet',
      'initialDeal',
      'discard',
      'scoreHand'
    ];
    this.stage = this.stages[0];
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
      case 'bet':
        //INITIALISE DECK
        this.init();
        this.hideForm();
        this.showBetForm();
       //this.play();
      break;
      case 'initialDeal':
        this.cards = [];
        for(let i = 0; i < this.handSize; i++){
          
          //WORKING
          this.cards.push(this.deck.splice(0,1)[0]);
          
          //TESTS
          //let testCard = {};
          
          //STRAIGHT FLUSH UP TO 5 - PASS
          //testCard.suit = 'S';
          //testCard.name = this.names[i];
          //testCard.value = this.values[i];
          
          //STRAIGHT - PASS
          //testCard.suit = Math.random() > 0.5 ? 'S' : 'D';
          //testCard.name = this.names[i];
          //testCard.value = this.values[i];
          
          //FLUSH - PASS
          //testCard.suit = this.suits[0]
          //testCard.name = this.names[i*2];
          //testCard.value = this.values[i*2];
          
          //FOUR OF A KIND - PASS 
          /*if(i < this.suits.length){
            testCard.suit = this.suits[i];
            testCard.name = this.names[0];
            testCard.value = this.values[0];
          }else{
            testCard.suit = this.suits[0];
            testCard.name = this.names[1];
            testCard.value = this.values[1];
          }*/
          
          //FULL HOUSE - PASS
          /*if(i < (this.suits.length - 1) ){
            testCard.suit = this.suits[i];
            testCard.name = this.names[0];
            testCard.value = this.values[0];
          }else{
            testCard.suit = this.suits[i-1];
            testCard.name = this.names[1];
            testCard.value = this.values[1];
          }*/
          
          //ADD TO TEST ARRAY
          //this.cards[i] = {...testCard};
          
          //LEAVE HERE - FOR DISCARDS
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
        let payout = this.getPayout(bestHand, this.currentBet);
        this.cash += payout;
        if (this.cash <= 0){
          document.getElementById('bestHandHead').innerHTML = bestHand + '<br>Payout: ' + this.currency(payout) + '<br>Total: ' + this.currency(this.cash) + '<br>YOU HAVE RUN OUT OF MONEY!';
          this.lose();
        }else if(this.cash >= this.winningCash){
          document.getElementById('bestHandHead').innerHTML = bestHand + '<br>Payout: ' + this.currency(payout) + '<br>Total: ' + this.currency(this.cash) + '<br>YOU HAVE WON THE GAME!';
          this.win();
        }else{
          document.getElementById('bestHandHead').innerHTML = bestHand + '<br>Payout: ' + this.currency(payout) + '<br>Total: ' + this.currency(this.cash) + '<br>';
          this.stage = 'bet';
          this.showContinueButton();
      break;
        }
      
    }
  }
  
  showBetForm()
  {
    //TAKE INPUT BET
    let el = document.getElementById('main');
    el.innerHTML = '';
    
    let betInfo = document.createElement('h3');
    betInfo.style.fontSize = '0.95rem';
    betInfo.innerHTML = 'You currently have ' + this.currency(this.cash) + '<br><br>You will win with ' + this.currency(this.winningCash);
    el.appendChild(betInfo);
    
    let betLabel = document.createElement('label');
    betLabel.for = 'betInput';
    betLabel.innerHTML = 'Bet Amount: ';
    el.appendChild(betLabel);
    
    let betInput = document.createElement('select');
    betInput.id = 'betInput';
    let maxBet = 5;
    for(let i = 1; i <= maxBet; i++){
      let thisBet = this.betAmount * i;
      let opt = document.createElement('option');
      opt.value = thisBet;
      if (thisBet === this.currentBet){
        opt.selected = true;
      }
      opt.innerHTML = '£' + thisBet;
      betInput.appendChild(opt);
    }
    el.appendChild(betInput);
    
    el.appendChild(document.createElement('br'));
    el.appendChild(document.createElement('br'));
    
    //OUTPUT "PLACE BET" BUTTON
    let betBtn = document.createElement('button');
    betBtn.id = 'betBtn';
    betBtn.innerHTML = 'Place Bet';
    betBtn.onclick = () => {
      this.betBtn();
    }
    el.appendChild(betBtn);
    
    el.appendChild(document.createElement('br'));
    el.appendChild(document.createElement('br'));
    
    //OUTPUT HANDS VALUES
    /*let handsHead = document.createElement('h3');
    handsHead.innerHTML = 'Hand Payouts:';
    el.appendChild(handsHead);*/
    
    let handsTable = document.createElement('table');
    handsTable.id = 'handsTable';
    let trHandsHead = document.createElement('tr');
    let thHandsName = document.createElement('th');
    thHandsName.innerHTML = 'Hand';
    trHandsHead.appendChild(thHandsName);
    
    let thHandsAmount = document.createElement('th');
    thHandsAmount.innerHTML = 'Amount';
    trHandsHead.appendChild(thHandsAmount);
    
    handsTable.appendChild(trHandsHead);
    
    for(let i = 0; i < this.hands.length; i++){
      let tr = document.createElement('tr');
      tr.style.fontSize = '0.5rem';
      
      let tdHand = document.createElement('td');
      tdHand.innerHTML = this.hands[i];
      tr.appendChild(tdHand);
      
      let payout = this.getPayout(this.hands[i], 1);
      let tdPayout = document.createElement('td');
      tdPayout.innerHTML = 'x' + payout;
      tr.appendChild(tdPayout);
      handsTable.appendChild(tr);
    }
    el.appendChild(handsTable);
  }
  
  betBtn()
  {
    this.currentBet = parseInt(document.getElementById('betInput').value);
    this.cash -= this.currentBet;
    this.stage = 'initialDeal';
    this.play();
  }
  
  showContinueButton()
  {
    let el = document.getElementById('main');
    let btn = document.createElement('button');
    btn.innerHTML = 'Continue';
    btn.onclick = () => {
      this.play();
    }
    el.appendChild(btn);
  }
  
  displayCards()
  {
    document.getElementById('form').style.display = 'none';
    let el = document.getElementById('main');
    el.innerHTML = '';
    
    let betCashTable = document.createElement('table');
    let betCashRow = document.createElement('tr');
    betCashRow.className = 'betCashRow';
    
    let cashTH = document.createElement('th');
    cashTH.style.textAlign = 'left';
    cashTH.innerHTML = 'Total: ' + this.currency(this.cash);
    betCashRow.appendChild(cashTH);
    
    let betTH = document.createElement('th');
    betTH.style.textAlign = 'right';
    betTH.innerHTML = 'Bet: ' + this.currency(this.currentBet);
    betCashRow.appendChild(betTH);
    
    betCashTable.appendChild(betCashRow);
    el.appendChild(betCashTable);
    
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
    console.log(cards);
    let index = cards[0].value;
    let valid = true;
    for(let i = 1; i < cards.length; i++){
      //Sorted on value, aces high
      console.log(i, cards[i].value, index,valid);
      if(cards[i].value - index != i){
        valid = false;
        break;
      }
    }
    console.log('straightAceHigh', valid);
    if(!valid){
      //Check Ace low
      let aceLow = cards.map(c => { return ( c.value === 14 ? 1 : c.value); });
      aceLow.sort( (a, b) => { return (a - b); });
      console.log(aceLow);
      valid = true;
      let index = aceLow[0];
      for (let i = 1; i < aceLow.length; i++) {
        if (aceLow[i] - index != i) {
          valid = false;
          break;
        }
      }
      console.log('straightAceLow', valid, Math.max(...aceLow));
      if(valid){
        //Return highest value of aces low values array
        return Math.max(...aceLow);
      }
    }else{
      // USE TOP VALUE AS RETURN
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
  
  getPayout(hand, bet)
  {
    let score = 0;
    for (let i = 0; i < this.hands.length; i++) {
      if (hand.includes(this.hands[i])) {
        let scoreMult = (this.hands.length - i);
        //HIGH CARD = (1 * 1) - 1 === 0
        score = (scoreMult * scoreMult) - 1;
        break;
      }
    }
    console.log('hand', hand, score);
    return (bet * score) / (this.difficulty * this.difficulty);
  }
}