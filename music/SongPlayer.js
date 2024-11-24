class SongPlayer 
{
	music = undefined;
	bpm = 120;
	wholeDuration = 0.5;
	timeouts = [];
	
	playSong = (song) => {
		if(!this.music){
			this.music = new Music();
		}
		//Flexible, defaults to 120bpm
		this.bpm = song.settings.bpm || 120;
		this.wholeDuration = this.calcBeatDuration(this.bpm);
		const channelNames = Object.keys(song).filter( (channel) => {
			return (channel !== 'settings');
		});
		channelNames.forEach( (name) => {
			let notes = song[name].notes;
			//console.log('channel', name, notes );
			let timeIndex = 0;
			notes.forEach( (note) => {
				const noteData = this.extractNote(note);
				//console.log(name, note, noteData);
				this.timeouts.push(setTimeout(this.music.playNote, timeIndex, noteData.keyOctave, noteData.duration));
				timeIndex += noteData.duration;
			})
		})
	}
	
	playRTTTLSong = (song) => {
		if (!this.music) {
			this.music = new Music();
		}
		this.clearTimeouts()
		const songParts = song.split(':');
		console.log(songParts);
		const title = songParts[0];
		
		const re = /(\s*)d=(?<dur>\d+),o=(?<octave>\d+),b=(?<bpm>\d+)/
		const matches = songParts[1].match(re).groups;
		this.defaultDuration = matches.dur.trim();
		this.defaultOctave = parseInt(matches.octave);
		//const bpm = matches.bpm;
		//const octave = matches[2];
		//const bpm = matches[3];
		this.wholeDuration = this.calcBeatDuration(parseInt(matches.bpm));
		
		const notes = songParts[2].split(',');
		console.log(title, matches.bpm, this.defaultDuration, this.defaultOctave);
		let timeIndex = 0;
			notes.forEach( (note) => {
				const noteData = this.extractRTTTLNote(note);
				//console.log(name, note, noteData);
				this.timeouts.push(setTimeout(this.music.playNote, timeIndex, noteData.keyOctave, noteData.duration));
				timeIndex += noteData.duration;
			})
	}
	
	//bpm = 120 => whole note = 0.5s
	calcBeatDuration = (bpm) => {
		return (60 / bpm);
	}
	
	extractNote = (note) => {
		 //Duration - extract the last char
		let durationLetter = note.slice(-1);
		let durations = ['W', 'H', 'Q', 'E', 'S', 'T', 'F'];
		let durIndex = durations.indexOf(durationLetter);
		let duration = this.wholeDuration / ( Math.pow(2, durIndex) ) * 1000;
		
		//Octave - second to last char
		let octave = note.slice(-2, -1);
		//key - first 1/2 chars, find the octave and count up to it
		let key = note.substring(0, note.indexOf(octave) );
		//Return the data
		return {
			duration: duration,
			octave: octave,
			key: key,
			keyOctave: key + octave
		}
	}
	
	/*
	See: https://en.m.wikipedia.org/wiki/Ring_Tone_Text_Transfer_Language
	HauntHouse: d=4,o=5,b=108: 2a4, 2e, 2d#, 2b4, 2a4, 2c, 2d, 2a#4, 2e., e, 1f4, 1a4, 1d#, 2e., d, 2c., b4, 1a4, 1p, 2a4, 2e, 2d#, 2b4, 2a4, 2c, 2d, 2a#4, 2e., e, 1f4, 1a4, 1d#, 2e., d, 2c., b4, 1a4
	*/
	extractRTTTLNote = (note) => {
		note = note.trim();
		//console.log(note);
		const re = /(?<dur>\d*)(?<key>[abcdefgp+#]+)(?<octave>[\d]*)(?<dotting>\.*)/
		let noteParts = note.match(re).groups;
		//console.log(note, noteParts);
		let durationInt = parseInt(noteParts.dur);
		if(!durationInt){
			durationInt = this.defaultDuration;
		}
		let key = noteParts.key.toUpperCase();
		let octave = 200; //Out of hearing range
		//Pause?
		if(key === 'P'){
			key = 'G';
		}else{
			//convert sharps?
			key = this.convertSharps(key);
			octave = noteParts.octave;
			if(octave == ''){
				octave = this.defaultOctave;
			}
		}
		if(noteParts.dotting == '.'){
			durationInt /= 1.5;
		}
		//let durationInt = note.substring(0,1);
		let duration = (this.wholeDuration / durationInt) * 3000;
		/*let key = note.substring(1,2).toUpperCase();
		let octave = note.substring(2,3);
		if(octave == "#"){
			key += octave;
			octave = note.substring(3,4);
		}*/
		console.log(note, duration, key, octave);
		return {
			duration: duration,
			octave: octave,
			key: key,
			keyOctave: key + octave
		}
	}
	
	convertSharps = (note) => {
		if(note.indexOf('#') == -1) return note;
		switch(note){
			case 'A#':
				return 'Bb';
			break;
			case 'B#':
				return 'C';
			break;
			case 'C#':
				return 'Db';
			break;
			case 'D#':
				return 'Eb';
			break;
			case 'E#':
				return 'F';
			break;
			case 'F#':
				return 'Gb';
			break;
			case 'G#':
			default:
				return 'Ab';
			break;
		}
	}
	
	clearTimeouts = () => {
		this.timeouts.forEach( (t) => {
			clearTimeout(t);
		})
	}
}
 