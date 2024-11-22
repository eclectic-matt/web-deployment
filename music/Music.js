class Music 
{
    //THE NAMES OF THE NOTES
    notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    scales = {
        major: [0,2,4,5,7,9,11],
        minor: [0,2,3,5,7,8,10],
        chromatic: [0,1,2,3,4,5,6,7,8,9,10,11],
        istrian: [0,1,3,4,6,7],
        locrian: [0,1,3,5,6,8,10],
        phrygian: [0,1,3,5,7,8,10],
        mixolydian: [0,2,4,5,7,9,10],
        augmented: [0,3,4,7,8,11],
        dorian: [0,2,3,5,7,9,10],
        doubleHarmonic: [0,1,4,5,7,8,11],
        enigmatic: [0,1,4,6,8,10,11],
        harmonicMajor: [0,2,4,5,7,8,11],
        harmonicMinor: [0,2,3,5,7,8,11],
        majorPentatonic: [0,2,4,7,9],
        minorPentatonic: [0,3,5,7,10],
        bluesMinorPentatonic: [0,3,5,8,10],
        bluesMajorPentatonic: [0,2,5,7,9],
        persian: [0,1,4,5,6,8,11],
        prometheus: [0,2,4,6,9,10],
        scaleOfHarmonics: [0,3,4,5,7,9],
        tritone: [0,1,4,6,7,10],
        wholeTone: [0,2,4,6,8,10],
        ukranianDorian: [0,2,3,6,7,9,10],
        yo: [0,3,5,7,10]
        // ... other scales
    };

    //THE BASE (CONCERT) PITCH OF A4
    basePitch = 440;
    //OTHER PITCHES (see https://en.wikipedia.org/wiki/Concert_pitch)
        // HANDEL PITCH (1740) = 422.5 Hz
        // BEETHOVEN (1800) = 455.4 Hz
        // Versailles Chapel from 1795 is 390 Hz
        // 1810 Paris Opera tuning fork sounds at A = 423 Hz
        // 1822 fork gives A = 432 Hz
        // 1855 fork gives A = 449 Hz
        // La Scala in Milan the A above middle C rose as high as 451 Hz
        // SCIENTIFIC PITCH = 430.54 Hz (middle C = 2^8 = 256 Hz)
        // SCHILLER INSTITUTE = 432 Hz
        // OLD PHILHARMONIC PITCH = 452 Hz

    /**
     * Sets the base pitch for these scales where concert pitch A4 = 440Hz.
     * @param {string|float} pitch The new pitch to use for playing scales.
     * @return void.
     */
    setBasePitch = (pitch=440) => {
        this.basePitch = parseFloat(pitch);
    }

    /**
     * Calculate the frequency for a note/octave string.
     * @param {string} noteOctave The note and octave pair in the form A1 -> G8.
     * @return float The calculated frequency of this note.
     */
    calcFrequency = (noteOctave) => {
        //GET THE OCTAVE (THE LAST CHAR)
        const octave = noteOctave.slice(-1);
        //GET THE NOTE NAME (THE REST OF THE INPUT STRING)
        const note = noteOctave.replace(octave,'');
        //CALCULATE HOW MANY SEMITONES DIFFERENT FROM "A"
        const noteIndexDiff = this.notes.indexOf(note) - this.notes.indexOf('A');
        //WORK OUT HOW MANY SEMITONES ABOVE A4
        const semitones = ((octave - 4) * 12) + noteIndexDiff;
        //THIS IS THE BASE FREQUENCY (A4) - NOW SET AS A CLASS PROPERTY AND EDITABLE.
        //const f0 = 440;
        //USE THE Math.pow() FUNCTION TO GET EXPONENT
        return (this.basePitch * Math.pow(2, (semitones / 12)));
    }

    /**
     * Play a note of the set key for duration ms.
     * @param {string} key The note and octave in the form, e.g. C4, or Db5.
     * @param {string|int} duration The duration of the note in ms.
     * @return void.
     */
    playNote = (key, duration) => {
        //CALCULATE THE REQUIRED FREQUENCY
        let frequency = this.calcFrequency(key);

		//CREATE AN OscillatorNode TO SET FREQUENCY
        var oscillator = context.createOscillator();
        oscillator.type = "square";//"sine"
        oscillator.frequency.value = frequency;
		
        //CREATE GainNode TO SET VOLUME
        var gainNode = context.createGain();
		//SET VOLUME (1.0 = 100%)
        gainNode.gain.value = 0.2;	// 20 %
		//CONNECT THE OscillatorNode TO THE GainNode (NOT TO THE AudioContext DIRECTLY!)
		oscillator.connect(gainNode);
		//CONNECT THE GainNode TO THE AudioContext DESTINATION
		gainNode.connect(context.destination);

		//START THE OSCILLATOR
        oscillator.start();

        // Beep for duration milliseconds
        setTimeout(function () {
            oscillator.stop();
        }, duration);
    }

    getScaleNotes(key, scaleName) {
        const scalePattern = this.scales[scaleName];
        //USING FLATS (b)
        //const keyIndex = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].indexOf(key);
        const keyIndex = this.notes.indexOf(key);
        const notes = [];
        for(let i = 0; i < scalePattern.length; i++){
            const noteIndex = (keyIndex + scalePattern[i]) % 12;
            //USING FLATS b
            //notes.push(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'][noteIndex]);
            notes.push(this.notes[noteIndex]);
        }

        return notes;
    }

    playScale = (key, scale, duration=250) => {
        //CONSTANTS 
        const startOctave = 4;
        //FORCE INT DURATION
        duration = parseInt(duration);
        //USE getScaleNotes TO GET THE TRANSPOSED NOTES FOR THIS SCALE
        let scaleNotes = this.getScaleNotes(key,scale);
        //GET THE ARRAY INDEX OF THE ROOT NOTE
        let startNoteIndex = this.notes.indexOf(key);
        //MAP TO AN OCTAVE (RETURNS E4, F4, G4 etc)
        scaleNotes = scaleNotes.map( (note) => { 
            //GET THE ARRAY INDEX OF THE CURRENT NOTE
            let currentNoteIndex = this.notes.indexOf(note);
            //IS THIS BELOW THE START NOTE (i.e. WE HAVE GONE UP AN OCTAVE)
            if(currentNoteIndex < startNoteIndex){
                //MOVE UP AN OCTAVE
                return note + "" + (startOctave + 1);
            }else{
                //USE CURRENT OCTAVE
                return (note + startOctave); 
            }
        });
        //THEN ADD THE ROOT BACK ON AN OCTAVE HIGHER
        scaleNotes.push(key + (startOctave + 1));
        //console.log(scaleNotes);
        scaleNotes.push(...Array.from(scaleNotes).reverse());
        //console.log(scaleNotes);
        //FOR EACH NOTE (Eb4, F4, A5 etc)
        scaleNotes.forEach( (note, index) => {
            //SET A TIMEOUT BASED ON THE INDEX (i.e. WAIT LONGER FOR LATER NOTES)
            setTimeout(this.playNote, index * duration, note, duration);
        });
    }
}