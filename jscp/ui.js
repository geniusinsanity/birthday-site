// UI & Core Animation Engine for Birthday Celebration Site
// Enhanced with portfolio-grade glassmorphism, responsive controls, and fluid transitions

let matrixInterval = null;
let matrixChars = "HAPPYBIRTHDAY".split("");
let currentPage = 0;
let isFlipping = false;
let isBookFinished = false;
let typewriterTimeout = null;
let photoUrls = [];
let maxHeartPhotos = 14;
let heartPhotosCreated = 0;

// ==========================================
// 1. Interactive Cursor Bubble (Portfolio Style)
// ==========================================
function initCursorBubble() {
    const cursor = document.getElementById('cursorBubble');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover scale effects
    const interactiveElements = 'button, a, input, select, textarea, .page, .glass-btn, .timeline-content, #gift-image';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.remove('hovering');
        }
    });
}

// ==========================================
// 2. Matrix Rain Background Effect
// ==========================================
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 14 : 22;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    const delays = [];
    const started = [];

    const currentSettings = window.settings || {
        matrixColor1: '#ff69b4',
        matrixColor2: '#ff1493',
        matrixText: 'HAPPYBIRTHDAY'
    };

    const chars = currentSettings.matrixText.split('');
    const maxLength = Math.floor(canvas.height / fontSize) + 4;

    for (let x = 0; x < columns; x++) {
        drops[x] = 0;
        delays[x] = Math.random() * 2000;
        started[x] = false;
    }

    let startTime = Date.now();

    if (matrixInterval) clearInterval(matrixInterval);

    function drawMatrixRain() {
        ctx.fillStyle = 'rgba(7, 3, 12, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px Menlo, Consolas, monospace`;

        const currentTime = Date.now();

        for (let i = 0; i < drops.length; i++) {
            if (!started[i] && currentTime - startTime >= delays[i]) {
                started[i] = true;
            }

            if (started[i] && drops[i] < maxLength) {
                const char = chars[Math.floor(Math.random() * chars.length)] || '✨';
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                const color = i % 2 === 0 ? currentSettings.matrixColor1 : currentSettings.matrixColor2;

                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.fillText(char, x, y);
                ctx.shadowBlur = 0;
            }

            if (started[i]) drops[i]++;

            if (drops[i] >= maxLength) {
                drops[i] = 0;
                delays[i] = Math.random() * 1200;
                started[i] = false;
            }
        }
    }

    matrixInterval = setInterval(drawMatrixRain, isMobile ? 45 : 50);
}

// ==========================================
// 3. Particle Morphing Engine (S.js)
// ==========================================
const S = {
    initialized: false,
    init: function () {
        S.Drawing.init('.canvas');
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

S.UI = (function () {
    let interval;
    let sequence = [];
    const cmd = '#';

    function getAction(value) {
        return value && value.startsWith(cmd) && value.substring(1).split(' ')[0];
    }

    function getValue(value) {
        return value && value.split(' ')[1];
    }

    function timedAction(fn, delay, max, reverse) {
        clearInterval(interval);
        let currentAction = reverse ? max : 1;
        fn(currentAction);

        if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
            interval = setInterval(function () {
                currentAction = reverse ? currentAction - 1 : currentAction + 1;
                fn(currentAction);
                if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
                    clearInterval(interval);
                }
            }, delay);
        }
    }

    function performAction(value) {
        sequence = typeof value === 'object' ? value : sequence.concat(value.split('|').filter(s => s.trim() !== ''));

        function getDynamicDelay(str) {
            const isMobile = window.innerWidth < 768;
            const base = isMobile ? 1800 : 2000;
            if (!str || str.startsWith(cmd)) return base;
            return base + Math.max(0, (str.length - 4) * 120);
        }

        timedAction(function () {
            if (sequence.length === 0) return;
            const current = sequence.shift();
            const action = getAction(current);
            const val = getValue(current);

            switch (action) {
                case 'countdown':
                    const countVal = parseInt(val) || 3;
                    timedAction(function (index) {
                        if (index === 0) {
                            if (sequence.length > 0) {
                                performAction(sequence);
                            }
                        } else {
                            S.Shape.switchShape(S.ShapeBuilder.letter(index.toString()), true);
                        }
                    }, 1200, countVal, true);
                    break;

                case 'gift':
                    // Complete morphing sequence -> transition to 3D Book or Constellation
                    const currentSettings = window.settings || {};
                    showStars();
                    showFloatingHearts();

                    setTimeout(() => {
                        const canvas = document.querySelector('.canvas');
                        const matrixCanvas = document.getElementById('matrix-rain');
                        if (canvas) canvas.style.display = 'none';
                        if (matrixCanvas) matrixCanvas.style.opacity = '0.3';

                        if (currentSettings.enableBook !== false) {
                            showBook();
                        } else if (currentSettings.enableHeart !== false) {
                            startHeartEffect();
                        } else if (typeof initTimeline === 'function') {
                            initTimeline();
                        }
                    }, 1000);
                    break;

                default:
                    S.Shape.switchShape(S.ShapeBuilder.letter(current));
                    break;
            }
        }, getDynamicDelay(sequence[0]), sequence.length);
    }

    return {
        simulate: function (action) {
            performAction(action);
        },
        reset: function (destroy) {
            clearInterval(interval);
            sequence = [];
            if (destroy && S.Shape) {
                S.Shape.switchShape(S.ShapeBuilder.letter(''));
            }
        }
    };
}());

