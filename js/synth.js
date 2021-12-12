const audioContext = new AudioContext();

const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate
)

const channelData = buffer.getChannelData(0)

for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1 ;
}

const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.05,0);
primaryGainControl.connect(audioContext.destination);

const notes = [
    {name:'C',frequency:261.63},
    {name:'C#',frequency:277.18},
    {name:'D',frequency:293.66},
    {name:'D#',frequency:311.13},
    {name:'E',frequency:329.63},
    {name:'F',frequency:349.23},
    {name:'F#',frequency:369.99},
    {name:'G',frequency:392.0},
    {name:'G#',frequency:415.3},
    {name:'A',frequency:440.0},
    {name:'A#',frequency:466.16},
    {name:'B',frequency:493.88},
    {name:'C',frequency:523.25},
];

function white_noise() {

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(primaryGainControl);
    whiteNoiseSource.start();

}

function snare() {

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;

    const whiteNoiseGain = audioContext.createGain();
    whiteNoiseGain.gain.setValueAtTime(1,audioContext.currentTime);
    whiteNoiseGain.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime + 0.2);

    const snareFilter = audioContext.createBiquadFilter();
    snareFilter.type = "highpass";
    snareFilter.frequency.value = 1500;
    snareFilter.connect(primaryGainControl);

    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(snareFilter);

    whiteNoiseSource.start();
    whiteNoiseSource.stop(audioContext.currentTime + 0.2);

    const snareOscillator = audioContext.createOscillator();
    snareOscillator.type = "triangle";
    snareOscillator.frequency.setValueAtTime(250,audioContext.currentTime);

    const oscillatorGain = audioContext.createGain();
    oscillatorGain.gain.setValueAtTime(1, audioContext.currentTime);
    oscillatorGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    snareOscillator.connect(oscillatorGain);
    oscillatorGain.connect(primaryGainControl);

    snareOscillator.start();
    snareOscillator.stop(audioContext.currentTime + 0.2);

}

function kick() {

    const kickOscillator = audioContext.createOscillator();
    kickOscillator.frequency.setValueAtTime(150,0);
    kickOscillator.frequency.exponentialRampToValueAtTime(0.001,audioContext.currentTime + 0.5);

    const kickGain = audioContext.createGain();
    kickGain.gain.setValueAtTime(1,0);
    kickGain.gain.exponentialRampToValueAtTime(0.001,audioContext.currentTime + 0.5);

    kickOscillator.connect(kickGain);
    kickGain.connect(primaryGainControl);

    kickOscillator.start();
    kickOscillator.stop(audioContext.currentTime + 0.5);

}

async function hi_hat() {

    // https://freesound.org/people/TheFlakesMaster/sounds/399897/

    const hi_hat_url = 'https://unpkg.com/@teropa/drumkit@1.1.0/src/assets/hatOpen2.mp3';//?raw=true';
    const response = await fetch(hi_hat_url,{mode: 'cors'});

    const soundBuffer = await response.arrayBuffer()

    const hi_hatBuffer = await audioContext.decodeAudioData(soundBuffer);

    const hi_hatSource = audioContext.createBufferSource();
    hi_hatSource.buffer = hi_hatBuffer;
    // hi_hatSource.playbackRate.setValueAtTime(1.0);
    hi_hatSource.connect(primaryGainControl);

    hi_hatSource.start();
}

//Create Notes
document.body.appendChild(document.createElement("br"));

notes.forEach(({name,frequency}) => {
    const noteButton = document.createElement('button');
    noteButton.innerText = name;
    noteButton.addEventListener('click', () => {
        const noteOscillator = audioContext.createOscillator();
        noteOscillator.type = 'square';
        noteOscillator.frequency.setValueAtTime(frequency,audioContext.currentTime);
        
        noteOscillator.connect(primaryGainControl);
        noteOscillator.start();
        noteOscillator.stop(audioContext.currentTime + 1.0);
    });
    document.body.appendChild(noteButton);
});


