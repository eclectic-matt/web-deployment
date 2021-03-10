'use strict';

/*
 * SAVE GAME
 * Description: Generic save game function, takes an object and saves in cookies
 *
 * @objSave: a js object with key/value pairs of dataName/arrayValues, e.g. 'scores': [2, 4, 5, 6, 8]
 */
function saveGame(objSave, intDays){

  // FOR EACH KEY IN THE SAVE OBJECT
  for (const key in objSave) {
    // GET THE ARRAY/VALUE
    let arrValues = objSave[key];
    // JOIN INTO A STRING
    let strValues = arrValues.join();
    // SET A COOKIE WITH THIS KEY/VALUE PAIR FOR INTDAYS DURATION
    setCookie(key, strValues, intDays);
  }

}

/*
 * LOAD GAME
 * Description: Generic load game function, takes an object and loads from cookies into that object
 *
 * @objLoad: a js object with key/value pairs of dataName/arrayValues, e.g. 'scores': []
 */
function loadGame(objLoad){

  // FOR EACH KEY IN THE LOAD OBJECT
  for (const key in objLoad) {
    // GET STRING OF VALUES FOR THIS KEY FROM THE COOKIE
    let strValues = getCookie(key);
    // SPLIT THE STRING INTO AN ARRAY OF VALUES
    let arrValues = strValues.split(',');
    // STORE THIS ARRAY OF VALUES INTO THE LOAD OBJECT
    objLoad[key] = arrValues;
  }

  // RETURN THE LOAD OBJECT
  return objLoad;

}

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/*
 * CHECK CONFIRMATION
 * Description: Generic check, shows a confirmation box and callsback function only if confirmed
 *
 * @strConfirm: the string with specific text to show in the confirmation box
 * @fnCallback: the function to callback if user confirms OK
 */
function checkConfirm(strConfirm, fnCallback){
  var conf = confirm('Are you sure? ' + strConfirm);
  if (conf == true){
    fnCallback();
  }
}
