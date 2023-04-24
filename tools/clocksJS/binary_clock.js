var hrs = 0;
var mns = 0;
var i = 0;
var x = null;

function mainLoop(){
	binary_time();
	timer = setTimeout(function(){mainLoop()},100);
}

function binary_time(){
	today=new Date();
	hrs=today.getHours();
	mns=today.getMinutes();
	scs=today.getSeconds();
	hra = Math.floor(hrs / 10);
	hrb = 1 * (hrs - (10*hra));
	mna = Math.floor(mns / 10);
	mnb = 1 * (mns - (10*mna));
	sca = Math.floor(scs / 10);
	scb = 1 * (scs - (10*sca));
	document.getElementById('time').innerHTML = hra + '' + hrb + '   :   ' + mna + '' + mnb + '   :   ' + sca + '' + scb;
	
	x = document.getElementsByClassName('timedot');
	for (i = 0; i < x.length; i++) {
	  x[i].style.backgroundColor = '#000';
	}
	hraD = convertToBinary(hra);
	lightUp(hraD,1);
	hrbD = convertToBinary(hrb);
	lightUp(hrbD,2);
	mnaD = convertToBinary(mna);
	lightUp(mnaD,3);
	mnbD = convertToBinary(mnb);
	lightUp(mnbD,4);
	scaD = convertToBinary(sca);
	lightUp(scaD,5);
	scbD = convertToBinary(scb);
	lightUp(scbD,6);

	//document.getElementById('convTime').innerHTML = '[' + hraD + ', ' + hrbD + '] : [' + mnaD + ', ' + mnbD + '] : [' + scaD + ', ' + scbD + ']';
	
}

function lightUp(input,pos){
	
	arr = input.split('');
	len = arr.length;
	if (pos == 1){
		max = 2;
		//console.log('pos'+pos+' max = '+max);
	}else if((pos == 3 )||(pos == 5)){
		max = 3;
		//console.log('pos'+pos+' max = '+max);
	}else{
		max = 4;
		//console.log('pos'+pos+' max = '+max);
	}
	
	for (a = len-1; a >= 0;a--){
		el = 't' + pos + '' + ((max - len) + a);
		//console.log(el + ' TEST');
		if (arr[a] == '1'){
			document.getElementById(el).style.backgroundColor = '#0e0';
			//console.log(el + ' ON');
		}else{
			document.getElementById(el).style.backgroundColor = '#000';
			//console.log(el + ' OFF');
		}
	}	
	
}

function convertToBinary(input){
	
	a = 0;
	i = 0;
	max = 6;
	length = 1;
	for (i = 0; i < max; i++){
		a = Math.pow(2,i);
		if (input >= a){
			length = i + 1;
			//console.log(input+' >= '+a);
		}
	}
	//console.log('Input = '+input+', length = '+length);
	output = "";
	a = 0;
	for (i = length; i > 0; i--){
		a = Math.pow(2,i-1);
		if (input >= a){
			output = output + "1";
			a = Math.pow(2,i-1);
			//console.log('ADD 1, Input = '+input+' ('+i+'/'+length+') subtract '+a);
			input -= a;
		}else{
			output = output + "0";
			//console.log('ADD 0, Input = '+input+' ('+i+'/'+length+')');
		}
	}
	return output;
}