S.Point = function (args) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.a = args.a;
    this.h = args.h;
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
    this.p = new S.Point({
        x: x,
        y: y,
        z: window.innerWidth < 768 ? 2.5 : 4.5,
        a: 1,
        h: 0
    });
    this.e = 0.08;
    this.s = true;
    const currentSettings = window.settings || { sequenceColor: '#ff69b4' };
    const rgb = hexToRgb(currentSettings.sequenceColor);
    this.c = new S.Color(rgb.r, rgb.g, rgb.b, this.p.a);
    this.t = new S.Point({ x: x, y: y, z: this.p.z, a: 1, h: 0 });
    this.q = [];
};

S.Dot.prototype = {
    _draw: function () {
        const currentSettings = window.settings || { sequenceColor: '#ff69b4' };
        const rgb = hexToRgb(currentSettings.sequenceColor);
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

        if (this.p.h === -1) {
            this.p.x = n.x;
            this.p.y = n.y;
            return true;
        }

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
                this.t.x = p.x || this.p.x;
                this.t.y = p.y || this.p.y;
                this.t.z = p.z || this.p.z;
                this.t.a = p.a || this.p.a;
            } else {
                this.p.x -= Math.sin(Math.random() * 2);
                this.p.y -= Math.sin(Math.random() * 2);
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
    const fontSize = 500;
    const fontFamily = 'Plus Jakarta Sans, Syne, sans-serif';

    function processCanvas() {
        const pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data;
        const dots = [];
        const gap = window.innerWidth < 768 ? 6 : 8;

        for (let x = 0; x < shapeCanvas.width; x += gap) {
            for (let y = 0; y < shapeCanvas.height; y += gap) {
                const i = (y * shapeCanvas.width + x) * 4;
                if (pixels[i + 3] > 128) {
                    dots.push(new S.Point({ x: x, y: y }));
                }
            }
        }
        return dots;
    }

    function setFontSize(s) {
        shapeContext.font = `bold ${s}px ${fontFamily}`;
    }

    return {
        letter: function (l) {
            setFontSize(fontSize);
            const s = Math.min(
                fontSize,
                (shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * fontSize,
                (shapeCanvas.height / fontSize) * (isLandscape() ? 0.8 : 0.45) * fontSize
            );
            setFontSize(s);

            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeCanvas.width = Math.floor(window.innerWidth);
            shapeCanvas.height = Math.floor(window.innerHeight);

            setFontSize(s);
            shapeContext.textAlign = 'center';
            shapeContext.textBaseline = 'middle';
            shapeContext.fillStyle = '#ffffff';
            shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);

            return processCanvas();
        }
    };
}());

