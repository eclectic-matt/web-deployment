const changeStat = (stat) => {

  let bearEl = document.getElementById('bearStat');
  let bear = parseInt(bearEl.innerHTML);

  let criminalEl = document.getElementById('criminalStat');
  let criminal = parseInt(criminalEl.innerHTML);
  switch(stat){
    case 'bear':
      bear++;
      criminal--;
    break;
    case 'criminal':
      bear--;
      criminal++;
    break;
  }
  criminalEl.innerHTML = criminal;
  bearEl.innerHTML = bear;
}