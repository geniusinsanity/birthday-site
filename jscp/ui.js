// Core UI Engine: Matrix Rain, Particle Words Sequence, 3D Book, Heart Cardioid Constellation

let matrixAnimationId = null;
let matrixChars = "HAPPYBIRTHDAY".split("");
let currentPage = 0;
let isFlipping = false;
let isBookFinished = false;
let typewriterTimeout = null;
let photoUrls = [];
let maxHeartPhotos = 20;
let heartPhotosCreated = 0;
let isSequenceRunning = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// 1. Matrix Rain Background Effect (High Performance, 60fps)
// ==========================================
function initMatrixRain() {
    const matrixCanvas = document.getElementById('matrix-rain');
    if (!matrixCanvas) return;
    const matrixCtx = matrixCanvas.getContext('2d');

    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 14 : 22;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];
    const delays = [];
    const started = [];

    const currentSettings = window.settings || {
        matrixColor1: '#ff69b4',
        matrixColor2: '#ff1493',
        matrixText: 'HAPPYBIRTHDAY'
    };

    const chars = (currentSettings.matrixText || "HAPPYBIRTHDAY").split("");
    const maxLength = Math.floor(matrixCanvas.height / fontSize) + 3;

    for (let x = 0; x < columns; x++) {
        drops[x] = 0;
        delays[x] = Math.random() * 1500;
        started[x] = false;
    }

    let lastDrawTime = 0;
    const frameInterval = isMobile ? 45 : 40;
    const startTime = Date.now();

    if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId);

    function drawMatrixRain(timestamp) {
        matrixAnimationId = requestAnimationFrame(drawMatrixRain);

        if (timestamp - lastDrawTime < frameInterval) return;
        lastDrawTime = timestamp;

        // Clean fading background trail
        matrixCtx.fillStyle = "rgba(0, 0, 0, 0.07)";
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCtx.font = `bold ${fontSize}px Menlo, Consolas, monospace`;

        const currentTime = Date.now();

        for (let i = 0; i < drops.length; i++) {
            if (!started[i] && currentTime - startTime >= delays[i]) {
                started[i] = true;
            }

            if (started[i] && drops[i] < maxLength) {
                const char = chars[Math.floor(Math.random() * chars.length)] || '❤';
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                const color = i % 2 === 0 ? (currentSettings.matrixColor1 || '#ff69b4') : (currentSettings.matrixColor2 || '#ff1493');

                matrixCtx.fillStyle = color;
                matrixCtx.fillText(char, x, y);
            }

            if (started[i]) drops[i]++;

            if (drops[i] >= maxLength) {
                drops[i] = 0;
                delays[i] = Math.random() * 800;
                started[i] = false;
            }
        }
    }

    matrixAnimationId = requestAnimationFrame(drawMatrixRain);
}

// ==========================================
// 2. High-Performance Particle Engine (S.js)
// ==========================================
const S = {
    initialized: false,
    init: function () {
        S.Drawing.init('.canvas');
        document.body.classList.add('body--ready');
        S.Drawing.loop(function () {
            S.Shape.render();
        });
        S.initialized = true;
    }
};

S.Drawing = (function () {
    let canvas, context, renderFn;
    const requestFrame = window.requestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60); };

    return {
        init: function (el) {
            canvas = document.querySelector(el);
            if (!canvas) return;
            context = canvas.getContext('2d');
            this.adjustCanvas();
            window.addEventListener('resize', () => this.adjustCanvas());
        },
        loop: function (fn) {
            renderFn = renderFn || fn;
            this.clearFrame();
            if (renderFn) renderFn();
            requestFrame.call(window, this.loop.bind(this));
        },
        adjustCanvas: function () {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        },
        clearFrame: function () {
            if (context && canvas) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        },
        getArea: function () {
            return { w: canvas ? canvas.width : window.innerWidth, h: canvas ? canvas.height : window.innerHeight };
        },
        drawCircle: function (p, c) {
            if (!context) return;
            context.fillStyle = c.render();
            context.beginPath();
            context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
        }
    };
}());

S.Point = function (args) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z || 3.5;
    this.a = args.a !== undefined ? args.a : 1;
    this.h = args.h || 0;
};

S.Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

S.Color.prototype.render = function () {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
};

