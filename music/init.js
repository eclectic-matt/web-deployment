//Globally-scoped stuff
var game = new MusicGame();
var context = new AudioContext();
let chordPlayer = new Music();
let songPlayer = new SongPlayer();
let music = new Music();

const notes = ['A4', 'B4', 'C4'];
//D–A–Bm–G
const chords = {
	A: {
		major: ['A', 'Db', 'E'],
		minor: ['A', 'C', 'E']
	},
	Bb: {
		major: ['Bb', 'D', 'F'],
		minor: ['Bb', 'Db', 'F']
	},
	B: {
		major : ['B', 'Eb', 'Gb'],
		minor: ['B', 'D', 'Gb']
	},
	//This is just B but here for completeness
	Cb: {
		major: ['B', 'Eb', 'Gb'],
		minor: ['B', 'D', 'Gb']
	},
	// Starts here...
	C: {
		major: ['C', 'E', 'G'],
		minor: ['C', 'Eb', 'G']
	},
	Db: {
		major: ['Db', 'F', 'Ab'],
		minor: ['Db', 'E', 'Ab']
	},
	D: {
		major: ['D', 'Gb', 'A'],
		minor: ['D', 'F', 'A']
	},
	Eb: {
		major: ['Eb', 'G', 'Bb'],
		minor: ['Eb', 'Gb', 'Bb']
	},
	E: {
		major: ['E', 'Ab', 'B'],
		minor: ['E', 'G', 'B']
	},
	//This is just E but here for completeness?
	Fb: {
		major: ['E', 'Ab', 'B'],
		minor: ['E', 'G', 'B']
	},
	F: {
		major: ['F', 'A', 'C'],
		minor: ['F', 'Ab', 'C']
	},
	Gb: {
		major: ['Gb', 'Bb', 'Db'],
		minor: ['Gb', 'A', 'Db']
	},
	G: {
		major: ['G', 'B', 'D'],
		minor: ['G', 'Bb', 'D']
	},
	Ab: {
		major: ['Ab', 'C', 'Eb'],
		minor: ['Ab', 'Cb', 'F']
	}
}

let fourChords = [
	chords['D']['major'],
	chords['A']['major'],
	chords['B']['minor'],
	chords['G']['major'],
	//
	chords['E']['major'],
	chords['A']['minor'],
	chords['D']['major'],
	chords['G']['major']
	//chords['Db']['major']
];

const Dbmin = chords['Db']['minor'];
const Dmaj = chords['D']['major'];
const Amaj = chords['A']['major'];
const Bmin = chords['B']['minor'];
const Gmaj = chords['G']['major'];
const fourCh = [
	Dmaj,
	Amaj,
	Bmin,
	Gmaj
];

//see https://en.m.wikipedia.org/wiki/SCORE_(software)
/*
 Db5W - A Db on octave 5 played as a Whole note
 C3H - A C on octave 3 played as a Half note (minim)
 B2Q - A B octave 2 Quarter note (crochet)
 Fb3E - An Fb octave 3 Eight note (quaver)
 B3S - A B octave 3 Sixteenth note (semiquaver)
 RE - A Rest played as an Eighth note
 
 B3E/C3E/D3E/F3E
 
 //Duration - extract the last char
 let duration = note.slice(-1);
 //Octave - second to last char
 let octave = note.slice(-2, 1);
 //key - first 1/2 chars, find the octave and count up to it
 let key = note.substr(0, note.indexOf(octave) - 1);
*/

const playRandomSong = () => {
	const song = {
		//CHANNEL 1
		bass: {
			settings: {
				wave: 'square',
				gain: 3
				//....
			},
			notes: [
				"B3W",
				"C3W",
				"E3H",
				"F3H",
				"G3W",
				"E3H",
				"F3H"
			]
		},
		//CHANNEL 2
		melody: {
			settings: {
				wave: 'saw',
				gain: 6
				//...
			},
			notes: [
				"E4W",
				"F4H",
				"G4H",
				"A4W",
				"B4H",
				"C4H",
				"E4Q",
				"G4Q",
				"F4Q",
				"E4Q"
			]
		},
		//...CHANNEL N
		settings: {
			bpm: 30
			//...
		}
	}
	songPlayer.playSong(song);
}


