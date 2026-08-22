// Timeline (Memory Lane) Logic
// Triggered after the heart photos finish

function initTimeline() {
    if (document.getElementById('timeline-container')) return;

    // Create Timeline UI - full screen overlay
    const timelineContainer = document.createElement('div');
    timelineContainer.id = 'timeline-container';
    timelineContainer.className = 'timeline-container';
    timelineContainer.style.opacity = '0';
    timelineContainer.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    // Milestones data
    const milestones = [
        { year: "2018", title: "The Star is Born ✨", desc: "Where this incredible journey began — a bright light in the universe! 🌟" },
        { year: "2020", title: "Pure Joy & Memories 💫", desc: "Moments of radiant smiles, endless laughter, and beautiful growth." },
        { year: "2022", title: "Blossoming Strength 🌸", desc: "Each day becoming more inspiring, kindhearted, and wonderful." },
        { year: "2024", title: "Shining Brighter Than Ever ⭐", desc: "Touching hearts with your warmth, elegance, and beautiful spirit." },
        { year: "Today", title: "Happy Birthday Zahra! 🎂💖", desc: "Wishing you infinite happiness, boundless love, and dreams realized!" }
    ];

    let html = '<h2 class="timeline-title">✨ Memory Lane ✨</h2><div class="timeline">';
    milestones.forEach((m, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        html += `
            <div class="timeline-item ${side}" style="animation-delay: ${index * 0.15}s">
                <div class="timeline-content">
                    <span class="timeline-year">${m.year}</span>
                    <h3>${m.title}</h3>
                    <p>${m.desc}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Call to Action Button
    const btnHtml = `
        <div class="timeline-btn-wrapper">
            <button id="proceedToCakeBtn" class="timeline-btn timeline-btn-pulse">
                ${typeof t === 'function' ? t('makeWish') : 'Make a Wish 🎂'}
            </button>
        </div>
    `;

    timelineContainer.innerHTML = html + btnHtml;
    document.body.appendChild(timelineContainer);

    // Fade in
    requestAnimationFrame(() => {
        timelineContainer.style.opacity = '1';
    });

    const btn = document.getElementById('proceedToCakeBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.innerText = typeof t === 'function' ? t('loadingCake') : '🎂 Loading Cake...';

            timelineContainer.style.opacity = '0';
            timelineContainer.style.transform = 'translateY(40px)';
            timelineContainer.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

            setTimeout(() => {
                timelineContainer.remove();
                if (typeof init3DCake === 'function') {
                    init3DCake();
                }
            }, 800);
        });
    }
}
