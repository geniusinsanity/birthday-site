// 3D Birthday Cake Engine (Stage 6)
// Three.js Scene, Flame Flicker, 360° Orbit, Mic / Shake / Tap Blow Detection

let scene, camera, renderer, candleFlame, cakeGroup, candleLight;
let audioContext, analyser, microphone, dataArray;
let isCakeActive = false;
let cakeAnimationId = null;

let isDraggingCake = false;
let prevCakeMouseX = 0;
let prevCakeMouseY = 0;
let cakeRotationY = 0;
let cakeRotationX = 0.2;
let hasMovedMouse = false;

// Shake detection
let lastMouseX = 0;
let shakeSwitches = 0;
let lastShakeDir = null;

function init3DCake() {
    if (document.getElementById('cake-container')) return;
    isCakeActive = true;

    const container = document.createElement('div');
    container.id = 'cake-container';
    container.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: radial-gradient(ellipse at center, rgba(30, 12, 54, 0.96) 0%, rgba(7, 3, 12, 0.98) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: grab;
        opacity: 0;
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(container);

    requestAnimationFrame(() => {
        container.style.opacity = '1';
    });

    // Title banner
    const title = document.createElement('h2');
    title.id = 'cake-title';
    title.innerText = typeof t === 'function' ? t('cakeTitle') : '🎂 Make a Wish! Tap or move cursor to blow candle!';
    title.style.cssText = `
        color: #ffffff;
        font-family: 'Pacifico', cursive;
        font-size: clamp(1.1rem, 2.8vw, 1.5rem);
        text-align: center;
        text-shadow: 0 0 20px #ff69b4, 0 0 40px #ff1493;
        margin: 10px 20px 6px;
        z-index: 10;
        pointer-events: none;
        letter-spacing: 0.5px;
    `;
    container.appendChild(title);

    // Shake indicator
    const shakeIndicator = document.createElement('div');
    shakeIndicator.id = 'shake-indicator';
    shakeIndicator.innerHTML = '💨 💨 💨';
    shakeIndicator.style.cssText = `
        font-size: 1.5rem;
        letter-spacing: 8px;
        opacity: 0.4;
        transition: opacity 0.3s;
        margin-bottom: 4px;
        z-index: 10;
        pointer-events: none;
    `;
    container.appendChild(shakeIndicator);

    if (typeof THREE === 'undefined') {
        const msg = document.createElement('div');
        msg.style.cssText = 'color:#ff69b4; font-size:1.4rem; text-align:center; padding:40px; font-family:Pacifico, cursive; cursor:pointer;';
        msg.innerHTML = '🎂<br><br>Click here to blow out the candle and make your wish! ✨';
        container.appendChild(msg);
        container.addEventListener('click', blowOutCandle);
        return;
    }

    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * 0.72), 0.1, 1000);
        camera.position.set(0, 6, 15);
        camera.lookAt(0, 2.2, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight * 0.72);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xfff0f5, 0.7);
        scene.add(ambientLight);

        candleLight = new THREE.PointLight(0xffaa22, 2.8, 25);
        candleLight.position.set(0, 8.5, 0);
        scene.add(candleLight);

        const rimLight = new THREE.DirectionalLight(0xff69b4, 1.0);
        rimLight.position.set(-6, 8, -6);
        scene.add(rimLight);

        const rimLight2 = new THREE.DirectionalLight(0x00f2fe, 0.6);
        rimLight2.position.set(6, 4, 6);
        scene.add(rimLight2);

        // Cake Group
        cakeGroup = new THREE.Group();
        scene.add(cakeGroup);

        // Golden Plate
        const plateGeo = new THREE.CylinderGeometry(4.4, 4.4, 0.22, 64);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = -0.1;
        cakeGroup.add(plate);

        // Tier 1 (Bottom)
        const layer1Geo = new THREE.CylinderGeometry(3.6, 3.6, 2.0, 64);
        const layer1Mat = new THREE.MeshStandardMaterial({ color: 0x4a1525, roughness: 0.4 });
        const layer1 = new THREE.Mesh(layer1Geo, layer1Mat);
        layer1.position.y = 1.0;
        cakeGroup.add(layer1);

        // Frosting 1
        const frost1Geo = new THREE.CylinderGeometry(3.7, 3.7, 0.25, 64);
        const frostMat1 = new THREE.MeshStandardMaterial({ color: 0xff69b4, roughness: 0.3 });
        const frost1 = new THREE.Mesh(frost1Geo, frostMat1);
        frost1.position.y = 2.1;
        cakeGroup.add(frost1);

        // Tier 2 (Middle)
        const layer2Geo = new THREE.CylinderGeometry(2.8, 2.8, 1.8, 64);
        const layer2Mat = new THREE.MeshStandardMaterial({ color: 0xff1493, roughness: 0.35 });
        const layer2 = new THREE.Mesh(layer2Geo, layer2Mat);
        layer2.position.y = 3.1;
        cakeGroup.add(layer2);

        // Frosting 2
        const frost2Geo = new THREE.CylinderGeometry(2.9, 2.9, 0.22, 64);
        const frostMat2 = new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.3 });
        const frost2 = new THREE.Mesh(frost2Geo, frostMat2);
        frost2.position.y = 4.1;
        cakeGroup.add(frost2);

        // Tier 3 (Top)
        const layer3Geo = new THREE.CylinderGeometry(2.0, 2.0, 1.5, 64);
        const layer3Mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
        const layer3 = new THREE.Mesh(layer3Geo, layer3Mat);
        layer3.position.y = 4.95;
        cakeGroup.add(layer3);

        // Sprinkles
        const sprinkleColors = [0xff1493, 0xffd700, 0x00f2fe, 0xff4500, 0x7fff00, 0xb537f2];
        for (let i = 0; i < 40; i++) {
            const spGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.24, 8);
            const spMat = new THREE.MeshStandardMaterial({
                color: sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)],
                roughness: 0.3
            });
            const sprinkle = new THREE.Mesh(spGeo, spMat);
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 1.65;
            sprinkle.position.set(Math.cos(angle) * radius, 5.75, Math.sin(angle) * radius);
            sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            cakeGroup.add(sprinkle);
        }

        // Candle Body
        const candleGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 32);
        const candleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const candle = new THREE.Mesh(candleGeo, candleMat);
        candle.position.y = 6.8;
        cakeGroup.add(candle);

        // Candle Wick
        const wickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 16);
        const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const wick = new THREE.Mesh(wickGeo, wickMat);
        wick.position.y = 7.95;
        cakeGroup.add(wick);

        // Candle Flame
        const flameGeo = new THREE.SphereGeometry(0.3, 16, 16);
        flameGeo.scale(0.8, 2.0, 0.8);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        candleFlame = new THREE.Mesh(flameGeo, flameMat);
        candleFlame.position.y = 8.35;
        cakeGroup.add(candleFlame);

        setupCakeInteractions(container, shakeIndicator);
        animate3DCake();
        initMicrophoneBlow();

    } catch (e) {
        console.warn('Three.js setup fallback:', e);
    }
}

