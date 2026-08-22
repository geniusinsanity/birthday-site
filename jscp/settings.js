// Settings Module for Birthday Website
// Handles themes, music selection, book pages, and persistence

let pages = [];

const colorThemes = {
    pink: {
        matrixColor1: '#ff69b4',
        matrixColor2: '#ff1493',
        sequenceColor: '#ff69b4',
        accentGlow: 'rgba(255, 105, 180, 0.4)',
        name: 'Sweet Pink'
    },
    blue: {
        matrixColor1: '#00f2fe',
        matrixColor2: '#4facfe',
        sequenceColor: '#00f2fe',
        accentGlow: 'rgba(0, 242, 254, 0.4)',
        name: 'Cyber Blue'
    },
    purple: {
        matrixColor1: '#b537f2',
        matrixColor2: '#7303c0',
        sequenceColor: '#c77dff',
        accentGlow: 'rgba(181, 55, 242, 0.4)',
        name: 'Neon Violet'
    },
    custom: {
        matrixColor1: '#ff9a9e',
        matrixColor2: '#fecfef',
        sequenceColor: '#ff9a9e',
        accentGlow: 'rgba(255, 154, 158, 0.4)',
        name: 'Custom'
    }
};

const musicOptions = [
    { value: './music/zahra.mp3', label: 'Happy Birthday Zahra (Original)' }
];

function applyThemeVariables(themeKey, customColors = null) {
    const root = document.documentElement;
    const theme = colorThemes[themeKey] || colorThemes.pink;
    
    const c1 = customColors?.matrixColor1 || theme.matrixColor1;
    const c2 = customColors?.matrixColor2 || theme.matrixColor2;
    const cSeq = customColors?.sequenceColor || theme.sequenceColor;
    
    root.style.setProperty('--theme-accent-1', c1);
    root.style.setProperty('--theme-accent-2', c2);
    root.style.setProperty('--theme-glow', `rgba(${hexToRgbValues(c1)}, 0.4)`);
    root.style.setProperty('--theme-glow-strong', `rgba(${hexToRgbValues(c2)}, 0.6)`);
    root.style.setProperty('--theme-glass-border', `rgba(${hexToRgbValues(c1)}, 0.25)`);
}