S.Dot = function (x, y) {
    const isMobile = window.innerWidth < 768;
    this.p = new S.Point({
        x: x,
        y: y,
        z: isMobile ? 2.8 : 4.0,
        a: 1,
        h: 0
    });
    this.e = 0.11;
    this.s = true;
    const currentSettings = window.settings || { sequenceColor: '#ff69b4' };
    const rgb = hexToRgb(currentSettings.sequenceColor || '#ff69b4');
    this.c = new S.Color(rgb.r, rgb.g, rgb.b, this.p.a);
    this.t = new S.Point({ x: x, y: y, z: this.p.z, a: 1, h: 0 });
    this.q = [];
};

S.Dot.prototype = {
    _draw: function () {
        const currentSettings = window.settings || { sequenceColor: '#ff69b4' };
        const rgb = hexToRgb(currentSettings.sequenceColor || '#ff69b4');
        this.c.r = rgb.r;
        this.c.g = rgb.g;
        this.c.b = rgb.b;
        this.c.a = this.p.a;
        S.Drawing.drawCircle(this.p, this.c);
    },
    _moveTowards: function (n) {
        const dx = this.p.x - n.x;
        const dy = this.p.y - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const e = this.e * d;

        if (d > 1) {
            this.p.x -= (dx / d) * e;
            this.p.y -= (dy / d) * e;
        } else {
            return true;
        }
        return false;
    },
    _update: function () {
        if (this._moveTowards(this.t)) {
            const p = this.q.shift();
            if (p) {
                this.t.x = p.x !== undefined ? p.x : this.p.x;
                this.t.y = p.y !== undefined ? p.y : this.p.y;
                this.t.z = p.z !== undefined ? p.z : this.p.z;
                this.t.a = p.a !== undefined ? p.a : this.p.a;
            } else if (!this.s) {
                this.p.x += (Math.random() - 0.5) * 1.5;
                this.p.y += (Math.random() - 0.5) * 1.5;
            }
        }
    },
    move: function (p) {
        this.q.push(p);
    },
    render: function () {
        this._update();
        this._draw();
    }
};

