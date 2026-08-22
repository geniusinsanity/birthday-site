// Mini-game: Catch the Gifts!
// Romantic Birthday Easter Egg

function initEasterEgg() {
    setTimeout(() => {
        spawnFloatingEasterGift();
    }, 15000);
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
        font-size: 42px;
        cursor: pointer;
        z-index: 8900;
        filter: drop-shadow(0 0 12px rgba(255, 105, 180, 0.9));
        transition: transform 14s linear;
    `;
    document.body.appendChild(gift);

    requestAnimationFrame(() => {
        gift.style.transform = `translate(-${window.innerWidth + 120}px, 150px) rotate(720deg)`;
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

    const overlay = document.createElement('div');
    overlay.id = 'minigame-overlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(10, 4, 18, 0.88);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
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

    const container = document.createElement('div');
    container.style.cssText = `
        width: 100%;
        max-width: 460px;
        height: 80vh;
        max-height: 580px;
        background: rgba(25, 12, 38, 0.9);
        border: 2px solid rgba(255, 105, 180, 0.5);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 105, 180, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 22px;
        position: relative;
        overflow: hidden;
    `;
    overlay.appendChild(container);

    const closeX = document.createElement('span');
    closeX.innerHTML = '×';
    closeX.style.cssText = `
        position: absolute;
        top: 12px;
        right: 18px;
        font-size: 26px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
    `;
    closeX.onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
    };
    container.appendChild(closeX);

    const title = document.createElement('h2');
    title.innerText = typeof t === 'function' ? t('miniGameTitle') : 'Catch 10 Gifts! 🎁';
    title.style.cssText = `
        color: #ffffff;
        font-family: 'Pacifico', cursive;
        margin: 0 0 4px;
        font-size: 1.4rem;
        text-shadow: 0 0 15px #ff69b4;
    `;
    container.appendChild(title);

    const scoreBoard = document.createElement('div');
    scoreBoard.innerText = (typeof t === 'function' ? t('scoreLabel') : 'Score:') + ' 0 / 10';
    scoreBoard.style.cssText = `
        color: #ffb6c1;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 12px;
        font-family: 'Plus Jakarta Sans', sans-serif;
    `;
    container.appendChild(scoreBoard);

    const gameArea = document.createElement('div');
    gameArea.style.cssText = `
        position: relative;
        width: 100%;
        flex-grow: 1;
        border: 2px dashed rgba(255, 105, 180, 0.4);
        border-radius: 16px;
        overflow: hidden;
        background: radial-gradient(circle at center, rgba(255, 105, 180, 0.08) 0%, rgba(10, 4, 18, 0.4) 100%);
    `;
    container.appendChild(gameArea);

    const basket = document.createElement('div');
    basket.innerText = '🧺';
    basket.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 50%;
        font-size: 44px;
        transform: translateX(-50%);
        transition: left 0.08s ease-out;
        user-select: none;
        pointer-events: none;
    `;
    gameArea.appendChild(basket);

    let score = 0;
    let basketX = 50;
    let gifts = [];
    let isGameOver = false;
    let gameInterval = null;

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
            font-size: 32px;
            filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.8));
            cursor: pointer;
        `;

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
            gObj.el.remove();

            score++;
            scoreBoard.innerText = (typeof t === 'function' ? t('scoreLabel') : 'Score:') + ` ${score} / 10`;

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
        scoreBoard.style.fontSize = '1.5rem';
        scoreBoard.style.color = '#ffd700';

        const winMsg = document.createElement('div');
        winMsg.style.cssText = `
            text-align: center;
            padding: 16px;
            color: #ffffff;
            font-family: 'Pacifico', cursive;
            font-size: 1.25rem;
            line-height: 1.6;
            text-shadow: 0 0 15px #ff69b4;
        `;
        winMsg.innerHTML = typeof t === 'function' ? t('secretMsg') : 'Secret Unlocked:<br><br>You bring magic and joy wherever you go. Have the happiest birthday ever! 💖';
        gameArea.appendChild(winMsg);

        if (typeof showConfetti === 'function') showConfetti();
        if (typeof showFirework === 'function') showFirework();

        const closeBtn = document.createElement('button');
        closeBtn.className = 'timeline-btn';
        closeBtn.style.marginTop = '14px';
        closeBtn.innerText = typeof t === 'function' ? t('closeBtn') : 'Continue Celebration 💫';
        closeBtn.onclick = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 400);
        };
        gameArea.appendChild(closeBtn);
    }
}

document.addEventListener('DOMContentLoaded', initEasterEgg);