function hexToRgbValues(hex) {
    if (!hex) return '255, 105, 180';
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function hexToRgb(hex) {
    if (!hex) return { r: 255, g: 105, b: 180 };
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function initializeDefaultSettings() {
    window.settings = {
        music: './music/zahra.mp3',
        countdown: 3,
        matrixText: 'HAPPYBIRTHDAY',
        matrixColor1: '#ff69b4',
        matrixColor2: '#ff1493',
        sequence: 'HAPPY|BIRTHDAY|TO|YOU|ZAHRA|❤',
        sequenceColor: '#ff69b4',
        colorTheme: 'pink',
        enableBook: true,
        enableHeart: true,
        isSave: true,
        pages: [
            { image: './image/Birthday!/cover.jpg', content: '' },
            { image: './image/Birthday!/photo1.jpg', content: 'Dear Zahra, you bring so much joy, light, and warmth into the world! 💕' },
            { image: './image/Birthday!/photo2.jpg', content: 'Your beautiful smile lights up every room and heart you touch! ✨' },
            { image: './image/Birthday!/photo3.jpg', content: 'You are such an amazing, radiant, and wonderful person! 🌸' },
            { image: './image/Birthday!/photo4.jpg', content: 'Wishing you the happiest and most unforgettable birthday! 💖' },
            { image: './image/Birthday!/photo5.jpg', content: 'May all your biggest dreams and wishes come true! 🎉' },
            { image: './image/Birthday!/photo6.jpg', content: 'Always keep shining bright like the star you are! ⭐' },
            { image: './image/Birthday!/photo7.jpg', content: 'You deserve all the infinite love and happiness! 🌈' },
            { image: './image/Birthday!/photo8.jpg', content: 'Happy Birthday to the most special Zahra! ❤️🎂' },
            { image: './image/Birthday!/9.jpg', content: '' }
        ]
    };

    // Load saved settings if any
    try {
        const saved = localStorage.getItem('birthdaySettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            window.settings = Object.assign(window.settings, parsed);
        }
    } catch (e) {
        console.warn('Could not read saved settings:', e);
    }

    pages = window.settings.pages;
    applyThemeVariables(window.settings.colorTheme, {
        matrixColor1: window.settings.matrixColor1,
        matrixColor2: window.settings.matrixColor2,
        sequenceColor: window.settings.sequenceColor
    });
}

function applyLoadedSettings() {
    const s = window.settings;
    const birthdayAudio = document.getElementById('birthdayAudio');
    if (birthdayAudio) {
        birthdayAudio.src = s.music;
    }

    if (typeof matrixChars !== 'undefined') {
        matrixChars = s.matrixText.split('');
    }

    if (typeof initMatrixRain === 'function') {
        initMatrixRain();
    }

    if (typeof createPages === 'function') {
        createPages();
    }

    if (typeof S !== 'undefined' && S.UI) {
        S.UI.reset(true);
        const sequenceStr = `|#countdown ${s.countdown}||${s.sequence}|#gift|`;
        S.UI.simulate(sequenceStr);
    }
}

function populateModal() {
    const s = window.settings;
    const musicSelect = document.getElementById('backgroundMusic');
    if (musicSelect) {
        musicSelect.innerHTML = musicOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
        musicSelect.value = s.music;
    }

    const countdownInput = document.getElementById('countdownTime');
    if (countdownInput) countdownInput.value = s.countdown;

    const sequenceInput = document.getElementById('sequenceText');
    if (sequenceInput) sequenceInput.value = s.sequence;

    const matrixTextInput = document.getElementById('matrixText');
    if (matrixTextInput) matrixTextInput.value = s.matrixText;

    const enableBookSelect = document.getElementById('enableBook');
    if (enableBookSelect) enableBookSelect.value = s.enableBook.toString();

    const enableHeartSelect = document.getElementById('enableHeart');
    if (enableHeartSelect) enableHeartSelect.value = s.enableHeart.toString();

    const isSaveCheckbox = document.getElementById('isSave');
    if (isSaveCheckbox) isSaveCheckbox.checked = s.isSave;

    const matrixColor1Input = document.getElementById('matrixColor1');
    if (matrixColor1Input) matrixColor1Input.value = s.matrixColor1;

    const matrixColor2Input = document.getElementById('matrixColor2');
    if (matrixColor2Input) matrixColor2Input.value = s.matrixColor2;

    const sequenceColorInput = document.getElementById('sequenceColor');
    if (sequenceColorInput) sequenceColorInput.value = s.sequenceColor;

    // Theme buttons setup
    const themeBtns = document.querySelectorAll('.color-theme-btn');
    const customSection = document.getElementById('customColorSection');

    themeBtns.forEach(btn => {
        const theme = btn.getAttribute('data-theme');
        btn.classList.toggle('active', theme === s.colorTheme);

        btn.onclick = () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            s.colorTheme = theme;

            if (theme === 'custom') {
                if (customSection) customSection.style.display = 'block';
            } else {
                if (customSection) customSection.style.display = 'none';
                const th = colorThemes[theme];
                if (th) {
                    if (matrixColor1Input) matrixColor1Input.value = th.matrixColor1;
                    if (matrixColor2Input) matrixColor2Input.value = th.matrixColor2;
                    if (sequenceColorInput) sequenceColorInput.value = th.sequenceColor;
                    applyThemeVariables(theme);
                }
            }
        };
    });

    if (customSection) {
        customSection.style.display = s.colorTheme === 'custom' ? 'block' : 'none';
    }

    renderPageConfigs();
}

function renderPageConfigs() {
    const pageConfigs = document.getElementById('pageConfigs');
    if (!pageConfigs) return;
    pageConfigs.innerHTML = '';

    window.settings.pages.forEach((page, index) => {
        const pageBox = document.createElement('div');
        pageBox.className = 'page-config';

        const title = document.createElement('h3');
        title.textContent = index === 0 ? t('pageTitleCover') : t('pageTitle', { num: index + 1 });
        pageBox.appendChild(title);

        if (window.settings.pages.length > 2) {
            const closeBtn = document.createElement('span');
            closeBtn.className = 'page-config-close';
            closeBtn.textContent = '×';
            closeBtn.onclick = () => removePage(index);
            pageBox.appendChild(closeBtn);
        }

        const fileLabel = document.createElement('label');
        fileLabel.textContent = t('imageLabel');
        pageBox.appendChild(fileLabel);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = `pageImage${index}`;
        fileInput.accept = 'image/*';
        pageBox.appendChild(fileInput);

        const imgPreview = document.createElement('img');
        imgPreview.id = `imagePreview${index}`;
        imgPreview.style.cssText = 'max-width: 120px; max-height: 120px; object-fit: cover; border-radius: 8px; margin: 8px 0; border: 1px solid rgba(255,105,180,0.3); display: block;';
        imgPreview.src = page.image || './image/Birthday!/cover.jpg';
        pageBox.appendChild(imgPreview);

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    imgPreview.src = re.target.result;
                    page.image = re.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        if (index > 0 && index < window.settings.pages.length - 1) {
            const captionLabel = document.createElement('label');
            captionLabel.textContent = t('contentLabel');
            captionLabel.style.marginTop = '8px';
            pageBox.appendChild(captionLabel);

            const textarea = document.createElement('textarea');
            textarea.id = `pageContent${index}`;
            textarea.placeholder = t('contentPlaceholder', { num: index + 1 });
            textarea.rows = 2;
            textarea.value = page.content || '';
            textarea.oninput = (e) => { page.content = e.target.value; };
            pageBox.appendChild(textarea);
        }

        pageConfigs.appendChild(pageBox);
    });

    if (window.settings.pages.length < 16) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'glass-btn';
        addBtn.style.width = '100%';
        addBtn.style.borderRadius = '12px';
        addBtn.style.marginTop = '10px';
        addBtn.textContent = t('addNewPage');
        addBtn.onclick = addNewPage;
        pageConfigs.appendChild(addBtn);
    }
}