S.Shape = (function () {
    let dots = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        switchShape: function (n, fast) {
            const size = n.length;
            let i = 0;

            for (i = 0; i < size; i++) {
                if (!dots[i]) {
                    dots[i] = new S.Dot(width / 2, height / 2);
                }
                dots[i].e = fast ? 0.15 : 0.08;
                dots[i].move(n[i]);
            }

            for (; i < dots.length; i++) {
                dots[i].move(new S.Point({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    a: 0,
                    z: 0
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

function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

// ==========================================
// 4. 3D Photo Album (Book) Engine
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

        // Front face
        const front = document.createElement('div');
        front.className = 'page-front';
        if (currentPages[frontIdx]) {
            const img = document.createElement('img');
            img.src = currentPages[frontIdx].image || './image/Birthday!/cover.jpg';
            front.appendChild(img);
        }

        // Back face
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

        // Click to flip
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
    updatePageBadge();
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

function updatePageBadge() {
    const badge = document.getElementById('pageBadge');
    const totalPhysicalPages = Math.ceil(((window.settings && window.settings.pages) || []).length / 2);
    if (badge) {
        badge.textContent = `${currentPage + 1} / ${totalPhysicalPages || 1}`;
    }
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
            updatePageBadge();
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
            updatePageBadge();
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
    }, 1200);
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

// Touch swipe support for Book
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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
    });

    // Book Navigation Buttons
    const prevBtn = document.getElementById('bookPrevBtn');
    const nextBtn = document.getElementById('bookNextBtn');
    const skipBtn = document.getElementById('skipBookBtn');

    if (prevBtn) prevBtn.onclick = prevPage;
    if (nextBtn) nextBtn.onclick = nextPage;
    if (skipBtn) {
        skipBtn.onclick = () => {
            hideBook();
            startHeartEffect();
        };
    }
}

// ==========================================
// 5. Heart Constellation & Photo Orbit
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
    photo.className = 'photo';

    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.5;
    const t = (idx / total) * 2 * Math.PI;

    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 8 : 15;

    const sin_t = Math.sin(t);
    const cos_t = Math.cos(t);
    const targetX = scale * 16 * Math.pow(sin_t, 3);
    const targetY = -scale * (13 * cos_t - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    photo.style.left = `${centerX}px`;
    photo.style.top = `${centerY}px`;
    photo.style.opacity = '0';
    photo.style.transform = 'translate(-50%, -50%) scale(0)';
    photo.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';

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
            setTimeout(spawnNext, 90);
        } else {
            setTimeout(() => {
                if (typeof initTimeline === 'function') {
                    initTimeline();
                }
            }, 2500);
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
// 6. Audio Player & Fullscreen Handlers
// ==========================================
function setupAudioAndControls() {
    const musicControl = document.getElementById('musicControl');
    const audio = document.getElementById('birthdayAudio');
    const toast = document.getElementById('audioNoticeToast');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!audio) return;
    audio.volume = 0.65;

    function playAudio() {
        audio.play().then(() => {
            if (musicControl) {
                musicControl.innerHTML = '⏸';
                musicControl.classList.add('playing');
                musicControl.title = t('pauseMusic');
            }
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 600);
            }
            if (typeof initVisualizer === 'function') initVisualizer();
        }).catch(err => {
            console.log('Audio autoplay prevented, awaiting user interaction');
        });
    }

    function toggleAudio() {
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
            if (musicControl) {
                musicControl.innerHTML = '▶';
                musicControl.classList.remove('playing');
                musicControl.title = t('playMusic');
            }
        }
    }

    if (musicControl) musicControl.onclick = toggleAudio;

    // First interaction triggers music
    document.addEventListener('click', () => {
        if (audio.paused) playAudio();
    }, { once: true });

    // Fullscreen Toggle
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
// 7. Initialization Lifecycle
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initCursorBubble();
    showStars();
    initMatrixRain();
    setupBookGestures();
    setupAudioAndControls();

    // Start particle engine
    S.init();
    applyLoadedSettings();

    // Resize handling
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeDebounce);
        window.resizeDebounce = setTimeout(() => {
            initMatrixRain();
        }, 150);
    });
});
