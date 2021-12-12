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

const snareFilter = audioContext.createBiquadFilter();
snareFilter.type = "highpass";
snareFilter.frequency.value = 1500;
snareFilter.connect(primaryGainControl);

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