// Mini-game: Catch the Gifts! (Portfolio Grade Edition)
// Glassmorphism HUD, Smooth Physics, Particle Feedback, and Celebration Modal

function initEasterEgg() {
    // Floating secret gift easter egg after 12 seconds
    setTimeout(() => {
        spawnFloatingEasterGift();
    }, 12000);

    // Shortcut button in the top dock
    const shortcutBtn = document.getElementById('miniGameShortcutBtn');
    if (shortcutBtn) {
        shortcutBtn.onclick = () => {
            startMiniGame();
        };
    }
}

function spawnFloatingEasterGift() {
    if (document.getElementById('floating-secret-gift') || document.getElementById('minigame-overlay')) return;

    const gift = document.createElement('div');
    gift.id = 'floating-secret-gift';
    gift.innerText = '🎁';
    gift.style.cssText = `
        position: fixed;
        top: 15%;
        right: -60px;
        font-size: 44px;
        cursor: pointer;
        z-index: 8900;
        filter: drop-shadow(0 0 15px rgba(255, 105, 180, 0.9));
        transition: transform 14s linear;
        animation: floatPulse 2s ease-in-out infinite;
    `;
    document.body.appendChild(gift);

    requestAnimationFrame(() => {
        gift.style.transform = `translate(-${window.innerWidth + 120}px, 160px) rotate(720deg)`;
    });

    gift.onclick = () => {
        gift.remove();
        startMiniGame();
    };

    setTimeout(() => {
        if (gift.parentElement) gift.remove();
    }, 15000);
}