function addNewPage() {
    window.settings.pages.splice(window.settings.pages.length - 1, 0, {
        image: './image/Birthday!/photo1.jpg',
        content: 'Another wonderful, magical moment together! 💖'
    });
    renderPageConfigs();
}

function removePage(index) {
    if (window.settings.pages.length <= 2) return;
    window.settings.pages.splice(index, 1);
    renderPageConfigs();
}

function setupModalEventListeners() {
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeSettingsModal');
    const applySettingsButton = document.getElementById('applySettings');

    if (settingsButton && settingsModal) {
        settingsButton.onclick = () => {
            populateModal();
            settingsModal.style.display = 'flex';
        };
    }

    if (closeModal && settingsModal) {
        closeModal.onclick = () => {
            settingsModal.style.display = 'none';
        };
    }

    if (settingsModal) {
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) settingsModal.style.display = 'none';
        };
    }

    if (applySettingsButton) {
        applySettingsButton.onclick = () => {
            const s = window.settings;
            s.music = document.getElementById('backgroundMusic')?.value || s.music;
            s.countdown = parseInt(document.getElementById('countdownTime')?.value) || 3;
            s.sequence = document.getElementById('sequenceText')?.value || s.sequence;
            s.matrixText = document.getElementById('matrixText')?.value || s.matrixText;
            s.enableBook = document.getElementById('enableBook')?.value === 'true';
            s.enableHeart = document.getElementById('enableHeart')?.value === 'true';
            s.isSave = document.getElementById('isSave')?.checked || false;

            if (s.colorTheme === 'custom') {
                s.matrixColor1 = document.getElementById('matrixColor1')?.value || s.matrixColor1;
                s.matrixColor2 = document.getElementById('matrixColor2')?.value || s.matrixColor2;
                s.sequenceColor = document.getElementById('sequenceColor')?.value || s.sequenceColor;
            } else {
                const th = colorThemes[s.colorTheme] || colorThemes.pink;
                s.matrixColor1 = th.matrixColor1;
                s.matrixColor2 = th.matrixColor2;
                s.sequenceColor = th.sequenceColor;
            }

            applyThemeVariables(s.colorTheme, {
                matrixColor1: s.matrixColor1,
                matrixColor2: s.matrixColor2,
                sequenceColor: s.sequenceColor
            });

            if (s.isSave) {
                try {
                    localStorage.setItem('birthdaySettings', JSON.stringify(s));
                } catch (e) {
                    console.warn('Could not save settings:', e);
                }
            }

            if (settingsModal) settingsModal.style.display = 'none';
            applyLoadedSettings();
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultSettings();
    setupModalEventListeners();
});
