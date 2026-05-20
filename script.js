// ===== Slide Navigation Engine =====
const slides = document.querySelectorAll('.slide');
const counter = document.getElementById('slideCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const overviewGrid = document.getElementById('overviewGrid');
const totalSlides = slides.length;
let currentSlide = 0;

function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
    counter.textContent = `${index + 1} / ${totalSlides}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalSlides - 1;
    // Update URL hash
    history.replaceState(null, '', `#${index + 1}`);
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
}

function prevSlide() {
    if (currentSlide > 0) showSlide(currentSlide - 1);
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // If overview is open
    if (overviewGrid.classList.contains('active')) {
        if (e.key === 'Escape') toggleOverview();
        return;
    }

    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            showSlide(0);
            break;
        case 'End':
            e.preventDefault();
            showSlide(totalSlides - 1);
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'p':
        case 'P':
            window.print();
            break;
        case 'Escape':
            toggleOverview();
            break;
    }
});

// ===== Button Navigation =====
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// ===== Click Navigation (left/right halves) =====
document.querySelector('.presentation').addEventListener('click', (e) => {
    if (overviewGrid.classList.contains('active')) return;
    if (e.target.closest('.nav-controls') || e.target.closest('a') || e.target.closest('button')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.65) nextSlide();
    else if (x < 0.35) prevSlide();
});

// ===== Touch/Swipe Navigation =====
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (overviewGrid.classList.contains('active')) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) nextSlide();
        else prevSlide();
    }
}, { passive: true });

// ===== Fullscreen =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}

// ===== Overview Grid =====
function toggleOverview() {
    overviewGrid.classList.toggle('active');
}

function buildOverview() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'overview-thumb';
        const title = slide.getAttribute('data-title') || `Slide ${i + 1}`;
        thumb.innerHTML = `
            <span class="overview-thumb-num">${i + 1}</span>
            <span class="overview-thumb-title">${title}</span>
        `;
        thumb.addEventListener('click', () => {
            showSlide(i);
            toggleOverview();
        });
        overviewGrid.appendChild(thumb);
    });
}

// ===== Init =====
function init() {
    buildOverview();
    // Check URL hash
    const hash = parseInt(location.hash.replace('#', ''));
    if (hash && hash >= 1 && hash <= totalSlides) {
        showSlide(hash - 1);
    } else {
        showSlide(0);
    }
}

init();