function setupCakeInteractions(container, indicator) {
    let startX = 0, startY = 0;

    container.addEventListener('mousedown', (e) => {
        isDraggingCake = true;
        hasMovedMouse = false;
        startX = e.clientX;
        startY = e.clientY;
        prevCakeMouseX = e.clientX;
        prevCakeMouseY = e.clientY;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isCakeActive) return;

        if (isDraggingCake && cakeGroup) {
            const dx = e.clientX - prevCakeMouseX;
            const dy = e.clientY - prevCakeMouseY;
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                hasMovedMouse = true;
            }
            cakeRotationY += dx * 0.01;
            cakeRotationX += dy * 0.005;
            cakeRotationX = Math.max(-0.4, Math.min(0.7, cakeRotationX));
            prevCakeMouseX = e.clientX;
            prevCakeMouseY = e.clientY;
        }

        // Gesture shake detection
        if (candleFlame && candleFlame.visible) {
            const dx = e.clientX - lastMouseX;
            lastMouseX = e.clientX;
            if (Math.abs(dx) > 6) {
                const dir = dx > 0 ? 'right' : 'left';
                if (dir !== lastShakeDir) {
                    if (lastShakeDir !== null) {
                        shakeSwitches++;
                        const count = Math.min(shakeSwitches, 3);
                        indicator.style.opacity = '1';
                        indicator.innerHTML = '💨'.repeat(count) + '<span style="opacity:0.2">' + '💨'.repeat(3 - count) + '</span>';
                        if (shakeSwitches >= 4) {
                            blowOutCandle();
                            shakeSwitches = 0;
                        }
                    }
                    lastShakeDir = dir;
                }
            }
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (isDraggingCake && !hasMovedMouse) {
            blowOutCandle();
        }
        isDraggingCake = false;
        container.style.cursor = 'grab';
    });

    // Touch support
    let touchStartX = 0;
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (cakeGroup) {
            const dx = e.touches[0].clientX - touchStartX;
            cakeRotationY += dx * 0.012;
            touchStartX = e.touches[0].clientX;
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        blowOutCandle();
    }, { passive: true });
}