S.ShapeBuilder = (function () {
    const shapeCanvas = document.createElement('canvas');
    const shapeContext = shapeCanvas.getContext('2d');
    const baseFontSize = 450;
    const fontFamily = 'Plus Jakarta Sans, sans-serif';

    function getGap() {
        return window.innerWidth < 768 ? 6 : 8;
    }

    return {
        letter: function (l) {
            const gap = getGap();
            const w = Math.max(window.innerWidth, 400);
            const h = Math.max(window.innerHeight, 400);

            shapeCanvas.width = w;
            shapeCanvas.height = h;

            let fontSize = baseFontSize;
            shapeContext.font = `bold ${fontSize}px ${fontFamily}`;
            const textWidth = shapeContext.measureText(l).width || 100;
            const maxWidth = w * 0.85;
            const isLandscape = w > h;
            const maxHeight = h * (isLandscape ? 0.65 : 0.4);

            fontSize = Math.min(baseFontSize, (maxWidth / textWidth) * baseFontSize, maxHeight);
            shapeContext.font = `bold ${fontSize}px ${fontFamily}`;
            shapeContext.fillStyle = '#ff69b4';
            shapeContext.textBaseline = 'middle';
            shapeContext.textAlign = 'center';
            shapeContext.clearRect(0, 0, w, h);
            shapeContext.fillText(l, w / 2, h / 2);

            const pixels = shapeContext.getImageData(0, 0, w, h).data;
            const dots = [];
            let minX = w, maxX = 0, minY = h, maxY = 0;

            for (let y = 0; y < h; y += gap) {
                for (let x = 0; x < w; x += gap) {
                    const idx = (y * w + x) * 4;
                    if (pixels[idx + 3] > 60) {
                        dots.push(new S.Point({ x, y }));
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            const boundsW = maxX > minX ? maxX - minX : w;
            const boundsH = maxY > minY ? maxY - minY : h;

            return {
                dots: dots,
                w: boundsW,
                h: boundsH,
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2
            };
        }
    };
}());

S.Shape = (function () {
    let dots = [];

    return {
        switchShape: function (n, fast) {
            const a = S.Drawing.getArea();
            const targetDots = n.dots || [];

            while (dots.length < targetDots.length) {
                dots.push(new S.Dot(a.w / 2, a.h / 2));
            }

            const offsetX = a.w / 2 - (n.centerX || a.w / 2);
            const offsetY = a.h / 2 - (n.centerY || a.h / 2);

            for (let i = 0; i < targetDots.length; i++) {
                dots[i].e = fast ? 0.25 : 0.12;
                dots[i].s = true;
                dots[i].move(new S.Point({
                    x: targetDots[i].x + offsetX,
                    y: targetDots[i].y + offsetY,
                    z: window.innerWidth < 768 ? 2.8 : 4.0,
                    a: 1,
                    h: 0
                }));
            }

            for (let i = targetDots.length; i < dots.length; i++) {
                dots[i].s = false;
                dots[i].e = 0.04;
                dots[i].move(new S.Point({
                    x: Math.random() * a.w,
                    y: Math.random() * a.h,
                    z: 1,
                    a: 0.1,
                    h: 0
                }));
            }
        },
        render: function () {
            for (let i = 0; i < dots.length; i++) {
                dots[i].render();
            }
        }
    };
}());

S.UI = (function () {
    let currentSequenceToken = 0;

    async function runSequence(actionStr, token) {
        const items = typeof actionStr === 'object' ? actionStr : actionStr.split('|').filter(s => s.trim() !== '');

        for (let item of items) {
            if (token !== currentSequenceToken) return;
            const str = item.trim();

            if (str.startsWith('#countdown')) {
                const count = parseInt(str.split(' ')[1]) || 3;
                for (let c = count; c >= 1; c--) {
                    if (token !== currentSequenceToken) return;
                    S.Shape.switchShape(S.ShapeBuilder.letter(c.toString()), true);
                    await sleep(1100);
                }
            } else if (str.startsWith('#gift')) {
                if (token !== currentSequenceToken) return;
                showStars();
                showFloatingHearts();
                await sleep(800);
                const canvas = document.querySelector('.canvas');
                const matrixCanvas = document.getElementById('matrix-rain');
                if (canvas) canvas.style.display = 'none';
                if (matrixCanvas) matrixCanvas.style.opacity = '0.35';

                const currentSettings = window.settings || {};
                if (currentSettings.enableBook !== false) {
                    showBook();
                } else if (currentSettings.enableHeart !== false) {
                    startHeartEffect();
                } else if (typeof initTimeline === 'function') {
                    initTimeline();
                }
            } else {
                if (token !== currentSequenceToken) return;
                S.Shape.switchShape(S.ShapeBuilder.letter(str));
                const delay = Math.max(1800, 1700 + (str.length - 4) * 110);
                await sleep(delay);
            }
        }
    }

    return {
        simulate: function (action) {
            currentSequenceToken++;
            const token = currentSequenceToken;
            runSequence(action, token);
        },
        reset: function (destroy) {
            currentSequenceToken++;
            if (destroy && S.Shape) {
                S.Shape.switchShape(S.ShapeBuilder.letter(''));
            }
        }
    };
}());

// ==========================================
// 3. 3D Photo Album (Book) Engine - Dead Centered
// ==========================================
function createPages() {
    const book = document.getElementById('book');
    if (!book) return;
    book.innerHTML = '';

    const currentPages = (window.settings && window.settings.pages) || [];
    const totalPhysicalPages = Math.ceil(currentPages.length / 2);

    for (let i = 0; i < totalPhysicalPages; i++) {
        const pageEl = document.createElement('div');
        pageEl.className = 'page';
        pageEl.dataset.page = i;

        const frontIdx = i * 2;
        const backIdx = frontIdx + 1;

        const front = document.createElement('div');
        front.className = 'page-front';
        if (currentPages[frontIdx]) {
            const img = document.createElement('img');
            img.src = currentPages[frontIdx].image || './image/Birthday!/cover.jpg';
            front.appendChild(img);
        }

        const back = document.createElement('div');
        back.className = 'page-back';
        if (currentPages[backIdx]) {
            const img = document.createElement('img');
            img.src = currentPages[backIdx].image || './image/Birthday!/9.jpg';
            back.appendChild(img);
        }

        pageEl.appendChild(front);
        pageEl.appendChild(back);
        book.appendChild(pageEl);

        pageEl.addEventListener('click', (e) => {
            if (isFlipping) return;
            const rect = pageEl.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX >= rect.width / 2 && !pageEl.classList.contains('flipped')) {
                nextPage();
            } else if (clickX < rect.width / 2 && pageEl.classList.contains('flipped')) {
                prevPage();
            }
        });
    }

    updatePageZIndexes();
    photoUrls = currentPages.map(p => p.image).filter(Boolean);
}

function updatePageZIndexes() {
    const allPages = document.querySelectorAll('.page');
    const total = allPages.length;
    allPages.forEach((p, idx) => {
        p.style.setProperty('--page-z-index', (total - idx).toString());
        p.style.setProperty('--page-flipped-z-index', (idx + 1).toString());
    });
}

function showBook() {
    const bookContainer = document.getElementById('bookContainer');
    if (bookContainer) {
        bookContainer.style.display = 'flex';
        requestAnimationFrame(() => {
            bookContainer.classList.add('show');
            showPageContent();
        });
    }
}

function hideBook() {
    const bookContainer = document.getElementById('bookContainer');
    const contentDisplay = document.getElementById('contentDisplay');
    if (bookContainer) {
        bookContainer.classList.remove('show');
        setTimeout(() => { bookContainer.style.display = 'none'; }, 800);
    }
    if (contentDisplay) {
        contentDisplay.classList.remove('show');
    }
}

function nextPage() {
    const allPages = document.querySelectorAll('.page');
    if (currentPage < allPages.length && !isFlipping) {
        isFlipping = true;
        const pageToFlip = allPages[currentPage];
        if (pageToFlip) {
            pageToFlip.classList.add('flipped');
            currentPage++;
            showPageContent();
            setTimeout(() => {
                isFlipping = false;
                if (currentPage >= allPages.length) {
                    onBookFinished();
                }
            }, 600);
        }
    }
}

function prevPage() {
    const allPages = document.querySelectorAll('.page');
    if (currentPage > 0 && !isFlipping) {
        isFlipping = true;
        currentPage--;
        const pageToFlip = allPages[currentPage];
        if (pageToFlip) {
            pageToFlip.classList.remove('flipped');
            showPageContent();
            setTimeout(() => {
                isFlipping = false;
            }, 600);
        }
    }
}

function onBookFinished() {
    if (isBookFinished) return;
    isBookFinished = true;
    setTimeout(() => {
        hideBook();
        startHeartEffect();
    }, 1000);
}

function showPageContent() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    const contentDisplay = document.getElementById('contentDisplay');
    const contentText = document.getElementById('contentText');
    const currentPages = (window.settings && window.settings.pages) || [];

    const logicalIdx = currentPage * 2;
    const message = currentPages[logicalIdx]?.content || currentPages[logicalIdx + 1]?.content;

    if (message && contentDisplay && contentText) {
        contentDisplay.classList.add('show');
        contentText.innerHTML = '';
        typewriterEffect(contentText, message, 30);
    } else if (contentDisplay) {
        contentDisplay.classList.remove('show');
    }
}

function typewriterEffect(element, text, speed = 30) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(type, speed);
        }
    }
    type();
}