const ringtoneExamples = [
	//Source:
'JingleBell:d=8,o=5,b=112:32p,a,a,4a,a,a,4a,a,c6,f.,16g,2a,a#,a#,a#.,16a#,a#,a,a.,16a,a,g,g,a,4g,4c6',
'Halloween:d=4,o=5,b=180:8d6,8g,8g,8d6,8g,8g,8d6,8g,8d#6,8g,8d6,8g,8g,8d6,8g,8g,8d6,8g,8d#6,8g,8c#6,8f#,8f#,8c#6,8f#,8f#,8c#6,8f#,8d6,8f#,8c#6,8f#,8f#,8c#6,8f#,8f#,8c#6,8f#,8d6,8f#',
'Auld L S:d=4,o=6,b=101:g5,c,8c,c,e,d,8c,d,8e,8d,c,8c,e,g,2a,a,g,8e,e,c,d,8c,d,8e,8d,c,8a5,a5,g5,2c',
'AbbaMammaMia:d=4,o=5,b=40:32f6,32d#6,32f6,32d#6,8p,32d#6,32d#6,32f6,32g6,32f6,32d#6,16p,16f6,32d#6,16p,16g#6,32g#6,32g#6,32g#6,16g6,16d#6,16p,32f6,32d#6,32f6,32d#6,8p,32d#6,32d#6,32f6,32g6,32f6,32d#6,16p,16f6,32d#6,16p,16g#6,32g#6,32g#6,32g#6,16g6,16d#6,16p,16a#.6,32a#6,32a#6,16a#6,16f6,16g6,16g#6,16p,32p,16g.6,32g6,32g6,16g6,16d6,16d#6,16f6,16p,32p,16f6,16d#6,32p,16g#6,32g#6,32g#6,32g#6,32g6,32d#6,32f6,32d#6',
'BobMarleyNowomannocry:d=8,o=5,b=140:4c.6,b.,c.6,b.,4b.,2a.,2p,4p,p,16p,4e.6,f.6,e.6,d.6,2c.6,1p,4p,p,4c.6,b.,d.6,c.6,2a.,1p,4p,p,4e.6,f.6,e.6,d.6,2c.6,1p,4p,p',
'DireStraitsSultans:d=8,o=6,b=160:f,a,f,a,f,g,f,g,4p,f,f,d,f,d,f,p,d,e,p,4a5,4p,1p,2p,a,a,a,a,g,g,g,g,g,4a,p,a,f,4e.,1p,1p,p,f,a,c7,c7,a,c7,a,4p,p,a#,a,4g,4c.,2p,1p,p,d,f,d,4f,4p,f,d,f,d,f,4f,4d.,4p,1p,1p,p,f,g,4g,4g,4p,1p,g,4g,2a,2g,f,4d,4d.',
'Fugees-KillingMeSoftly:d=4,o=5,b=90:p,8e,f.,8g,a.,8g,d,g.,p,8a,g.,8f,e.,8f,c.,2p,8e,f.,8g,a.,8g,a,b,8b,c6,8b,a,g,2a',
'2PacCaliforniaLove:d=4,o=5,b=90:8g.6,16f6,8c#6,8d6,8f6,d.6,2p,8g,8a#,8d6,8d6,p,8p,8g,8g,16g,8f.,8g,2p,8g,16a#,16g,8d6,2d6,16g,8g.,g,2p,8g,8a#,8d6,2d.6,16g,16g,8g,8f,8g,p,8g,8c6,8c6,8a#,8a,g,p,8g,c6,8a#,8a,2g',
'GorillazClintEastwood:d=4,o=5,b=90:16d#6,8c#6,8d#6,a#,8p,16f#,16g#,8a#,8a#,16d#6,8c#6,8d#6,a#,8p,16f#6,8g#6,8a#,16a#,16a#,16p,8a#,8a#,8p,8g#,8g#,16g#,8g#,8g#,8f#,8d#,8c#,8c#,16d#,8d#.,8d#,8c#,16d#,8d#.,8d#,8c#,16d#,8d#.,8d#,8c#,16d#,8d#.',
'Bond:d=4,o=5,b=320:c,8d,8d,d,2d,c,c,c,c,8d#,8d#,2d#,d,d,d,c,8d,8d,d,2d,c,c,c,c,8d#,8d#,d#,2d#,d,c#,c,c6,1b.,g,f,1g.',
'Friends:d=8,o=5,b=100:16d,g,a,c6,b,a,g.,16g,d,g,a,2a,p,16p,16d,g,a,c.6,16b,16a,g.,16c6,b,a,g,2d6,p,16p,16c6,c6,c6,c6,c6,c6,c.6,16c6,b,2b,p,16a,16a,16b,16c6,c6,c6,c6,c.6,16b,a.,16g,g.,16d,16g,16a,b,4a,4g,p',
//Source: https://github.com/dhylands/upy-rtttl/blob/master/songs.py#L8-L34
'Super Mario - Main Theme:d=4,o=5,b=125:a,8f.,16c,16d,16f,16p,f,16d,16c,16p,16f,16p,16f,16p,8c6,8a.,g,16c,a,8f.,16c,16d,16f,16p,f,16d,16c,16p,16f,16p,16a#,16a,16g,2f,16p,8a.,8f.,8c,8a.,f,16g#,16f,16c,16p,8g#.,2g,8a.,8f.,8c,8a.,f,16g#,16f,8c,2c6',
'Super Mario - Title Music:d=4,o=5,b=125:8d7,8d7,8d7,8d6,8d7,8d7,8d7,8d6,2d#7,8d7,p,32p,8d6,8b6,8b6,8b6,8d6,8b6,8b6,8b6,8d6,8b6,8b6,8b6,16b6,16c7,b6,8a6,8d6,8a6,8a6,8a6,8d6,8a6,8a6,8a6,8d6,8a6,8a6,8a6,16a6,16b6,a6,8g6,8d6,8b6,8b6,8b6,8d6,8b6,8b6,8b6,8d6,8b6,8b6,8b6,16a6,16b6,c7,e7,8d7,8d7,8d7,8d6,8c7,8c7,8c7,8f#6,2g6',
'SMBtheme:d=4,o=5,b=100:16e6,16e6,32p,8e6,16c6,8e6,8g6,8p,8g,8p,8c6,16p,8g,16p,8e,16p,8a,8b,16a#,8a,16g.,16e6,16g6,8a6,16f6,8g6,8e6,16c6,16d6,8b,16p,8c6,16p,8g,16p,8e,16p,8a,8b,16a#,8a,16g.,16e6,16g6,8a6,16f6,8g6,8e6,16c6,16d6,8b,8p,16g6,16f#6,16f6,16d#6,16p,16e6,16p,16g#,16a,16c6,16p,16a,16c6,16d6,8p,16g6,16f#6,16f6,16d#6,16p,16e6,16p,16c7,16p,16c7,16c7,p,16g6,16f#6,16f6,16d#6,16p,16e6,16p,16g#,16a,16c6,16p,16a,16c6,16d6,8p,16d#6,8p,16d6,8p,16c6',
    'SMBwater:d=8,o=6,b=225:4d5,4e5,4f#5,4g5,4a5,4a#5,b5,b5,b5,p,b5,p,2b5,p,g5,2e.,2d#.,2e.,p,g5,a5,b5,c,d,2e.,2d#,4f,2e.,2p,p,g5,2d.,2c#.,2d.,p,g5,a5,b5,c,c#,2d.,2g5,4f,2e.,2p,p,g5,2g.,2g.,2g.,4g,4a,p,g,2f.,2f.,2f.,4f,4g,p,f,2e.,4a5,4b5,4f,e,e,4e.,b5,2c.',
    'SMBunderground:d=16,o=6,b=100:c,c5,a5,a,a#5,a#,2p,8p,c,c5,a5,a,a#5,a#,2p,8p,f5,f,d5,d,d#5,d#,2p,8p,f5,f,d5,d,d#5,d#,2p,32d#,d,32c#,c,p,d#,p,d,p,g#5,p,g5,p,c#,p,32c,f#,32f,32e,a#,32a,g#,32p,d#,b5,32p,a#5,32p,a5,g#5',
    'Picaxe:d=4,o=6,b=101:g5,c,8c,c,e,d,8c,d,8e,8d,c,8c,e,g,2a,a,g,8e,e,c,d,8c,d,8e,8d,c,8a5,a5,g5,2c',
    'The Simpsons:d=4,o=5,b=160:c.6,e6,f#6,8a6,g.6,e6,c6,8a,8f#,8f#,8f#,2g,8p,8p,8f#,8f#,8f#,8g,a#.,8c6,8c6,8c6,c6',
    'Indiana:d=4,o=5,b=250:e,8p,8f,8g,8p,1c6,8p.,d,8p,8e,1f,p.,g,8p,8a,8b,8p,1f6,p,a,8p,8b,2c6,2d6,2e6,e,8p,8f,8g,8p,1c6,p,d6,8p,8e6,1f.6,g,8p,8g,e.6,8p,d6,8p,8g,e.6,8p,d6,8p,8g,f.6,8p,e6,8p,8d6,2c6',
    'TakeOnMe:d=4,o=4,b=160:8f#5,8f#5,8f#5,8d5,8p,8b,8p,8e5,8p,8e5,8p,8e5,8g#5,8g#5,8a5,8b5,8a5,8a5,8a5,8e5,8p,8d5,8p,8f#5,8p,8f#5,8p,8f#5,8e5,8e5,8f#5,8e5,8f#5,8f#5,8f#5,8d5,8p,8b,8p,8e5,8p,8e5,8p,8e5,8g#5,8g#5,8a5,8b5,8a5,8a5,8a5,8e5,8p,8d5,8p,8f#5,8p,8f#5,8p,8f#5,8e5,8e5',
    'Entertainer:d=4,o=5,b=140:8d,8d#,8e,c6,8e,c6,8e,2c.6,8c6,8d6,8d#6,8e6,8c6,8d6,e6,8b,d6,2c6,p,8d,8d#,8e,c6,8e,c6,8e,2c.6,8p,8a,8g,8f#,8a,8c6,e6,8d6,8c6,8a,2d6',
    'Muppets:d=4,o=5,b=250:c6,c6,a,b,8a,b,g,p,c6,c6,a,8b,8a,8p,g.,p,e,e,g,f,8e,f,8c6,8c,8d,e,8e,8e,8p,8e,g,2p,c6,c6,a,b,8a,b,g,p,c6,c6,a,8b,a,g.,p,e,e,g,f,8e,f,8c6,8c,8d,e,8e,d,8d,c',
    'Xfiles:d=4,o=5,b=125:e,b,a,b,d6,2b.,1p,e,b,a,b,e6,2b.,1p,g6,f#6,e6,d6,e6,2b.,1p,g6,f#6,e6,d6,f#6,2b.,1p,e,b,a,b,d6,2b.,1p,e,b,a,b,e6,2b.,1p,e6,2b.',
    'Looney:d=4,o=5,b=140:32p,c6,8f6,8e6,8d6,8c6,a.,8c6,8f6,8e6,8d6,8d#6,e.6,8e6,8e6,8c6,8d6,8c6,8e6,8c6,8d6,8a,8c6,8g,8a#,8a,8f',
    '20thCenFox:d=16,o=5,b=140:b,8p,b,b,2b,p,c6,32p,b,32p,c6,32p,b,32p,c6,32p,b,8p,b,b,b,32p,b,32p,b,32p,b,32p,b,32p,b,32p,b,32p,g#,32p,a,32p,b,8p,b,b,2b,4p,8e,8g#,8b,1c#6,8f#,8a,8c#6,1e6,8a,8c#6,8e6,1e6,8b,8g#,8a,2b',
    'Bond:d=4,o=5,b=80:32p,16c#6,32d#6,32d#6,16d#6,8d#6,16c#6,16c#6,16c#6,16c#6,32e6,32e6,16e6,8e6,16d#6,16d#6,16d#6,16c#6,32d#6,32d#6,16d#6,8d#6,16c#6,16c#6,16c#6,16c#6,32e6,32e6,16e6,8e6,16d#6,16d6,16c#6,16c#7,c.7,16g#6,16f#6,g#.6',
    'MASH:d=8,o=5,b=140:4a,4g,f#,g,p,f#,p,g,p,f#,p,2e.,p,f#,e,4f#,e,f#,p,e,p,4d.,p,f#,4e,d,e,p,d,p,e,p,d,p,2c#.,p,d,c#,4d,c#,d,p,e,p,4f#,p,a,p,4b,a,b,p,a,p,b,p,2a.,4p,a,b,a,4b,a,b,p,2a.,a,4f#,a,b,p,d6,p,4e.6,d6,b,p,a,p,2b',
    'StarWars:d=4,o=5,b=45:32p,32f#,32f#,32f#,8b.,8f#.6,32e6,32d#6,32c#6,8b.6,16f#.6,32e6,32d#6,32c#6,8b.6,16f#.6,32e6,32d#6,32e6,8c#.6,32f#,32f#,32f#,8b.,8f#.6,32e6,32d#6,32c#6,8b.6,16f#.6,32e6,32d#6,32c#6,8b.6,16f#.6,32e6,32d#6,32e6,8c#6',
    'GoodBad:d=4,o=5,b=56:32p,32a#,32d#6,32a#,32d#6,8a#.,16f#.,16g#.,d#,32a#,32d#6,32a#,32d#6,8a#.,16f#.,16g#.,c#6,32a#,32d#6,32a#,32d#6,8a#.,16f#.,32f.,32d#.,c#,32a#,32d#6,32a#,32d#6,8a#.,16g#.,d#',
    'TopGun:d=4,o=4,b=31:32p,16c#,16g#,16g#,32f#,32f,32f#,32f,16d#,16d#,32c#,32d#,16f,32d#,32f,16f#,32f,32c#,16f,d#,16c#,16g#,16g#,32f#,32f,32f#,32f,16d#,16d#,32c#,32d#,16f,32d#,32f,16f#,32f,32c#,g#',
    'A-Team:d=8,o=5,b=125:4d#6,a#,2d#6,16p,g#,4a#,4d#.,p,16g,16a#,d#6,a#,f6,2d#6,16p,c#.6,16c6,16a#,g#.,2a#',
    'Flinstones:d=4,o=5,b=40:32p,16f6,16a#,16a#6,32g6,16f6,16a#.,16f6,32d#6,32d6,32d6,32d#6,32f6,16a#,16c6,d6,16f6,16a#.,16a#6,32g6,16f6,16a#.,32f6,32f6,32d#6,32d6,32d6,32d#6,32f6,16a#,16c6,a#,16a6,16d.6,16a#6,32a6,32a6,32g6,32f#6,32a6,8g6,16g6,16c.6,32a6,32a6,32g6,32g6,32f6,32e6,32g6,8f6,16f6,16a#.,16a#6,32g6,16f6,16a#.,16f6,32d#6,32d6,32d6,32d#6,32f6,16a#,16c.6,32d6,32d#6,32f6,16a#,16c.6,32d6,32d#6,32f6,16a#6,16c7,8a#.6',
    'Jeopardy:d=4,o=6,b=125:c,f,c,f5,c,f,2c,c,f,c,f,a.,8g,8f,8e,8d,8c#,c,f,c,f5,c,f,2c,f.,8d,c,a#5,a5,g5,f5,p,d#,g#,d#,g#5,d#,g#,2d#,d#,g#,d#,g#,c.7,8a#,8g#,8g,8f,8e,d#,g#,d#,g#5,d#,g#,2d#,g#.,8f,d#,c#,c,p,a#5,p,g#.5,d#,g#',
    'Gadget:d=16,o=5,b=50:32d#,32f,32f#,32g#,a#,f#,a,f,g#,f#,32d#,32f,32f#,32g#,a#,d#6,4d6,32d#,32f,32f#,32g#,a#,f#,a,f,g#,f#,8d#',
    'Smurfs:d=32,o=5,b=200:4c#6,16p,4f#6,p,16c#6,p,8d#6,p,8b,p,4g#,16p,4c#6,p,16a#,p,8f#,p,8a#,p,4g#,4p,g#,p,a#,p,b,p,c6,p,4c#6,16p,4f#6,p,16c#6,p,8d#6,p,8b,p,4g#,16p,4c#6,p,16a#,p,8b,p,8f,p,4f#',
    'MahnaMahna:d=16,o=6,b=125:c#,c.,b5,8a#.5,8f.,4g#,a#,g.,4d#,8p,c#,c.,b5,8a#.5,8f.,g#.,8a#.,4g,8p,c#,c.,b5,8a#.5,8f.,4g#,f,g.,8d#.,f,g.,8d#.,f,8g,8d#.,f,8g,d#,8c,a#5,8d#.,8d#.,4d#,8d#.',
    'LeisureSuit:d=16,o=6,b=56:f.5,f#.5,g.5,g#5,32a#5,f5,g#.5,a#.5,32f5,g#5,32a#5,g#5,8c#.,a#5,32c#,a5,a#.5,c#.,32a5,a#5,32c#,d#,8e,c#.,f.,f.,f.,f.,f,32e,d#,8d,a#.5,e,32f,e,32f,c#,d#.,c#',
    'MissionImp:d=16,o=6,b=95:32d,32d#,32d,32d#,32d,32d#,32d,32d#,32d,32d,32d#,32e,32f,32f#,32g,g,8p,g,8p,a#,p,c7,p,g,8p,g,8p,f,p,f#,p,g,8p,g,8p,a#,p,c7,p,g,8p,g,8p,f,p,f#,p,a#,g,2d,32p,a#,g,2c#,32p,a#,g,2c,a#5,8c,2p,32p,a#5,g5,2f#,32p,a#5,g5,2f,32p,a#5,g5,2e,d#,8d',
    //
    'Mozart:d=16,o=5,b=125:16d#,c#,c,c#,8e,8p,f#,e,d#,e,8g#,8p,a,g#,g,g#,d#6,c#6,c6,c#6,d#6,c#6,c6,c#6,4e6,8c#6,8e6,32b,32c#6,d#6,8c#6,8b,8c#6,32b,32c#6,d#6,8c#6,8b,8c#6,32b,32c#6,d#6,8c#6,8b,8a#,4g#,d#,32c#,c,c#,8e,8p,f#,e,d#,e,8g#,8p,a,g#,g,g#,d#6,c#6,c6,c#6,d#6,c#6,c6,c#6,4e6,8c#6,8e6,32b,32c#6,d#6,8c#6,8b,8c#6,32b,32c#6,d#6,8c#6,8b,8c#6,32b,32c#6,d#6,8c#6,8b,8a#,4g#',
    //Source: https://huggingface.co/datasets/cosimoiaia/RTTTL-Ringtones?row=78
    'whatsup:d=32,o=5,b=45:16g#,a#,8g#,16f6,c#,8c#.,g#,16g#,f#,16f,16f6,c#6,16c#6,8f#.6,g#6,g#6,c#6,d#6,d#6,16f6,c#6',
    'SweetChild:d=8,o=5,b=140:c,c6,g,f,f6,g,e6,g,c,c6,g,f,f6,g,e6,g,d,c6,g,f,f6,g,e6,g,d,c6,g,f,f6,g,e6,g,f,c6,g,f,f6,g,e6,g,f,c6,g,f,f6,g,e6,g,c,c6,g,f,f6,g,e6,g,c,c6,g,f,f6,g,e6,g'
]

