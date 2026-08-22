// 3D Birthday Cake - Portfolio Grade Edition
// Realistic Lighting, Gold Details, Particle Embers, 360 Orbit, Gesture & Audio Blow-out

let scene, camera, renderer, candleFlame, cakeGroup, emberParticles;
let audioContext, analyser, microphone, dataArray;
let isCakeActive = false;
let cakeAnimationId = null;

// Shake detection state
let lastMouseX = 0;
let shakeSwitches = 0;
let lastShakeDir = null;

function init3DCake() {
    if (document.getElementById('cake-container')) return;
    isCakeActive = true;

    // Full-screen glass overlay
    const container = document.createElement('div');
    container.id = 'cake-container';
    container.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: radial-gradient(ellipse at center, rgba(30, 12, 54, 0.95) 0%, rgba(7, 3, 12, 0.98) 100%);
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
    title.innerText = typeof t === 'function' ? t('cakeTitle') : '🎂 Make a Wish! Move cursor left & right or click!';
    title.style.cssText = `
        color: #ffffff;
        font-family: var(--font-cursive, 'Pacifico', cursive);
        font-size: clamp(1rem, 2.5vw, 1.4rem);
        text-align: center;
        text-shadow: 0 0 20px #ff69b4, 0 0 40px #ff1493;
        margin: 10px 20px 8px;
        z-index: 10;
        pointer-events: none;
        letter-spacing: 0.5px;
    `;
    container.appendChild(title);

    // Shake progress indicator
    const shakeIndicator = document.createElement('div');
    shakeIndicator.id = 'shake-indicator';
    shakeIndicator.innerHTML = '💨 💨 💨';
    shakeIndicator.style.cssText = `
        font-size: 1.6rem;
        letter-spacing: 8px;
        opacity: 0.4;
        transition: opacity 0.3s;
        margin-bottom: 5px;
        z-index: 10;
        pointer-events: none;
    `;
    container.appendChild(shakeIndicator);

    // If Three.js is not loaded fallback
    if (typeof THREE === 'undefined') {
        const msg = document.createElement('div');
        msg.style.cssText = 'color:#ff69b4; font-size:1.4rem; text-align:center; padding:40px; font-family:var(--font-cursive); cursor:pointer;';
        msg.innerHTML = '🎂<br><br>Click here to blow out the candle and make your wish! ✨';
        container.appendChild(msg);
        container.addEventListener('click', blowOutCandleFallback);
        return;
    }

    try {
        // Three.js Scene Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * 0.75), 0.1, 1000);
        camera.position.set(0, 6, 15);
        camera.lookAt(0, 2.2, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight * 0.72);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xfff0f5, 0.65);
        scene.add(ambientLight);

        const candleLight = new THREE.PointLight(0xffaa22, 2.8, 25);
        candleLight.position.set(0, 8.5, 0);
        scene.add(candleLight);

        const rimLight = new THREE.DirectionalLight(0xff69b4, 1.0);
        rimLight.position.set(-6, 8, -6);
        scene.add(rimLight);

        const rimLight2 = new THREE.DirectionalLight(0x00f2fe, 0.6);
        rimLight2.position.set(6, 4, 6);
        scene.add(rimLight2);

        // === Cake Group & Layers ===
        cakeGroup = new THREE.Group();
        scene.add(cakeGroup);

        // Golden Mirror Plate
        const plateGeo = new THREE.CylinderGeometry(4.4, 4.4, 0.22, 64);
        const plateMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = -0.1;
        cakeGroup.add(plate);

        // Tier 1 (Bottom - Ruby Chocolate)
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

        // Tier 2 (Middle - Velvet Pink)
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

        // Tier 3 (Top - Vanilla Cream)
        const layer3Geo = new THREE.CylinderGeometry(2.0, 2.0, 1.5, 64);
        const layer3Mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
        const layer3 = new THREE.Mesh(layer3Geo, layer3Mat);
        layer3.position.y = 4.95;
        cakeGroup.add(layer3);

        // Colorful Sprinkles on top
        const sprinkleColors = [0xff1493, 0xffd700, 0x00f2fe, 0xff4500, 0x7fff00, 0xb537f2];
        for (let i = 0; i < 40; i++) {
            const spGeo = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.06, 0.24, 4, 8) : new THREE.CylinderGeometry(0.06, 0.06, 0.24, 8);
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

        // Elegant Birthday Candle
        const candleGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.8, 32);
        const candleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const candle = new THREE.Mesh(candleGeo, candleMat);
        candle.position.set(0, 6.65, 0);
        cakeGroup.add(candle);

        // Wick
        const wickGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8);
        const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const wick = new THREE.Mesh(wickGeo, wickMat);
        wick.position.set(0, 7.6, 0);
        cakeGroup.add(wick);

        // Animated Flame Group
        candleFlame = new THREE.Group();
        candleFlame.position.set(0, 8.0, 0);
        cakeGroup.add(candleFlame);

        const flameGeo = new THREE.ConeGeometry(0.22, 0.7, 16);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.95 });
        const flameMesh = new THREE.Mesh(flameGeo, flameMat);
        candleFlame.add(flameMesh);

        const glowGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.35 });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        glowMesh.position.y = -0.1;
        candleFlame.add(glowMesh);

        // Sparkle Embers
        const emberGeo = new THREE.BufferGeometry();
        const emberCount = 30;
        const emberPos = new Float32Array(emberCount * 3);
        for (let i = 0; i < emberCount * 3; i += 3) {
            emberPos[i] = (Math.random() - 0.5) * 0.8;
            emberPos[i + 1] = Math.random() * 1.5;
            emberPos[i + 2] = (Math.random() - 0.5) * 0.8;
        }
        emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
        const emberMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.08,
            transparent: true,
            opacity: 0.8
        });
        emberParticles = new THREE.Points(emberGeo, emberMat);
        candleFlame.add(emberParticles);

        // Start Loop
        animate3DCake();

        // Setup Controls & Gestures
        setupCakeOrbit(container);
        setupCakeShake(container, shakeIndicator);

        // Click to blow fallback
        container.addEventListener('click', () => {
            if (isCakeActive && candleFlame && candleFlame.visible) {
                blowOutCandle();
            }
        });

        initMicrophoneBlow();

        // Responsive Resize
        window.addEventListener('resize', () => {
            if (!renderer || !camera) return;
            camera.aspect = window.innerWidth / (window.innerHeight * 0.75);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * 0.72);
        });

    } catch (err) {
        console.error('Three.js cake error:', err);
        blowOutCandleFallback();
    }
}

