//var h,m,s;
//var midx, midy, len, angh, angm, angs;

function startTime(){
    today=new Date();
    h=today.getHours();
    m=today.getMinutes();
    s=today.getSeconds();
    ord = "";
    
        if (h < 12){
            ord = "AM";
        }else{
            ord = "PM";
            if (h > 12){
            h-=12;
            }   
        }
        
    //add a zero in front of numbers<10
    m=checkTime(m);
    s=checkTime(s);
    
    //if (h=12){
    //    h=0;
    //    }
    // Pass time to canvas and draw
    cnv(h,m,s);
    // Repeat this at intervals <~ 1000ms
    t=setTimeout(function(){startTime()},100);
}

function cnv(hr,mn,sc){

	bgCol = document.getElementById('bgCol').value;
	
	tCol = document.getElementById('timeDisplayCol').value;
    tSize = document.getElementById('timeDisplaySize').value;
	
	bgBorderCol = document.getElementById('bgBorderCol').value;
    bgBorderSize = document.getElementById('bgBorderSize').value;

	if (document.getElementById('timeDisplaySet').checked == true){
   		timeDisplay =hr+":"+mn+":"+sc+" "+ord;
		document.getElementById('usertimehead').innerHTML = "&lt;h1 id='clocktxt'&gt;&lt;/h1&gt;";
		document.getElementById('usertimedisplay').innerHTML = "document.getElementById('clocktxt').innerHTML=h+':'+m+':'+s+' '+ord;";
    }else{
        timeDisplay ="";
        document.getElementById('usertimehead').innerHTML = "&nbsp;";
		document.getElementById('usertimedisplay').innerHTML = "&nbsp;";
    }
    
    document.getElementById('clocktxt').style.fontSize = tSize+ 'pt';
    document.getElementById('clocktxt').style.color = tCol;
    document.getElementById('clocktxt').innerHTML=timeDisplay;

    // SETUP - NOTE: ALL DERIVED FROM CANVAS WID/HGT
    var c = document.getElementById('clockcnv');
    var ctx = c.getContext('2d');
    //cwid = c.width;
    //chgt = c.height;
    var cwid = document.getElementById('userwidth').value;
    var chgt = document.getElementById('userheight').value;
    document.getElementById('userclockvals').innerHTML = "width=&quot;"+cwid+"&quot; height=&quot;"+chgt+"&quot;";

    c.width = cwid;
    c.height = chgt;        
    midx = cwid/2;
    midy = chgt/2; 
    // Len is the universal scale factor
    len = 0.95*Math.min(midx,midy);

    // CLOCK FACE
    ctx.fillStyle = bgCol;
    
	if (document.getElementById('bgSet').checked == true){
		ctx.fillRect(0,0,2*midx,2*midy);
		document.getElementById('clockbg').innerHTML = "/* Custom BG */ ctx.fillStyle = '" + document.getElementById('bgCol').value + "'; ctx.fillRect(0,0,2*midx,2*midy);";
	}else{
		document.getElementById('clockbg').innerHTML = "/* clear canvas */ ctx.clearRect ( 0 , 0 , cwid, chgt );";
	}
	
	ctx.strokeStyle = bgBorderCol;

	if (document.getElementById('bgBorderSet').checked == true){
        ctx.moveTo(0,0);
        ctx.lineWidth = bgBorderSize;
        ctx.strokeRect(0,0,2*midx,2*midy);
        ctx.stroke();
		document.getElementById('bgborder').innerHTML = "ctx.moveTo(0,0); ctx.lineWidth = " + bgBorderSize + "; ctx.strokeRect(0,0,2*midx,2*midy); ctx.stroke();";
    }else{
		document.getElementById('bgborder').innerHTML = "";
	}
	
    ctx.beginPath();
    ctx.moveTo(midx+len,midy);
    ctx.lineWidth = document.getElementById('fBorderSize').value;
	ctx.strokeStyle = document.getElementById('fBorderCol').value;
	document.getElementById('faceborderset').innerHTML = "ctx.lineWidth = " + document.getElementById('fBorderSize').value + "; ctx.strokeStyle = '" + document.getElementById('fBorderCol').value + "';";
    ctx.arc(midx,midy,len,0,2*Math.PI); 
	if (document.getElementById('fBorderSet').checked == true){
		ctx.stroke();
		document.getElementById('faceborderdraw').innerHTML = "ctx.stroke()";
	}else{
		document.getElementById('faceborderdraw').innerHTML = "";
	}
    
	if (document.getElementById('faceSet').checked == true){
		ctx.fillStyle = document.getElementById('faceCol').value;
		ctx.fill();
		document.getElementById('facebg').innerHTML = "ctx.fillStyle = '" + document.getElementById('faceCol').value + "'; ctx.fill();";
	}else{
		document.getElementById('facebg').innerHTML = "";
	}

	lenf = 0.5;
	//Angle = hr & factor of mn with canvas rotation factor of 3pi/2
	angh = ((hr + (mn/60)) / 12) * (2*Math.PI) + (3*Math.PI/2);

	if (document.getElementById('hourHandSet').checked == true){
		// HR
		ctx.strokeStyle = document.getElementById('hourHandCol').value;
		ctx.lineWidth = document.getElementById('hourHandSize').value;
		ctx.beginPath();
		ctx.moveTo(midx,midy);
		ctx.lineTo(midx + (lenf*len) * Math.cos(angh), midy + (lenf*len) * Math.sin(angh));
		ctx.stroke();
		document.getElementById('hourhand').innerHTML = "ctx.strokeStyle = '" + document.getElementById('hourHandCol').value + "'; ctx.lineWidth = " + document.getElementById('hourHandSize').value + "; ctx.beginPath(); ctx.moveTo(midx,midy); ctx.lineTo(midx + (lenf*len) * Math.cos(angh), midy + (lenf*len) * Math.sin(angh));	ctx.stroke();";
		
	}else{
		document.getElementById('hourhand').innerHTML = "";
	}	
		
	if (document.getElementById('hourEndSet').checked == true){
		// HR HAND DOT
		//ctx.fillStyle = "#FFFFFF";
		//ctx.moveTo(midx + (lenf*len) * Math.cos(angh), midy + (lenf*len) * Math.sin(angh));
		//ctx.arc(midx + (lenf*len) * Math.cos(angh), midy + (lenf*len) * Math.sin(angh),(len/20),0,2*Math.PI,false);
		//ctx.fill();
		// HR HAND TRI
		ctx.beginPath();
		ctx.moveTo(midx,midy);
		ctx.fillStyle = document.getElementById('hourEndCol').value;
		p1ang = angh - ((document.getElementById('hourEndSize').value / 180) * Math.PI);
		ctx.moveTo(midx + (lenf*len) * Math.cos(p1ang), midy + (lenf*len) * Math.sin(p1ang));
		p2ang = angh + ((document.getElementById('hourEndSize').value / 180) * Math.PI);
		ctx.lineTo(midx + (lenf*len) * Math.cos(p2ang), midy + (lenf*len) * Math.sin(p2ang));
		ctx.lineTo(midx + (1.1*lenf*len) * Math.cos(angh), midy + (1.1*lenf*len) * Math.sin(angh));
		ctx.fill();
		document.getElementById('hourend').innerHTML = "ctx.beginPath(); ctx.moveTo(midx,midy); ctx.fillStyle = '" + document.getElementById('hourEndCol').value + "'; p1ang = angh - ((" + document.getElementById('hourEndSize').value + "/ 180) * Math.PI); ctx.moveTo(midx + (lenf*len) * Math.cos(p1ang), midy + (lenf*len) * Math.sin(p1ang)); p2ang = angh + (( " + document.getElementById('hourEndSize').value + "/ 180) * Math.PI);	ctx.lineTo(midx + (lenf*len) * Math.cos(p2ang), midy + (lenf*len) * Math.sin(p2ang)); ctx.lineTo(midx + (1.1*lenf*len) * Math.cos(angh), midy + (1.1*lenf*len) * Math.sin(angh)); ctx.fill();";
		
	}else{
		document.getElementById('hourend').innerHTML = "";
	}
	
    // MN
    lenf = 0.75;
	angm = (mn/60)* (2*Math.PI) + (3*Math.PI/2);
	if (document.getElementById('minHandSet').checked == true){
		ctx.strokeStyle = document.getElementById('minHandCol').value;
		ctx.lineWidth = document.getElementById('minHandSize').value;
		ctx.beginPath();
		ctx.moveTo(midx,midy);
		ctx.lineTo(midx + (lenf*len) * Math.cos(angm), midy + (lenf*len) * Math.sin(angm));
		ctx.stroke();
		document.getElementById('minhand').innerHTML = "ctx.strokeStyle = '" + document.getElementById('minHandCol').value + "'; ctx.lineWidth = " + document.getElementById('minHandSize').value + "; ctx.beginPath(); ctx.moveTo(midx,midy); ctx.lineTo(midx + (lenf*len) * Math.cos(angm), midy + (lenf*len) * Math.sin(angm)); ctx.stroke();";
	}else{
		document.getElementById('minhand').innerHTML = "";
	}
	
	if (document.getElementById('minEndSet').checked == true){
		// MN HAND DOT
		//ctx.fillStyle = "#000000";
		//ctx.moveTo(midx + (lenf*len) * Math.cos(angm), midy + (lenf*len) * Math.sin(angm));
		//ctx.arc(midx + (lenf*len) * Math.cos(angm), midy + (lenf*len) * Math.sin(angm),(len/40),0,2*Math.PI,false);
		//ctx.fill();
		// MIN HAND TRI
		ctx.beginPath();
		ctx.moveTo(midx,midy);
		ctx.fillStyle = document.getElementById('minEndCol').value;
		p1ang = angm - ((document.getElementById('minEndSize').value / 180) * Math.PI);
		ctx.moveTo(midx + (lenf*len) * Math.cos(p1ang), midy + (lenf*len) * Math.sin(p1ang));
		p2ang = angm + ((document.getElementById('minEndSize').value / 180) * Math.PI);
		ctx.lineTo(midx + (lenf*len) * Math.cos(p2ang), midy + (lenf*len) * Math.sin(p2ang));
		ctx.lineTo(midx + (1.1*lenf*len) * Math.cos(angm), midy + (1.1*lenf*len) * Math.sin(angm));
		ctx.fill();
		document.getElementById('minend').innerHTML = "ctx.beginPath(); ctx.moveTo(midx,midy); ctx.fillStyle = '" + document.getElementById('minEndCol').value + "'; p1ang = angm - ((" + document.getElementById('minEndSize').value + "/ 180) * Math.PI); ctx.moveTo(midx + (lenf*len) * Math.cos(p1ang), midy + (lenf*len) * Math.sin(p1ang)); p2ang = angm + ((" + document.getElementById('minEndSize').value + "/ 180) * Math.PI); ctx.lineTo(midx + (lenf*len) * Math.cos(p2ang), midy + (lenf*len) * Math.sin(p2ang)); ctx.lineTo(midx + (1.1*lenf*len) * Math.cos(angm), midy + (1.1*lenf*len) * Math.sin(angm)); ctx.fill();";
		
	}else{
		document.getElementById('minend').innerHTML = "";
	}	
	
    // SC
    lenf = 0.9;
	angs = (sc/60)* (2*Math.PI) + (3*Math.PI/2);
	if (document.getElementById('secHandSet').checked == true){
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = Math.max(1,len/100);
		ctx.beginPath();
		ctx.moveTo(midx,midy);
		ctx.moveTo(midx,midy);
		ctx.lineTo(midx + (lenf*len) * Math.cos(angs), midy + (lenf*len) * Math.sin(angs));
		ctx.stroke(); 
		document.getElementById('sechand').innerHTML = "ctx.strokeStyle = '#FF0000'; ctx.lineWidth = Math.max(1,len/100); ctx.beginPath(); ctx.moveTo(midx,midy); ctx.moveTo(midx,midy); ctx.lineTo(midx + (lenf*len) * Math.cos(angs), midy + (lenf*len) * Math.sin(angs)); ctx.stroke(); ";

	}else{
		document.getElementById('sechand').innerHTML = "";
	}

	if (document.getElementById('secEndSet').checked == true){
		// SC HAND DOT
		//ctx.fillStyle = "#FF0000";
		//ctx.moveTo(midx + (lenf*len) * Math.cos(angs), midy + (lenf*len) * Math.sin(angs));
		//ctx.arc(midx + (lenf*len) * Math.cos(angs), midy + (lenf*len) * Math.sin(angs),(len/50),0,2*Math.PI,false);
		//ctx.fill();
		// HR HAND TRI
		ctx.beginPath();
		ctx.moveTo(midx,midy);
		ctx.fillStyle = document.getElementById('secEndCol').value;
		p1ang = angs - ((document.getElementById('secEndSize').value / 180) * Math.PI);
		ctx.moveTo(midx + (lenf*len) * Math.cos(p1ang), midy + (lenf*len) * Math.sin(p1ang));
		p2ang = angs + ((document.getElementById('secEndSize').value / 180) * Math.PI);
		ctx.lineTo(midx + (lenf*len) * Math.cos(p2ang), midy + (lenf*len) * Math.sin(p2ang));
		ctx.lineTo(midx + (1.1*lenf*len) * Math.cos(angs), midy + (1.1*lenf*len) * Math.sin(angs));
		ctx.fill();
		document.getElementById('secend').innerHTML = "ctx.beginPath(); ctx.moveTo(midx,midy); ctx.fillStyle = '" + document.getElementById('secEndCol').value + "'; p1ang = angs - ((" + document.getElementById('secEndSize').value + "/ 180) * Math.PI); ctx.moveTo(midx + (lenf*len) * Math.cos(p1ang), midy + (lenf*len) * Math.sin(p1ang));	p2ang = angs + ((" + document.getElementById('secEndSize').value + "/ 180) * Math.PI); ctx.lineTo(midx + (lenf*len) * Math.cos(p2ang), midy + (lenf*len) * Math.sin(p2ang)); ctx.lineTo(midx + (1.1*lenf*len) * Math.cos(angs), midy + (1.1*lenf*len) * Math.sin(angs)); ctx.fill();";	
	}else{
		document.getElementById('secend').innerHTML = "";
	}
	
    // SMALL CIRCLE TO COVER ENDS OF HANDS
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(midx,midy);
    // Len/40 is width of HR hand (the widest)
    ctx.arc(midx,midy,(len/40),0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.fill();

    // TEXT
	//fSet = document.getElementById('fNumberSet').checked;
	fNumberCol = document.getElementById('fNumberCol').value;
    // If Min(CWid,CHgt) >~ 105
        if ((len > 50)&&(document.getElementById('fNumberSet').checked == true)){

			f = (len/10);
            //fv = f.toPrecision(2);
            fv = f.toFixed(0);
            //fv = Math.min(30,fv);
            fontval = fv+"pt Verdana";
            ctx.font = fontval;
            //ctx.font = '30pt Verdana';
            // Use strokeText for hollow, fillText for solid numbers
            //ctx.strokeStyle = 'white';
            ctx.fillStyle = fNumberCol;
    
            for (i = 1; i < 13; i++){
                textx = midx + (lenf*len) * Math.cos((i/12)* (2*Math.PI) + (3*Math.PI/2));
                texty = midy + (lenf*len) * Math.sin((i/12)* (2*Math.PI) + (3*Math.PI/2));
                // Adjust as text drawn from top left (alignment)
                //if (i > 3){
                textx = textx - 0.06*len;
                texty = texty + 0.04*len;
                //}
			        //ctx.strokeText(i, textx, texty);
			        ctx.fillText(i, textx, texty);
            }
			
			document.getElementById('facenumbers').innerHTML = "ctx.font = '" + fontval + "'; ctx.fillStyle = '" + fNumberCol + "'; for (i = 1; i < 13; i++){ textx = midx + (lenf*len) * Math.cos((i/12)* (2*Math.PI) + (3*Math.PI/2)); texty = midy + (lenf*len) * Math.sin((i/12)* (2*Math.PI) + (3*Math.PI/2)); /*Adjust as text drawn from top left (alignment)*/ textx = textx - 0.06*len; texty = texty + 0.04*len; ctx.fillText(i, textx, texty); } ";

        } else {
			
			document.getElementById('facenumbers').innerHTML = "";
		
		}
        //document.getElementById('debug').innerHTML="<br>Len: "+len+"<br>CNVw: "+cwid+"<br>CNVh: "+chgt+"<br>TXT: "+fontval;
}
 
function checkTime(i){
    if (i<10){
        i="0" + i;
    }
    return i;
}