//chordPlayer.playChord(chords['d']['major']);
//chordPlayer.playSong(fourChords, 500);
chordPlayer.playSong(fourCh, 500);


const outputScaleOptions = () => {
    /*let scaleEl = document.getElementById('scale');
    scaleEl.innerHTML = '';*/
    let scaleSelects = document.getElementsByName('scale').forEach( (el) => {
    	el.innerHTML = null;
		//let music = new Music();
	    Object.keys(music.scales).forEach( (k) => {
	        let opt = document.createElement('option');
	        opt.value = k;
	        opt.innerHTML = k;
	        el.appendChild(opt);
	    })
    })
}

outputRingtoneOptions = () => {
	let songNames = ringtoneExamples.map( (str) => {
		return str.split(':')[0];
	});
	let exampleEl = document.getElementById('examples');
	songNames.forEach( (k) => {
		let opt = document.createElement('option');
		opt.value = k;
		opt.innerHTML = k;
		exampleEl.appendChild(opt);
	})
}

outputScaleTable = (name) => {
	const tableDiv = document.getElementById('scalesTable');
	tableDiv.innerHTML = null;
	const table = document.createElement('table');
	const showSharps = document.getElementById('showSharps').value == "true" ? true : false;
	const keys = music.notes;
	let scale = [...music.scales[name]];
	scale.push(12); //Add the root note an octave above
	//console.log('table', name, showSharps, scale);
	const row = createHTMLElement('tr','');
	let rootEl = createHTMLElement('th','R');
	row.appendChild(rootEl);
	let currentIndex = 0;
	for(let index of scale){
		let indexDiff = index - currentIndex;
		if(indexDiff === 0) continue;
		let diff = 'S';
		switch(indexDiff) {
			case 1:
				diff = 'S';
			break;
			case 2:
				diff = 'T';
			break;
			case 3:
				diff = 'A';
			break;
			default:
				diff = indexDiff;
			break;
		}
		//console.log(index, currentIndex, diff);
		let th = createHTMLElement('th',diff);
		row.appendChild(th);
		currentIndex = index;
	}
	//let th = createHTMLElement('th','Acc');
	//row.appendChild(th);
	table.appendChild(row);
	
	for(let key of keys){
		const scaleNotes = music.getScaleNotes(key, name);
		scaleNotes.push(key);
		let scaleRow = createHTMLElement('tr');
		let accidentals = [];
		for(let note of scaleNotes){
			let noteStr = note;
			if(showSharps){
				noteStr = songPlayer.convertFlats(note);
			}
			let noteEl = createHTMLElement('td',noteStr);
			if(note.indexOf('b') !== -1){
				accidentals.push(note);
			}
			scaleRow.appendChild(noteEl);
		}
		/*if(showSharps){
			accidentals = accidentals.map( (note) => {
				return songPlayer.convertFlats(note);
			});
		}
		//console.log('scaleNotes',scaleNotes,'acc',accidentals);
		let accidentalEl = createHTMLElement('td');
		let accString = accidentals.join(' ');
		accidentalEl.innerHTML = accString;
		scaleRow.appendChild(accidentalEl);
		*/
		table.appendChild(scaleRow);
	}
	tableDiv.appendChild(table);
}

