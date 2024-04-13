
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
changePlayerStat => (playerId, stat) => {
  let bearEl = document.getElementById('bearStat' + playerId);
  let bear = parseInt(bearEl.innerHTML);

  let criminalEl = document.getElementById('criminalStat' + playerId);
  let criminal = parseInt(criminalEl.innerHTML);

let endTextEl = document.getElementById('endText' + playerId);
  switch(stat){
    case 'bear':
      bear++;
      criminal--;
      if(bear === 6){
        endTextEl.innerHTML = 'BEAR!';
      }
    break;
    case 'criminal':
      bear--;
      criminal++;
      if(criminal === 6){
        endTextEl.innerHTML = 'CRIM!';
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
  bearNameEl.innerHTML = 'Name';
  bearNameEl.value = 'Name';
  bearNameEl.className = 'w3-input w3-small';
  bearNameTd.appendChild(bearNameEl);
  row.appendChild(bearNameTd);

  let bearStatTd = document.createElement('td');
  let bearStatEl = document.createElement('b');
  bearStatEl.id = 'bearStat' + newPlayerId;
  bearStatEl.innerHTML = '3';
  bearStatTd.appendChild(bearStatEl);
  row.appendChild(bearStatTd);

  let bearBtnTd = document.createElement('td');
  let bearBtn = document.createElement('button');
  bearBtn.innerHTML = '+ Bear';
  bearBtn.onclick = function(){ changePlayerStat(newPlayerId, 'bear')};
  bearBtnTd.appendChild(bearBtn);
  row.appendChild(bearBtnTd);

  let crimBtnTd = document.createElement('td');
  let crimBtn = document.createElement('button');
  crimBtn.innerHTML = '+ Crim';
  crimBtn.onclick = function(){ changePlayerStat(newPlayerId, 'criminal') };
  crimBtnTd.appendChild(crimBtn);
  row.appendChild(crimBtnTd);

  let crimStatTd = document.createElement('td');
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

const changeType = () => {
  const type = document.getElementById('type');
  let tIndex = type.selectedIndex - 1;
  let typeAndSkill = json.players.typeAndSkill[tIndex];
document.getElementById('skill').innerHTML = typeAndSkill.skill;
}