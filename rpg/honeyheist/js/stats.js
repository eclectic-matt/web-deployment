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