// Bilingual translations for Zahra's Birthday Website
// Enhanced with portfolio-grade UI localization

let currentLang = localStorage.getItem('lang') || 'en';

const translations = {
    en: {
        title: "Happy Birthday Zahra 🎂✨",
        description: "A special birthday surprise for Zahra! Interactive animations, memories, 3D cake, and music!",
        login: "Sign in",
        logout: "Logout",
        settings: "Website Settings",
        music: "Music Settings",
        backgroundMusic: "Background Track:",
        countdown: "Countdown Settings",
        countdownTime: "Countdown (seconds):",
        matrix: "Matrix Rain Effect",
        matrixText: "Matrix falling text:",
        matrixColor1: "Matrix Color 1:",
        matrixColor2: "Matrix Color 2:",
        sequence: "Particle Text Sequence",
        sequenceText: "Morphing text sequence (separated by |):",
        sequenceColor: "Particle Glow Color:",
        gift: "Celebration Visuals",
        giftImage: "Optional Gift Asset:",
        enableBook: "Enable Memory Album (Book):",
        book: "Memory Book Pages",
        enableHeart: "Enable Heart Constellation:",
        note: "⏳ Enjoy this magical celebration!",
        follow: "💝 Lovingly crafted with magic and love",
        apply: "✨ Apply Changes",
        copyright: 'Crafted with 💕 for Zahra\'s Birthday',
        fullscreen: "Fullscreen",
        on: "Enabled",
        off: "Disabled",
        sec3: "3 seconds",
        sec5: "5 seconds",
        sec10: "10 seconds",
        noGif: "Default Fireworks",
        colorTheme: "Color Theme:",
        settingsHint: "Customize experience & music",
        pinkTheme: "Sweet Pink",
        blueTheme: "Cyber Blue",
        purpleTheme: "Neon Violet",
        customTheme: "Custom Palette",
        noteSequence: "Tip: Separate phrases with | (e.g. HAPPY|BIRTHDAY|ZAHRA|❤)",
        noteExpire: "⏳ <b>Celebrate:</b> Wishing you infinite happiness! 🎉",
        followNote: "💝 Lovingly created for Zahra's Special Day",
        notVietnamWarning: '🎉 Happy Birthday Zahra! May your days be filled with endless smiles and dreams fulfilled! 💕',
        pageTitleCover: "Album Cover",
        pageTitle: "Memory {num}",
        imageLabel: "Upload Photo:",
        coverPlaceholder: "Book Cover Photo",
        pagePlaceholder: "Photo {num}",
        noImageAlt: "Photo {placeholder}",
        contentLabel: "Memory Caption:",
        contentPlaceholder: "Write a sweet caption for page {num}...",
        addNewPage: "➕ Add Memory Page",
        emptyPage: "A beautiful memory waiting to be made...",
        endOfBook: "To Many More Memories ❤️",
        saveSettings: "Remember my preferences on this device",
        playMusic: "Play Music",
        pauseMusic: "Pause Music",
        nextPage: "Next Page ➡",
        prevPage: "⬅ Prev Page",
        skipToConstellation: "Skip to Memories ✨",
        makeWish: "Make a Wish 🎂",
        loadingCake: "🎂 Preparing Birthday Cake...",
        cakeTitle: "🎂 Make a Wish! Shake your cursor left & right or click to blow!",
        cakeBlown: "🎉 Happy Birthday Zahra! Your wish is on its way to the stars! ✨",
        miniGameTitle: "Catch the Gifts! 🎁",
        scoreLabel: "Score:",
        miniGameWon: "🎉 YOU CAUGHT ALL GIFTS! 🎉",
        secretMsg: "Secret Unlocked:<br><br>You bring magic and joy wherever you go. Have the happiest birthday ever! 💖",
        closeBtn: "Continue Celebration 💫",
        audioNotice: "Click anywhere to enable music & sound ✨"
    },
    fr: {
        title: "Joyeux Anniversaire Zahra 🎂✨",
        description: "Une surprise magique pour l'anniversaire de Zahra ! Animations interactives, gâteau 3D, musique et souvenirs !",
        login: "Connexion",
        logout: "Déconnexion",
        settings: "Paramètres du Site",
        music: "Paramètres Audio",
        backgroundMusic: "Piste musicale :",
        countdown: "Compte à Rebours",
        countdownTime: "Compte à rebours (sec) :",
        matrix: "Effet Matrix Rain",
        matrixText: "Texte de la pluie Matrix :",
        matrixColor1: "Couleur Matrix 1 :",
        matrixColor2: "Couleur Matrix 2 :",
        sequence: "Texte Particulaire",
        sequenceText: "Séquence morphing (séparée par |) :",
        sequenceColor: "Couleur des Particules :",
        gift: "Visuels de Célébration",
        giftImage: "Visuel optionnel :",
        enableBook: "Activer l'Album Souvenirs :",
        book: "Pages de l'Album",
        enableHeart: "Activer la Constellation Cœur :",
        note: "⏳ Profitez de cette célébration magique !",
        follow: "💝 Conçu avec amour et passion",
        apply: "✨ Appliquer les Changements",
        copyright: 'Fait avec 💕 pour l\'anniversaire de Zahra',
        fullscreen: "Plein Écran",
        on: "Activé",
        off: "Désactivé",
        sec3: "3 secondes",
        sec5: "5 secondes",
        sec10: "10 secondes",
        noGif: "Feux d'artifice par défaut",
        colorTheme: "Thème de Couleur :",
        settingsHint: "Personnaliser l'expérience & la musique",
        pinkTheme: "Rose Doux",
        blueTheme: "Bleu Cyber",
        purpleTheme: "Violet Néon",
        customTheme: "Palette Personnalisée",
        noteSequence: "Conseil : Séparez les phrases par | (ex: JOYEUX|ANNIVERSAIRE|ZAHRA|❤)",
        noteExpire: "⏳ <b>Célébration :</b> Une journée inoubliable ! 🎉",
        followNote: "💝 Créé spécialement pour la journée magique de Zahra",
        notVietnamWarning: '🎉 Joyeux Anniversaire Zahra ! Que cette année t\'apporte bonheur, réussite et amour ! 💕',
        pageTitleCover: "Couverture de l'Album",
        pageTitle: "Souvenir {num}",
        imageLabel: "Télécharger une Photo :",
        coverPlaceholder: "Photo de Couverture",
        pagePlaceholder: "Photo {num}",
        noImageAlt: "Photo {placeholder}",
        contentLabel: "Légende du Souvenir :",
        contentPlaceholder: "Écrivez un mot doux pour la page {num}...",
        addNewPage: "➕ Ajouter un Souvenir",
        emptyPage: "Un merveilleux souvenir en attente...",
        endOfBook: "À de nombreux autres souvenirs ❤️",
        saveSettings: "Sauvegarder sur cet appareil",
        playMusic: "Lancer la Musique",
        pauseMusic: "Pause",
        nextPage: "Suivant ➡",
        prevPage: "⬅ Précédent",
        skipToConstellation: "Passer aux Souvenirs ✨",
        makeWish: "Faire un Vœu 🎂",
        loadingCake: "🎂 Préparation du Gâteau...",
        cakeTitle: "🎂 Fais un vœu ! Secoue la souris de gauche à droite ou clique pour souffler !",
        cakeBlown: "🎉 Joyeux Anniversaire Zahra ! Que ton vœu s'exauce parmi les étoiles ! ✨",
        miniGameTitle: "Attrape les Cadeaux ! 🎁",
        scoreLabel: "Score :",
        miniGameWon: "🎉 TU AS GAGNÉ ! 🎉",
        secretMsg: "Secret Débloqué :<br><br>Tu illumines le monde par ta gentillesse. Très joyeux anniversaire ! 💖",
        closeBtn: "Continuer la Fête 💫",
        audioNotice: "Cliquez pour activer la musique et le son ✨"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    
    // Set title and meta
    if (translations[lang]) {
        document.title = translations[lang].title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', translations[lang].description);

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (
                    translations[lang][key].includes('<b>') ||
                    translations[lang][key].includes('<a') ||
                    translations[lang][key].includes('<br>')
                ) {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });
    }

    // Update lang button text if exists
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
        langBtn.innerHTML = `<span>${lang === 'en' ? 'FR' : 'EN'}</span>`;
    }
}

function switchLanguage() {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }
});

function t(key, vars = {}) {
    let str = (translations[currentLang] && translations[currentLang][key]) || 
              (translations['en'] && translations['en'][key]) || 
              key;
    Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
    return str;
}