function setupBookGestures() {
    const book = document.getElementById('book');
    if (!book) return;

    let touchStartX = 0;
    book.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    book.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
            if (diff < 0) nextPage();
            else prevPage();
        }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
    });
}

// ==========================================
// 4. Heart Photo Cardioid Constellation (Stage 4)
// ==========================================
function startHeartEffect() {
    const currentSettings = window.settings || {};
    if (currentSettings.enableHeart === false) {
        if (typeof initTimeline === 'function') initTimeline();
        return;
    }

    showConfetti();
    showFirework();
    spawnHeartPhotosCentered();
}

function createHeartPhotoCentered(idx, total) {
    if (heartPhotosCreated >= maxHeartPhotos) return;

    const photoUrl = photoUrls[idx % photoUrls.length] || './image/Birthday!/photo1.jpg';
    const photo = document.createElement('img');
    photo.src = photoUrl;
    photo.className = 'photo heart-photo-item';

    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.5;
    const t = (idx / total) * 2 * Math.PI;

    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 8 : 16;

    const sin_t = Math.sin(t);
    const cos_t = Math.cos(t);
    const targetX = scale * 16 * Math.pow(sin_t, 3);
    const targetY = -scale * (13 * cos_t - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    photo.style.left = `${centerX}px`;
    photo.style.top = `${centerY}px`;
    photo.style.opacity = '0';
    photo.style.transform = 'translate(-50%, -50%) scale(0)';
    photo.style.transition = 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)';

    document.body.appendChild(photo);
    heartPhotosCreated++;

    requestAnimationFrame(() => {
        photo.style.opacity = '1';
        photo.style.transform = 'translate(-50%, -50%) scale(1)';
        photo.style.left = `${centerX + targetX}px`;
        photo.style.top = `${centerY + targetY}px`;
    });
}