function animate3DCake() {
    if (!isCakeActive) return;
    cakeAnimationId = requestAnimationFrame(animate3DCake);

    if (!isDraggingCake && cakeGroup) {
        cakeRotationY += 0.0035;
    }

    if (cakeGroup) {
        cakeGroup.rotation.y = cakeRotationY;
        cakeGroup.rotation.x = cakeRotationX;
    }

    if (candleFlame && candleFlame.visible) {
        candleFlame.scale.x = 1 + Math.sin(Date.now() * 0.015) * 0.08 + (Math.random() - 0.5) * 0.05;
        candleFlame.scale.y = 1 + Math.cos(Date.now() * 0.012) * 0.1 + (Math.random() - 0.5) * 0.06;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

async function initMicrophoneBlow() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        checkAudioBlow();
    } catch (e) {}
}

function checkAudioBlow() {
    if (!isCakeActive || !candleFlame || !candleFlame.visible) return;
    requestAnimationFrame(checkAudioBlow);
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    if (sum / dataArray.length > 85) {
        blowOutCandle();
    }
}

function blowOutCandle() {
    if (!candleFlame || !candleFlame.visible) return;
    candleFlame.visible = false;
    if (candleLight) candleLight.intensity = 0.4;

    const title = document.getElementById('cake-title');
    if (title) {
        title.innerText = typeof t === 'function' ? t('cakeBlown') : '🎉 Happy Birthday Zahra! Your wish is coming true! ✨';
        title.style.textShadow = '0 0 30px #ffd700, 0 0 60px #ff69b4';
    }

    const shakeInd = document.getElementById('shake-indicator');
    if (shakeInd) shakeInd.innerHTML = '✨ 💖 🎂';

    if (typeof showFirework === 'function') {
        showFirework();
        setTimeout(showFirework, 400);
        setTimeout(showFirework, 800);
    }
    if (typeof showConfetti === 'function') {
        showConfetti();
    }

    setTimeout(() => {
        isCakeActive = false;
        if (cakeAnimationId) cancelAnimationFrame(cakeAnimationId);
        if (renderer) renderer.dispose();

        const container = document.getElementById('cake-container');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'scale(0.95)';
            setTimeout(() => {
                container.remove();
                if (typeof startMiniGame === 'function') {
                    setTimeout(startMiniGame, 600);
                }
            }, 700);
        }
    }, 4200);
}
