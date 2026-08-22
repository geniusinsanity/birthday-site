// Web Audio API Visualizer with Dynamic Neon Theme Glow

let audioCtx, analyserViz, dataArrayViz, visualizerCanvas, visualizerCtx;
let isVisualizerInit = false;
let audioSourceNode = null;

function initVisualizer() {
    if (isVisualizerInit) {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return;
    }

    const audioElement = document.getElementById('birthdayAudio');
    if (!audioElement) return;

    if (!visualizerCanvas) {
        visualizerCanvas = document.createElement('canvas');
        visualizerCanvas.id = 'audio-visualizer';
        visualizerCanvas.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 90px;
            z-index: 50;
            pointer-events: none;
            opacity: 0;
            transition: opacity 1.2s ease;
        `;
        document.body.appendChild(visualizerCanvas);
        visualizerCtx = visualizerCanvas.getContext('2d');
    }

    const resizeCanvas = () => {
        if (!visualizerCanvas) return;
        visualizerCanvas.width = window.innerWidth;
        visualizerCanvas.height = 90;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (!analyserViz) {
            analyserViz = audioCtx.createAnalyser();
            analyserViz.fftSize = 128;
            analyserViz.smoothingTimeConstant = 0.8;
        }

        if (!audioSourceNode) {
            audioSourceNode = audioCtx.createMediaElementSource(audioElement);
            audioSourceNode.connect(analyserViz);
            analyserViz.connect(audioCtx.destination);
        }

        const bufferLength = analyserViz.frequencyBinCount;
        dataArrayViz = new Uint8Array(bufferLength);
        isVisualizerInit = true;

        setTimeout(() => {
            if (visualizerCanvas) visualizerCanvas.style.opacity = '0.75';
        }, 300);

        drawVisualizer();
    } catch (e) {
        console.warn('Audio Visualizer setup notice:', e);
    }
}

function drawVisualizer() {
    if (!isVisualizerInit || !visualizerCanvas) return;
    requestAnimationFrame(drawVisualizer);

    analyserViz.getByteFrequencyData(dataArrayViz);

    const w = visualizerCanvas.width;
    const h = visualizerCanvas.height;

    visualizerCtx.clearRect(0, 0, w, h);

    const total = dataArrayViz.length;
    const barWidth = Math.max(3, Math.floor(w / total) - 2);
    let x = 2;

    const currentSettings = window.settings || {};
    const primaryColor = currentSettings.matrixColor1 || '#ff69b4';
    const secondaryColor = currentSettings.matrixColor2 || '#ff1493';

    for (let i = 0; i < total; i++) {
        const pct = dataArrayViz[i] / 255;
        const barHeight = Math.max(2, pct * h * 0.85);

        const gradient = visualizerCtx.createLinearGradient(0, h, 0, h - barHeight);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);

        visualizerCtx.shadowBlur = 12;
        visualizerCtx.shadowColor = secondaryColor;
        visualizerCtx.fillStyle = gradient;

        // Rounded bar
        visualizerCtx.beginPath();
        visualizerCtx.roundRect ? visualizerCtx.roundRect(x, h - barHeight, barWidth, barHeight, [4, 4, 0, 0]) : visualizerCtx.rect(x, h - barHeight, barWidth, barHeight);
        visualizerCtx.fill();

        x += barWidth + 3;
    }
}