function startMiniGame() {
    if (document.getElementById('minigame-overlay')) return;

    // Glassmorphism Backdrop
    const overlay = document.createElement('div');
    overlay.id = 'minigame-overlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(7, 3, 12, 0.88);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });

    // Glass Card Container
    const container = document.createElement('div');
    container.style.cssText = `
        width: 100%;
        max-width: 480px;
        height: 80vh;
        max-height: 600px;
        background: var(--theme-glass-bg, rgba(18, 10, 28, 0.75));
        border: 1px solid var(--theme-glass-border, rgba(255, 105, 180, 0.3));
        border-radius: 28px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px var(--theme-glow, rgba(255, 105, 180, 0.2));
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        position: relative;
        overflow: hidden;
    `;
    overlay.appendChild(container);

    // Close button
    const closeX = document.createElement('span');
    closeX.innerHTML = '×';
    closeX.style.cssText = `
        position: absolute;
        top: 14px;
        right: 20px;
        font-size: 28px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: color 0.2s, transform 0.2s;
    `;
    closeX.onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
    };
    container.appendChild(closeX);

    // Title
    const title = document.createElement('h2');
    title.innerText = typeof t === 'function' ? t('miniGameTitle') : 'Catch 10 Gifts! 🎁';
    title.style.cssText = `
        color: #ffffff;
        font-family: var(--font-cursive, 'Pacifico', cursive);
        margin: 0 0 4px;
        font-size: 1.5rem;
        text-shadow: 0 0 15px #ff69b4;
    `;
    container.appendChild(title);

    // Score Board
    const scoreBoard = document.createElement('div');
    scoreBoard.innerText = (typeof t === 'function' ? t('scoreLabel') : 'Score:') + ' 0 / 10';
    scoreBoard.style.cssText = `
        color: #ffb6c1;
        font-family: var(--font-display, 'Syne', sans-serif);
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 14px;
        transition: transform 0.2s ease;
    `;
    container.appendChild(scoreBoard);

    // Game Arena
    const gameArea = document.createElement('div');
    gameArea.style.cssText = `
        position: relative;
        width: 100%;
        flex-grow: 1;
        border: 2px dashed rgba(255, 105, 180, 0.35);
        border-radius: 18px;
        overflow: hidden;
        background: radial-gradient(circle at center, rgba(255, 105, 180, 0.05) 0%, rgba(7, 3, 12, 0.3) 100%);
    `;
    container.appendChild(gameArea);

    // Basket
    const basket = document.createElement('div');
    basket.innerText = '🧺';
    basket.style.cssText = `
        position: absolute;
        bottom: 12px;
        left: 50%;
        font-size: 46px;
        transform: translateX(-50%);
        transition: left 0.08s ease-out;
        filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6));
        user-select: none;
        pointer-events: none;
    `;
    gameArea.appendChild(basket);

    let score = 0;
    let basketX = 50;
    let gifts = [];
    let isGameOver = false;
    let gameInterval = null;

    // Movement: Keyboard
    function handleKey(e) {
        if (isGameOver) return;
        if (e.key === 'ArrowLeft') {
            basketX = Math.max(10, basketX - 10);
            basket.style.left = `${basketX}%`;
        } else if (e.key === 'ArrowRight') {
            basketX = Math.min(90, basketX + 10);
            basket.style.left = `${basketX}%`;
        }
    }
    window.addEventListener('keydown', handleKey);

    // Movement: Touch & Mouse on Game Area
    function updateBasketFromClientX(clientX) {
        if (isGameOver) return;
        const rect = gameArea.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(8, Math.min(92, pct));
        basketX = pct;
        basket.style.left = `${basketX}%`;
    }

    gameArea.addEventListener('mousemove', (e) => updateBasketFromClientX(e.clientX));
    gameArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
        updateBasketFromClientX(e.touches[0].clientX);
    }, { passive: false });

    function spawnGift() {
        const giftEmojis = ['🎁', '🍰', '🌸', '⭐', '🎈'];
        const el = document.createElement('div');
        el.innerText = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];
        el.style.cssText = `
            position: absolute;
            top: -40px;
            left: ${Math.random() * 80 + 10}%;
            font-size: 34px;
            filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.8));
            cursor: pointer;
            transition: transform 0.2s ease;
        `;

        // Direct tap catch
        const catchDirect = (e) => {
            e.stopPropagation();
            catchGiftObj(giftObj);
        };
        el.addEventListener('mousedown', catchDirect);
        el.addEventListener('touchstart', catchDirect, { passive: false });

        gameArea.appendChild(el);
        const giftObj = { el, y: -40, speed: Math.random() * 2 + 3 };
        gifts.push(giftObj);
    }

    function catchGiftObj(gObj) {
        if (isGameOver) return;
        const idx = gifts.indexOf(gObj);
        if (idx !== -1) {
            gifts.splice(idx, 1);
            gObj.el.style.transform = 'scale(1.4) rotate(45deg)';
            gObj.el.style.opacity = '0';
            setTimeout(() => gObj.el.remove(), 200);

            score++;
            scoreBoard.innerText = (typeof t === 'function' ? t('scoreLabel') : 'Score:') + ` ${score} / 10`;
            scoreBoard.style.transform = 'scale(1.25)';
            setTimeout(() => { scoreBoard.style.transform = 'scale(1)'; }, 150);

            if (score >= 10) {
                winGame();
            }
        }
    }

    function gameLoop() {
        if (isGameOver) return;

        if (Math.random() < 0.045) spawnGift();

        const basketRect = basket.getBoundingClientRect();

        for (let i = gifts.length - 1; i >= 0; i--) {
            const g = gifts[i];
            g.y += g.speed;
            g.el.style.top = `${g.y}px`;

            const gRect = g.el.getBoundingClientRect();

            // Collision Detection
            if (
                gRect.bottom >= basketRect.top + 10 &&
                gRect.top <= basketRect.bottom &&
                gRect.right - 10 >= basketRect.left &&
                gRect.left + 10 <= basketRect.right
            ) {
                catchGiftObj(g);
            } else if (g.y > gameArea.clientHeight + 20) {
                g.el.remove();
                gifts.splice(i, 1);
            }
        }
    }

    gameInterval = setInterval(gameLoop, 32);

    function winGame() {
        isGameOver = true;
        clearInterval(gameInterval);
        window.removeEventListener('keydown', handleKey);

        gameArea.innerHTML = '';
        scoreBoard.innerText = typeof t === 'function' ? t('miniGameWon') : '🎉 YOU WON! 🎉';
        scoreBoard.style.fontSize = '1.6rem';
        scoreBoard.style.color = '#ffd700';

        const winMsg = document.createElement('div');
        winMsg.style.cssText = `
            text-align: center;
            padding: 20px;
            color: #ffffff;
            font-family: var(--font-cursive, 'Pacifico', cursive);
            font-size: 1.3rem;
            line-height: 1.6;
            text-shadow: 0 0 15px #ff69b4;
            animation: fadeIn 0.8s ease;
        `;
        winMsg.innerHTML = typeof t === 'function' ? t('secretMsg') : 'Secret Unlocked:<br><br>You bring magic and joy wherever you go. Have the happiest birthday ever! 💖';
        gameArea.appendChild(winMsg);

        if (typeof showConfetti === 'function') showConfetti();
        if (typeof showFirework === 'function') showFirework();

        const closeBtn = document.createElement('button');
        closeBtn.className = 'timeline-btn';
        closeBtn.style.marginTop = '16px';
        closeBtn.innerText = typeof t === 'function' ? t('closeBtn') : 'Continue Celebration 💫';
        closeBtn.onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 400);
        };
        gameArea.appendChild(closeBtn);
    }
}

document.addEventListener('DOMContentLoaded', initEasterEgg);