// 360 Orbit Interaction
let isDraggingCake = false;
let prevCakeMouseX = 0;
let prevCakeMouseY = 0;
let cakeRotationY = 0;
let cakeRotationX = 0.2;

function setupCakeOrbit(container) {
    container.addEventListener('mousedown', (e) => {
        isDraggingCake = true;
        prevCakeMouseX = e.clientX;
        prevCakeMouseY = e.clientY;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingCake && cakeGroup) {
            const dx = e.clientX - prevCakeMouseX;
            const dy = e.clientY - prevCakeMouseY;
            cakeRotationY += dx * 0.01;
            cakeRotationX += dy * 0.005;
            cakeRotationX = Math.max(-0.4, Math.min(0.7, cakeRotationX));
            prevCakeMouseX = e.clientX;
            prevCakeMouseY = e.clientY;
        }
    });

    window.addEventListener('mouseup', () => {
        isDraggingCake = false;
        container.style.cursor = 'grab';
    });

    // Touch orbit
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
}

// Gesture Shake Detection
function setupCakeShake(container, indicator) {
    lastMouseX = 0;
    shakeSwitches = 0;
    lastShakeDir = null;

    window.addEventListener('mousemove', (e) => {
        if (!isCakeActive || !candleFlame || !candleFlame.visible) return;

        const dx = e.clientX - lastMouseX;
        lastMouseX = e.clientX;

        if (Math.abs(dx) < 6) return;

        const dir = dx > 0 ? 'right' : 'left';
        if (dir !== lastShakeDir) {
            if (lastShakeDir !== null) {
                shakeSwitches++;
                const count = Math.min(shakeSwitches, 3);
                indicator.style.opacity = '1';
                indicator.innerHTML = '💨'.repeat(count) + '<span style="opacity:0.2">' + '💨'.repeat(3 - count) + '</span>';

                if (shakeSwitches >= 5) {
                    blowOutCandle();
                    shakeSwitches = 0;
                }
            }
            lastShakeDir = dir;
        }
    });
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
    } catch (e) {
        // Mic denied or unavailable, gestures/clicks work seamlessly
    }
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
                // Reveal Easter egg mini-game automatically
                if (typeof startMiniGame === 'function') {
                    setTimeout(startMiniGame, 1000);
                }
            }, 800);
        }
    }, 4500);
}

function blowOutCandleFallback() {
    blowOutCandle();
}