function spawnHeartPhotosCentered() {
    heartPhotosCreated = 0;
    let currentIndex = 0;

    function spawnNext() {
        if (currentIndex < maxHeartPhotos) {
            createHeartPhotoCentered(currentIndex, maxHeartPhotos);
            currentIndex++;
            setTimeout(spawnNext, 85);
        } else {
            // Heart photos displayed, stay for 3.5s then fade out into timeline
            setTimeout(() => {
                const photos = document.querySelectorAll('.heart-photo-item');
                photos.forEach(p => {
                    p.style.opacity = '0';
                    p.style.transform = 'translate(-50%, -50%) scale(0.5)';
                });
                setTimeout(() => {
                    photos.forEach(p => p.remove());
                    if (typeof initTimeline === 'function') {
                        initTimeline();
                    }
                }, 800);
            }, 3500);
        }
    }
    spawnNext();
}

function showFloatingHearts() {
    const interval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerText = ['💖', '💕', '🌸', '✨', '🎂', '⭐'][Math.floor(Math.random() * 6)];
        heart.style.left = `${Math.random() * 95}vw`;
        heart.style.bottom = '-30px';
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 4000);
    }, 400);

    setTimeout(() => clearInterval(interval), 15000);
}

function showConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ffd700', '#00f2fe', '#b537f2', '#ffffff'];
    for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.top = '-10px';
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        conf.style.transition = `top ${Math.random() * 2 + 2}s cubic-bezier(0.25, 1, 0.5, 1), transform 3s ease`;

        document.body.appendChild(conf);

        requestAnimationFrame(() => {
            conf.style.top = `${window.innerHeight + 20}px`;
            conf.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
        });

        setTimeout(() => conf.remove(), 4500);
    }
}

function showFirework() {
    const container = document.getElementById('fireworkContainer');
    if (!container) return;
    const colors = ['#ff69b4', '#ffd700', '#00f2fe', '#ff1493', '#ffffff'];

    for (let f = 0; f < 3; f++) {
        setTimeout(() => {
            const originX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
            const originY = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.1;

            for (let i = 0; i < 35; i++) {
                const spark = document.createElement('div');
                spark.style.position = 'fixed';
                spark.style.width = '6px';
                spark.style.height = '6px';
                spark.style.borderRadius = '50%';
                spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                spark.style.boxShadow = `0 0 10px ${spark.style.backgroundColor}`;
                spark.style.left = `${originX}px`;
                spark.style.top = `${originY}px`;
                spark.style.zIndex = '9999';
                spark.style.transition = 'all 1s cubic-bezier(0.1, 1, 0.1, 1)';

                container.appendChild(spark);

                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 140 + 40;

                requestAnimationFrame(() => {
                    spark.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
                    spark.style.opacity = '0';
                });

                setTimeout(() => spark.remove(), 1100);
            }
        }, f * 350);
    }
}

function showStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    container.innerHTML = '';

    const count = window.innerWidth < 768 ? 60 : 120;
    const sizes = ['small', 'medium', 'large'];

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]}`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 1.5}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

// ==========================================
// 5. Audio & Controls Setup
// ==========================================
function setupAudioAndControls() {
    const musicControl = document.getElementById('musicControl');
    const audio = document.getElementById('birthdayAudio');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!audio) return;
    audio.volume = 0.65;

    function playAudio() {
        audio.play().then(() => {
            if (musicControl) {
                musicControl.innerHTML = '⏸';
                musicControl.classList.add('playing');
            }
        }).catch(() => {});
    }

    function toggleAudio() {
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
            if (musicControl) {
                musicControl.innerHTML = '▶';
                musicControl.classList.remove('playing');
            }
        }
    }

    if (musicControl) musicControl.onclick = toggleAudio;

    document.addEventListener('click', () => {
        if (audio.paused) playAudio();
    }, { once: true });

    if (fullscreenBtn) {
        fullscreenBtn.onclick = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        };
    }
}

// ==========================================
// 6. Init
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    showStars();
    initMatrixRain();
    setupBookGestures();
    setupAudioAndControls();

    S.init();
    applyLoadedSettings();

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeDebounce);
        window.resizeDebounce = setTimeout(() => {
            initMatrixRain();
        }, 150);
    });
});