const createHTMLElement = (tag='p', innerHTML='', id=false) => {
	const el = document.createElement(tag);
	el.innerHTML = innerHTML;
	if(id){
		el.id = id;
	}
	return el;
}

const playNote = (note) => {
	chordPlayer.playNote(note, 250);
}

outputPianoKeys = () => {
	const piano = document.getElementById('piano');
	piano.style.width = "100%";
	//const width = piano.getBoundingClientRect().width;
	const width = document.body.getBoundingClientRect().width;
	piano.innerHTML = null;
	const octaveCount = 2;
	const keyCount = 7 * octaveCount;
	const keyWidth = (width / keyCount).toFixed(3);
	//console.log('width',width,'keyCount', keyCount, 'keyWidth', keyWidth);
	const minOctave = 3;
	const minNote = "C";
	const notePattern = [
		['Db', 'Eb', '',  'Gb', 'Ab', 'Bb', ''],
		['C',  'D',  'E', 'F',  'G',  'A',  'B']
	];
	
	for(let octave = minOctave; octave < (minOctave + octaveCount); octave++){
		
		for(let noteIndex = 0; noteIndex < notePattern[1].length; noteIndex++){
			
			//Output notePattern[1][i]
			let whiteKeyBtn = document.createElement('button');
			const whiteNoteName = notePattern[1][noteIndex] + octave;
			whiteKeyBtn.id = whiteNoteName;
			//whiteKeyBtn.innerHTML = "&nbsp;";
			whiteKeyBtn.innerHTML = whiteNoteName;
			whiteKeyBtn.style.verticalAlign = "bottom";
			whiteKeyBtn.style.display = "flex";
    		whiteKeyBtn.style.alignItems = 'end';
    		whiteKeyBtn.style.justifyContent = "center";
			
			//whiteKeyBtn.style.width = Math.min(10,keyWidth) + 'px';
			whiteKeyBtn.style.width = keyWidth + 'px';
			whiteKeyBtn.style.height = (keyWidth * 6) + "px";
			whiteKeyBtn.style.position = "absolute";
			whiteKeyBtn.style.left = ( ( (7 * (octave - minOctave) ) + noteIndex) * keyWidth ) + 'px';
			whiteKeyBtn.style.top = "150px";
			whiteKeyBtn.style.zIndex = 0;

			whiteKeyBtn.style.color = "#000";
			whiteKeyBtn.style.backgroundColor = "#fff";
			whiteKeyBtn.style.border = "1px solid black";
			
			whiteKeyBtn.onmouseover = (event) => {
				console.log('whiteClick', event.target.id);
				playNote(event.target.id);
			}
			piano.appendChild(whiteKeyBtn);
			//console.log('white',notePattern[1][noteIndex] + octave, keyWidth, ( ( (7 * (octave - minOctave) ) + noteIndex) * keyWidth ) + 'px' );
			
			if(notePattern[0][noteIndex] !== ''){
				//Output black key
				let blackKeyBtn = document.createElement('button');
				const blackNoteName = notePattern[0][noteIndex] + octave;
				blackKeyBtn.id = blackNoteName;
				//blackKeyBtn.innerHTML = "&nbsp;"
				blackKeyBtn.innerHTML = blackNoteName;
				
				blackKeyBtn.style.position = "absolute";
				//blackKeyBtn.style.width = Math.min(10,keyWidth) + 'px';
				blackKeyBtn.style.width = keyWidth + 'px';
				blackKeyBtn.style.height = (keyWidth * 3) + "px";
				
				blackKeyBtn.style.left = ( ( (7 * (octave - minOctave) ) + noteIndex + 0.5) * keyWidth ) + 'px';
				blackKeyBtn.style.top = "150px";
				blackKeyBtn.style.zIndex = 100;
				
				blackKeyBtn.style.color = "#fff";
				blackKeyBtn.style.backgroundColor = "#000";
				blackKeyBtn.style.border = "1px solid grey";
				
				blackKeyBtn.onmouseover = (event) => {
					console.log('blackClick', event.target.id);
					playNote(event.target.id);
				}
				piano.appendChild(blackKeyBtn);
			}
		}
	}
}

