
//FOR CHARACTER SHEET
const changeStat = (stat) => {

  let bearEl = document.getElementById('bearStat');
  let bear = parseInt(bearEl.innerHTML);

  let criminalEl = document.getElementById('criminalStat');
  let criminal = parseInt(criminalEl.innerHTML);
  switch(stat){
    case 'bear':
      bear++;
      criminal--;
      if(bear === 6){
        alert('End - you go full bear!');
      }
    break;
    case 'criminal':
      bear--;
      criminal++;
      if(criminal === 6){
        alert('End - you go full crim!');
      }
    break;
  }
  criminalEl.innerHTML = criminal;
  bearEl.innerHTML = bear;
}

//FOR GAME SHEET
const changePlayerStat = (playerId, stat) => {
  let bearEl = document.getElementById('bearStat' + playerId);
  let bear = parseInt(bearEl.innerHTML);

  let criminalEl = document.getElementById('criminalStat' + playerId);
  let criminal = parseInt(criminalEl.innerHTML);

let endTextEl = document.getElementById('endText' + playerId);
  switch(stat){
    case 'bear':
      bear++;
      criminal--;
      if(bear >= 6){
        endTextEl.innerHTML = 'BEAR!';
      }else{
        endTextEl.innerHTML = '';
      }
    break;
    case 'criminal':
      bear--;
      criminal++;
      if(criminal >= 6){
        endTextEl.innerHTML = 'CRIM!';
      }else{
        endTextEl.innerHTML = '';
      }
    break;
  }
  criminalEl.innerHTML = criminal;
  bearEl.innerHTML = bear;
}

const addPlayer = () => {
  let playerTableEl = document.getElementById('playerTable');

  //TOP ROW = 1st SO SUBTRACT 1
  let newPlayerId = playerTableEl.children.length - 1;
  
  let row = document.createElement('tr');
  
  let bearNameTd = document.createElement('td');
  bearNameTd.style = 'width:30%';
  let bearNameEl = document.createElement('input');
  bearNameEl.placeholder = 'Name';
  bearNameEl.className = 'w3-input w3-small';
  bearNameTd.appendChild(bearNameEl);
  row.appendChild(bearNameTd);

  let bearStatTd = document.createElement('td');
  bearStatTd.style.textAlign = "center";
  let bearStatEl = document.createElement('b');
  bearStatEl.id = 'bearStat' + newPlayerId;
  bearStatEl.innerHTML = '3';
  bearStatTd.appendChild(bearStatEl);
  row.appendChild(bearStatTd);

  let bearBtnTd = document.createElement('td');
  let bearBtn = document.createElement('button');
  bearBtn.className = "w3-btn w3-brown";
  bearBtn.style.width = "100%";
  bearBtn.innerHTML = '+ Bear';
  bearBtn.onclick = function(){ changePlayerStat(newPlayerId, 'bear')};
  //bearBtn.onclick = "changePlayerStat(" + newPlayerId + ", 'bear')";
  bearBtnTd.appendChild(bearBtn);
  row.appendChild(bearBtnTd);

  let crimBtnTd = document.createElement('td');
  let crimBtn = document.createElement('button');
  crimBtn.className = "w3-btn w3-grey";
  crimBtn.style.width = "100%";
  crimBtn.innerHTML = '+ Crim';
  crimBtn.onclick = function(){ changePlayerStat(newPlayerId, 'criminal') };
  //crimBtn.onclick = "changePlayerStat( " + newPlayerId + ", 'criminal')";
  crimBtnTd.appendChild(crimBtn);
  row.appendChild(crimBtnTd);

  let crimStatTd = document.createElement('td');
  crimStatTd.style.textAlign = "center";
  let crimStatEl = document.createElement('b');
  crimStatEl.id = 'criminalStat' + newPlayerId;
  crimStatEl.innerHTML = '3';
  crimStatTd.appendChild(crimStatEl);
  row.appendChild(crimStatTd);

  let endTextTd = document.createElement('td');
  let endTextEl = document.createElement('b');
  endTextEl.id = 'endText' + newPlayerId;
  endTextEl.innerHTML = '';
  endTextTd.appendChild(endTextEl);
  row.appendChild(endTextTd);

  playerTableEl.appendChild(row);
}

const updateType = (ev) => {
  
  //const type = document.getElementById('type');
  //let tIndex = type.selectedIndex - 1;
  let tIndex = ev.target.selectedIndex - 1;
  let typeAndSkill = json.players.typeAndSkill[tIndex];
document.getElementById('skill').innerHTML = typeAndSkill.skill;
}

const updateAccessory = (ev) => {
 
  let accIndex = ev.target.selectedIndex - 1;
  if(accIndex === -1){
        document.getElementById('accessoryModifier').innerHTML = 0;
  }else{
    let accessory = json.players.outfit.accessory[accIndex];
  document.getElementById('accessoryModifier').innerHTML = accessory.scoreModifier;

   let hbsEl = document.getElementById('HBS');
  hbsEl.innerHTML = getHBS();
  }
}

const updateHBS = (ev) => {
  let hbsEl = document.getElementById('HBS');
  hbsEl.innerHTML = getHBS();
}

const getHBS = () => {
  //top desc 
  let topDEl = document.getElementById('topDescriptor');
  //THE SCORES ARE 1-INDEXED, SO NO NEED TO SUBTRACT HERE
  let tDIndex = topDEl.selectedIndex;

  //top item 
  let topIEl = document.getElementById('topItem');
  //THE SCORES ARE 1-INDEXED, SO NO NEED TO SUBTRACT HERE
  let tIIndex = topIEl.selectedIndex;

  //btm desc 
  let btmDEl = document.getElementById('btmDescriptor');
  //THE SCORES ARE 1-INDEXED, SO NO NEED TO SUBTRACT HERE
  let bDIndex = btmDEl.selectedIndex ;

  //btm item 
  let btmIEl = document.getElementById('btmItem');
  //THE SCORES ARE 1-INDEXED, SO NO NEED TO SUBTRACT HERE
  let bIIndex = btmIEl.selectedIndex;

  //acc mod 
  let accEl = document.getElementById('accessory');
  let accMod = 0;
  //THIS ONE IS TO GET FROM THE JSON ARRAY, SO DO SUBTRACT!
  let accIndex = accEl.selectedIndex - 1;
if(accIndex === -1){
    accMod = 0;
  }else{
    accMod = parseInt(json.players.outfit.accessory[accIndex].scoreModifier);
}

  //DEBUGGING
  console.log('tDIndex: ' + tDIndex);
  console.log('tIIndex: ' + tIIndex);
  console.log('bDIndex: ' + bDIndex);
  console.log('bIIndex: ' + bIIndex);
  console.log('accMod: ' + accMod);

  return (tDIndex + tIIndex + bDIndex + bIIndex + accMod);

}
