function test_js() {
    document.getElementById("demo").style.color = "red";
  }

function white_noise() {

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

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;

    const primaryGainControl = audioContext.createGain();
    primaryGainControl.gain.setValueAtTime(0.05,0);

    whiteNoiseSource.connect(primaryGainControl);
    primaryGainControl.connect(audioContext.destination);

}