updateRTTTL = (opt) => {
	let name = opt.value;
	let song = ringtoneExamples.find( (el) => {
		let sName = el.split(':')[0];
		return sName == name;
	});
	document.getElementById('rtttl').value = song;
}

playRTTTL = () => {
	let song = document.getElementById('rtttl').value;
	songPlayer.playRTTTLSong(song);
}

//LITTLE HELPER FUNCTION TO CALL THE MUSIC CLASS
playMusicalScale = () => {
    //GET THE SELECTED KEY AND SCALE NAME
    let key = document.getElementsByName('key')[0].value;
    let scale = document.getElementsByName('scale')[0].value;
    let duration = document.getElementsByName('duration')[0].value;
    let basePitch = document.getElementsByName('basePitch')[0].value;
    //GET AN INSTANCE OF THE MUSIC CLASS
    let music = new Music();
    //SET THE BASE PITCH
    music.setBasePitch(basePitch);
    //PLAY THE SELECTED SCALE (AudioContext)
    music.playScale(key, scale, duration);
    //GET THE NOTES OF THIS SCALE TO OUTPUT TO THE SCREEN
    let scaleNotes = music.getScaleNotes(key,scale);
    //OUTPUT NOTES TO SCALE NOTES DIV
    document.getElementById('scaleNotesDiv').innerHTML = 'NOTES: ' + scaleNotes.join(" ");
}

const playGame = () => {
    console.log('game started!');
    //let game = new MusicGame();
    const gameType = document.getElementById('gameType').value;
    game.setType(gameType);
    const difficulty = document.getElementById('difficulty').value;
    game.setDifficulty(difficulty);
    game.start();
    showTab('game');
}