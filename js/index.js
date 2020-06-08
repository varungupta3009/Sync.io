'use strict';

let song = document.getElementById('song');
let time = document.getElementById('time');
let userAlert = document.getElementById('alert');
let audioElement = document.getElementById('beep');
let audioContext;

let sync = {
	beeps: 10,
	energy: 0,
	synced: false,
	analyser: Object,
	bufferLength: Number,
	startSync: (event) => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				let audioStream = audioContext.createMediaStreamSource(stream);
				let analyser = audioContext.createAnalyser();
				analyser.fftSize = 1024;
				audioStream.connect(analyser);

				sync.analyser = analyser;
				sync.bufferLength = analyser.frequencyBinCount;
			})
			.then(sync.emitBeep)
			.catch(
				(error) =>
					(userAlert.innerHTML =
						'Please allow access to your microphone.<br />' + error)
			);

		let AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioContext();

		// event.target.parentNode.removeChild(event.target);
	},
	discernBeeps: () => {
		//logic
	},
	emitBeep: () => {
		if (!sync.beeps--) {
			song.play();
			return;
		}
		time.innerHTML = sync.beeps;
		sync.energy = 0;
		console.log('Beep.');
		audioElement.onended = () => setTimeout(sync.soundAllowed, 60);
		audioElement.play();
	},
	soundAllowed: () => {
		let frequencyArray = new Uint8Array(sync.bufferLength);

		let getFrequency = () => {
			if (sync.energy > 150) {
				sync.emitBeep();
				return;
			}
			let totalFrequency = 0;
			sync.analyser.getByteFrequencyData(frequencyArray);
			for (let i = 0; i < 5; i++) {
				totalFrequency += Math.floor(frequencyArray[i + 52]);
			}
			// sync.energy += totalFrequency > 500 ? 20 : 1;
			if (totalFrequency > 500) {
				sync.energy += Math.ceil(sync.energy / 10) || 1;
				setTimeout(getFrequency, 60);
			} else {
				sync.energy++;
				requestAnimationFrame(getFrequency);
			}
			userAlert.innerHTML = totalFrequency;
			// console.log(sync.energy)
		};

		getFrequency();
	},
};
