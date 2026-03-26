// VERSION 2.2 - (DEBUG ALERT REMOVED FOR PRODUCTION)

// Background Confetti
function createBgShapes() {
    const bgContainer = document.getElementById('bg-elements');
    const colors = ['#f48fb1', '#ce93d8', '#ffcc80', '#80cbc4', '#ffe082'];
    for (let i = 0; i < 20; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');
        const size = Math.random() * 15 + 5;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        shape.style.left = `${Math.random() * 100}%`;
        if (Math.random() > 0.8) shape.style.borderRadius = "2px";
        shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        bgContainer.appendChild(shape);
    }
}
createBgShapes();

// To test the timer immediately, change targetDateStr to a number (e.g., 5 for 5 seconds).
// const targetDateStr = 5; // Test Mode (seconds)
const targetDateStr = "March 28, 2026 00:00:00"; // Production Date

let countdownDate;
if (typeof targetDateStr === "number") {
    countdownDate = new Date().getTime() + (targetDateStr * 1000);
} else {
    countdownDate = new Date(targetDateStr).getTime();
}


// DOM Elements
const timerContainer = document.getElementById('timer-container');
const itsTimeMsg = document.getElementById('its-time-msg');
const excitedSection = document.getElementById('excited-section');
const forYouBtn = document.getElementById('for-you-btn');
const countdownView = document.getElementById('countdown-view');
const cardView = document.getElementById('card-view');
const cardCover = document.getElementById('card-cover');
const cardInner = document.getElementById('card-inner');

// Interactive Meme Logic
let yesCount = 0;
let moreCount = 0;
let yesTimeout, noTimeout, moreTimeout, slideTimeout;

// Tracking function - sends data to our server!
function sendClick(buttonName) {
    try {
        fetch('/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ button: buttonName })
        });
    } catch (e) { } // fail silently on front-end
}

function showMeme(id, timeoutVarRef) {
    const el = document.getElementById(id);
    el.classList.add('show');
    clearTimeout(timeoutVarRef);
    return setTimeout(() => {
        el.classList.remove('show');
    }, 1500); // hide after 1.5 seconds
}

function handleYes() {
    yesCount++;
    sendClick('yes');
    const countEl = document.getElementById('count-yes');
    countEl.style.opacity = '1';
    countEl.innerText = `Clicked: ${yesCount}`;
    yesTimeout = showMeme('meme-yes', yesTimeout);
    confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 }, colors: ['#66bb6a', '#ffffff'] });

    // Add curiosity transition
    triggerCuriosity();
}

function handleNo() {
    sendClick('no');
    noTimeout = showMeme('meme-no', noTimeout);

    // Trigger Slide-in NO meme
    const slideMeme = document.getElementById('slide-meme');
    slideMeme.classList.add('slide-in');

    clearTimeout(slideTimeout);
    slideTimeout = setTimeout(() => {
        slideMeme.classList.remove('slide-in');
    }, 2000); // Slide back out after 2 seconds
}

function handleMore() {
    moreCount++;
    sendClick('more');
    const countEl = document.getElementById('count-more');
    countEl.style.opacity = '1';
    countEl.innerText = `Clicked: ${moreCount}`;
    moreTimeout = showMeme('meme-more', moreTimeout);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 }, colors: ['#ab47bc', '#ffcc80'] });

    // Add curiosity transition
    triggerCuriosity();
}

function triggerCuriosity() {
    const overlay = document.getElementById('curiosity-overlay');
    const text1 = document.getElementById('curiosity-text-1');
    const text2 = document.getElementById('curiosity-text-2');

    // Start fade to black
    overlay.classList.add('active');

    // Show text 1 after 1.5s
    setTimeout(() => {
        text1.classList.add('visible');
    }, 1500);

    // Show text 2 after 3.5s
    setTimeout(() => {
        text2.classList.add('visible');
    }, 3500);

    // Fade back out after 7s
    setTimeout(() => {
        overlay.classList.remove('active');
        text1.classList.remove('visible');
        text2.classList.remove('visible');
    }, 7000);
}

function triggerConfetti() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d81b60', '#ff4081', '#d500f9', '#ffffff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#d81b60', '#ff4081', '#d500f9', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

let countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance <= 0) {
        clearInterval(countdownInterval);

        // Ensure 0
        document.getElementById('days').innerText = "0";
        document.getElementById('hours').innerText = "0";
        document.getElementById('minutes').innerText = "0";
        document.getElementById('seconds').innerText = "0";

        // Transition to Suspense Stage
        setTimeout(() => {
            timerContainer.classList.add('hidden');
            excitedSection.classList.add('hidden');
            itsTimeMsg.classList.remove('hidden');
            forYouBtn.classList.remove('hidden');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }, 500);
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}, 1000);

// Transitions
function goToSuspenseView() {
    // Smoothly fade out the current view
    countdownView.style.opacity = '0';
    countdownView.style.transition = 'opacity 1.5s ease';

    setTimeout(() => {
        countdownView.classList.add('hidden');
        countdownView.classList.remove('active');

        const suspenseView = document.getElementById('suspense-view');
        suspenseView.classList.remove('hidden');
        suspenseView.classList.add('active');

        // Start Music (Volume low)
        const music = document.getElementById('suspense-music');
        music.volume = 0.2;
        music.play().catch(() => {
            console.log("Auto-play blocked, will try again on interaction.");
        });

        // Start typewriter sequence
        startTypewriterSequence();
    }, 1500);
}

async function startTypewriterSequence() {
    const lines = [
        { id: 'line1', text: 'Wait...' },
        { id: 'line2', text: 'Before you see anything...' },
        { id: 'line3', text: 'Mujhe tum ko kuch baat na hai...' }
    ];

    for (let i = 0; i < lines.length; i++) {
        await typeWriter(lines[i].id, lines[i].text);
        await new Promise(r => setTimeout(r, 1000)); // 1s delay between lines
    }

    // Show the button
    const btn = document.getElementById('trust-me-btn');
    btn.classList.add('show');
    btn.classList.remove('hidden');
}

function typeWriter(elementId, text) {
    return new Promise((resolve) => {
        const el = document.getElementById(elementId);
        if (!el) return resolve();
        el.classList.add('visible');
        el.innerHTML = ""; // Clear existing
        let i = 0;
        function type() {
            if (i < text.length) {
                el.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 80); // Speed of typing
            } else {
                resolve();
            }
        }
        type();
    });
}

function handleTrustClick() {
    const suspenseView = document.getElementById('suspense-view');
    // Screen fades slightly darker
    suspenseView.style.opacity = '0';
    suspenseView.style.transition = 'opacity 1s ease';

    // Smooth fade out of text/button
    document.getElementById('typewriter-container').style.opacity = '0';
    document.getElementById('trust-me-btn').style.opacity = '0';
    document.getElementById('trust-me-btn').style.pointerEvents = 'none';

    setTimeout(() => {
        suspenseView.classList.add('hidden');
        suspenseView.classList.remove('active');

        const memoryView = document.getElementById('memory-view');
        memoryView.classList.remove('hidden');
        memoryView.classList.add('active');

        // Start particles
        createMemoryParticles();

        // Start memory sequence
        startMemorySequence();
    }, 1000);
}

function createMemoryParticles() {
    const container = document.getElementById('memory-particles');
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'memory-particle';
        const size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(p);
    }
}

async function startMemorySequence() {
    const lines = [
        { id: 'mem-line1', text: 'Yaad hai tum ko apuna phele bar bata kiye the?', delay: 1500 },
        { id: 'mem-line2', text: 'Ye tum....', delay: 800 },
        { id: 'mem-line3', text: 'bhula gaye....', delay: 1000 }
    ];

    for (let i = 0; i < lines.length; i++) {
        await typeWriter(lines[i].id, lines[i].text);
        await new Promise(r => setTimeout(r, lines[i].delay));
    }

    // Reveal Memory Card
    const card = document.getElementById('memory-card');
    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.add('visible');
    }, 100);

    // Show Continue Button after card
    setTimeout(() => {
        const btn = document.getElementById('memory-continue-btn');
        btn.classList.add('show');
        btn.classList.remove('hidden');
    }, 2000);
}

function handleMemoryContinue() {
    const memoryView = document.getElementById('memory-view');
    const card = document.getElementById('memory-card');
    const typewriter = document.getElementById('memory-typewriter');
    const btn = document.getElementById('memory-continue-btn');

    // Fade out elements
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95) translateY(10px)';
    typewriter.style.opacity = '0';
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        memoryView.classList.add('hidden');
        memoryView.classList.remove('active');

        const galleryView = document.getElementById('gallery-view');
        galleryView.classList.remove('hidden');
        galleryView.classList.add('active');

        // Start gallery sequence
        startGallerySequence();
    }, 1500);
}

async function startGallerySequence() {
    const lines = [
        { id: 'gal-line1', text: 'Yaad hai apuna phele bar mile the…', delay: 2000 },
        { id: 'gal-line2', text: 'Relationship ka first day', delay: 2000 },
        { id: 'gal-line3', text: 'Aur yaad hai first time apun date pe gaye the…', delay: 1000 }
    ];

    for (let i = 0; i < lines.length; i++) {
        await typeWriter(lines[i].id, lines[i].text);
        await new Promise(r => setTimeout(r, lines[i].delay));
    }

    // Reveal Gallery Items
    revealGalleryItems();
}

async function revealGalleryItems() {
    const container = document.getElementById('gallery-container');
    container.classList.remove('hidden');
    container.style.opacity = '1';

    const items = document.querySelectorAll('.gallery-item');
    for (let i = 0; i < items.length; i++) {
        await new Promise(r => setTimeout(r, 1200)); // Emotional pause between memories
        items[i].classList.add('visible');
    }

    // Show Continue Button after a brief moment
    setTimeout(() => {
        const btn = document.getElementById('gallery-continue-btn');
        btn.classList.add('show');
        btn.classList.remove('hidden');
    }, 1500);
}

function handleGalleryContinue() {
    const galleryView = document.getElementById('gallery-view');
    const container = document.getElementById('gallery-container');
    const typewriter = document.getElementById('gallery-typewriter');
    const btn = document.getElementById('gallery-continue-btn');

    // Smooth fade out everything slowly
    container.style.opacity = '0';
    container.style.transition = 'opacity 1.5s ease';
    typewriter.style.opacity = '0';
    typewriter.style.transition = 'opacity 1.5s ease';
    btn.style.opacity = '0';
    btn.style.transition = 'opacity 1.5s ease';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        galleryView.classList.add('hidden');
        galleryView.classList.remove('active');

        const climaxView = document.getElementById('climax-view');
        climaxView.classList.remove('hidden');
        climaxView.classList.add('active');

        // Start pre-reveal sequence
        startClimaxSequence();
    }, 2000);
}

function stopAllMusic() {
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
}

async function startClimaxSequence() {
    const lines = [
        { id: 'clim-line1', text: 'Because today...', delay: 1000 },
        { id: 'clim-line2', text: 'is not just any day...', delay: 1500 }
    ];

    for (let i = 0; i < lines.length; i++) {
        await typeWriter(lines[i].id, lines[i].text);
        await new Promise(r => setTimeout(r, lines[i].delay));
    }

    // --- THE BIG MOMENT ---

    // 1. Flash
    const flash = document.getElementById('white-flash');
    flash.classList.add('active');

    // 2. Immediate changes after flash starts
    setTimeout(() => {
        const climaxView = document.getElementById('climax-view');
        climaxView.classList.add('bright');

        // Switch Music
        const oldMusic = document.getElementById('suspense-music');
        const newMusic = document.getElementById('climax-music');

        oldMusic.pause();
        newMusic.volume = 0.3;
        newMusic.play().catch(e => console.log("Climax music play failed", e));

        // Hide pre-reveal text
        document.getElementById('climax-pre-reveal').classList.add('hidden');

        // Show climax content
        const content = document.getElementById('climax-content');
        content.classList.remove('hidden');
        setTimeout(() => content.classList.add('visible'), 100);

        // Start Continuous Confetti
        startContinuousConfetti();

        // Show Next Button after 3s
        setTimeout(() => {
            const nextBtn = document.getElementById('climax-continue-btn');
            nextBtn.classList.remove('hidden');
            setTimeout(() => nextBtn.classList.add('show'), 100);
        }, 3000);

    }, 150); // Flash peak
}

function startContinuousConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 5000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function handleClimaxContinue() {
    const climaxView = document.getElementById('climax-view');
    const content = document.getElementById('climax-content');

    // Smooth fade out everything
    content.style.opacity = '0';
    content.style.transform = 'scale(0.9) translateY(10px)';
    content.style.transition = 'all 1.5s ease';

    setTimeout(() => {
        climaxView.classList.add('hidden');
        climaxView.classList.remove('active');

        const heartView = document.getElementById('heart-view');
        heartView.classList.remove('hidden');
        heartView.classList.add('active');

        // Start floating hearts
        createFloatingHearts();

        // Start heart sequence
        startHeartSequence();

        // Switch Music to calm
        const climaxMusic = document.getElementById('climax-music');
        const heartMusic = document.getElementById('heart-audio');

        climaxMusic.pause();
        heartMusic.volume = 0.2;
        heartMusic.play().catch(e => console.log("Heart music play failed", e));

    }, 1500);
}

function createFloatingHearts() {
    const container = document.getElementById('heart-particles');
    const heartIcons = ['❤️', '💖', '✨', '💓', '💕'];
    for (let i = 0; i < 15; i++) {
        const h = document.createElement('div');
        h.className = 'floating-heart';
        h.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.animationDelay = Math.random() * 10 + 's';
        h.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        container.appendChild(h);
    }
}

async function startHeartSequence() {
    const lines = [
        { id: 'heart-line1', text: 'You are not just special because it’s your birthday…', delay: 2000 },
        { id: 'heart-line2', text: 'You are special because you exist in my life…', delay: 2000 },
        { id: 'heart-line3', text: 'And I don’t think you even realize that…', delay: 2000 },
        { id: 'heart-line4', text: 'I feel lucky… really lucky…', delay: 1500 },
        { id: 'heart-line5', text: 'You changed things… without even trying…', delay: 1500 },
        { id: 'heart-line6', text: 'Just by being you…', delay: 1000 }
    ];

    for (let i = 0; i < lines.length; i++) {
        await typeWriter(lines[i].id, lines[i].text);
        await new Promise(r => setTimeout(r, lines[i].delay));
    }

    // DEFINITIVE HIDE Typewriter Lines
    const typewriter = document.getElementById('heart-typewriter');
    if (typewriter) {
        typewriter.style.transition = 'opacity 1s ease';
        typewriter.style.opacity = '0';
        
        // Wait for fade then REMOVE FROM FLOW
        setTimeout(() => {
            typewriter.style.display = 'none';
        }, 1000);
    }

    setTimeout(() => {
        // Reveal Message Card
        const card = document.getElementById('message-card');
        card.classList.remove('hidden');
        setTimeout(() => {
            card.classList.add('visible');
            // FINAL VISIBILITY OVERRIDE
            const p = document.getElementById('personal-message-text');
            if (p) {
                p.style.opacity = '1';
                p.style.visibility = 'visible';
                p.style.color = '#000000';
                p.style.display = 'block';
            }
        }, 100);

        // Show Continue Button after card
        setTimeout(() => {
            const btn = document.getElementById('heart-continue-btn');
            btn.classList.add('show');
            btn.classList.remove('hidden');
        }, 3000);
    }, 1200); // Wait for fade out
}

function handleHeartContinue() {
    const heartView = document.getElementById('heart-view');
    const card = document.getElementById('message-card');
    const typewriter = document.getElementById('heart-typewriter');
    const btn = document.getElementById('heart-continue-btn');

    // Smooth fade out everything slowly
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95) translateY(10px)';
    card.style.transition = 'all 1.5s ease';
    typewriter.style.opacity = '0';
    typewriter.style.transition = 'opacity 1.5s ease';
    btn.style.opacity = '0';
    btn.style.transition = 'opacity 1.5s ease';
    btn.style.pointerEvents = 'none';

    // Prepare for Her World stage
    setTimeout(() => {
        heartView.classList.add('hidden');
        heartView.classList.remove('active');

        const worldView = document.getElementById('her-world-view');
        worldView.classList.remove('hidden');
        worldView.classList.add('active');

        // Switch Music to uplifting
        const heartMusic = document.getElementById('heart-audio');
        const worldMusic = document.getElementById('world-audio');

        heartMusic.pause();
        worldMusic.volume = 0.3;
        worldMusic.play().catch(e => console.log("World music play failed", e));

        // Start Her World sequence
        startWorldSequence();
    }, 2000);
}

async function startWorldSequence() {
    const title = document.querySelector('.world-title');
    const photos = document.querySelectorAll('.photo-item');
    const interests = document.getElementById('interests-section');
    const nextBtn = document.getElementById('world-continue-btn');

    // 1. Show Title
    setTimeout(() => title.classList.add('visible'), 500);

    // 2. Staggered reveal Photos
    for (let i = 0; i < photos.length; i++) {
        setTimeout(() => {
            photos[i].classList.add('visible');
        }, 1500 + (i * 400));
    }

    // 3. Show Interests
    setTimeout(() => {
        interests.classList.add('visible');
    }, 3500);

    // 4. Show Next Button
    setTimeout(() => {
        nextBtn.classList.add('show');
        nextBtn.classList.remove('hidden');
    }, 5000);
}

function handleWorldContinue() {
    const worldView = document.getElementById('her-world-view');

    // Smooth fade out everything slowly
    worldView.style.opacity = '0';
    worldView.style.transition = 'opacity 1.5s ease';

    setTimeout(() => {
        worldView.classList.add('hidden');
        worldView.classList.remove('active');

        const surpriseView = document.getElementById('surprise-view');
        surpriseView.classList.remove('hidden');
        surpriseView.classList.add('active');

        // Start Surprise sequence
        startSurpriseSequence();

        // Music continues (nostalgic)
        worldView.style.opacity = '1'; // Reset
    }, 1500);
}

async function startSurpriseSequence() {
    const lines = [
        { id: 'surp-line1', text: 'And yes…', delay: 1000 },
        { id: 'surp-line2', text: 'I still remember something…', delay: 1000 },
        { id: 'surp-line3', text: 'Something you probably forgot 😄', delay: 1500 }
    ];

    for (let i = 0; i < lines.length; i++) {
        await typeWriter(lines[i].id, lines[i].text);
        await new Promise(r => setTimeout(r, lines[i].delay));
    }

    // Reveal Main Content
    setTimeout(() => {
        const content = document.getElementById('surprise-main-content');
        content.classList.remove('hidden');
        setTimeout(() => content.classList.add('visible'), 100);

        // Reveal Reaction
        setTimeout(() => {
            document.getElementById('surprise-reaction').classList.add('visible');
        }, 1500);

        // Show Continue Button
        setTimeout(() => {
            const btn = document.getElementById('surprise-continue-btn');
            btn.classList.add('show');
            btn.classList.remove('hidden');
        }, 3500);

    }, 1000);
}

function handleSurpriseContinue() {
    const surpriseView = document.getElementById('surprise-view');

    // Smooth fade out everything slowly
    surpriseView.style.opacity = '0';
    surpriseView.style.transition = 'opacity 1.5s ease';

    setTimeout(() => {
        surpriseView.classList.add('hidden');
        surpriseView.classList.remove('active');

        const voiceView = document.getElementById('voice-view');
        voiceView.classList.remove('hidden');
        voiceView.classList.add('active');

        // Reset background for voice view
        document.body.style.background = 'black';
        surpriseView.style.opacity = '1';
    }, 1500);
}

function toggleVoicePlayback() {
    const audio = document.getElementById('voice-note');
    const btn = document.getElementById('voice-play-btn');
    const icon = document.getElementById('play-icon');
    const waveform = document.getElementById('waveform');
    const bgMusic = document.getElementById('heart-audio'); // Assuming this is current

    if (audio.paused) {
        audio.play();
        icon.innerText = '⏸️';
        waveform.classList.add('active');
        btn.style.animation = 'none'; // Stop pulse when playing

        // Duck background music
        if (bgMusic) bgMusic.volume = 0.05;
    } else {
        audio.pause();
        icon.innerText = '▶️';
        waveform.classList.remove('active');
        btn.style.animation = 'heartbeat 2s infinite ease-in-out';

        // Restore background music
        if (bgMusic) bgMusic.volume = 0.2;
    }

    // Show continue button when audio ends
    audio.onended = () => {
        icon.innerText = '▶️';
        waveform.classList.remove('active');
        const nextBtn = document.getElementById('voice-continue-btn');
        nextBtn.classList.remove('hidden');
        setTimeout(() => nextBtn.classList.add('show'), 100);
        if (bgMusic) bgMusic.volume = 0.2;
    };
}

function handleVoiceContinue() {
    const voiceView = document.getElementById('voice-view');

    // Smooth fade out everything slowly
    voiceView.style.opacity = '0';
    voiceView.style.transition = 'opacity 2s ease';

    setTimeout(() => {
        voiceView.classList.add('hidden');
        voiceView.classList.remove('active');

        const wishView = document.getElementById('wish-view');
        wishView.classList.remove('hidden');
        wishView.classList.add('active');

        // Start Wish sequence
        startWishSequence();

        // Switch to peaceful music
        const voiceMusic = document.getElementById('voice-note');
        const wishMusic = document.getElementById('wish-audio');

        voiceMusic.pause();
        if (wishMusic) {
            wishMusic.volume = 0.1;
            wishMusic.play().catch(e => console.log("Wish music play failed", e));
        }

    }, 2000);
}

async function startWishSequence() {
    const line1 = 'Make a wish…';
    const line2 = 'And I hope I’m part of it… 💖';

    await typeWriter('wish-line1', line1);
    await new Promise(r => setTimeout(r, 2000));
    await typeWriter('wish-line2', line2);
}

function blowCandle() {
    const flame = document.getElementById('candle-flame');
    const instruction = document.getElementById('blow-instruction');
    const textContainer = document.getElementById('wish-text-container');
    const finalMsg = document.getElementById('final-message');
    const bgMusic = document.getElementById('wish-audio');

    // 1. Blow effect
    flame.style.opacity = '0';
    flame.style.transform = 'translateX(-50%) scale(0)';
    instruction.style.opacity = '0';

    // 2. Fade out text
    textContainer.style.opacity = '0';
    textContainer.style.transition = 'opacity 2s ease';

    // 3. Show Final Message
    setTimeout(() => {
        finalMsg.classList.remove('hidden');
        setTimeout(() => finalMsg.classList.add('visible'), 100);

        // Fade out music slowly
        if (bgMusic) {
            let vol = 0.1;
            const fadeInterval = setInterval(() => {
                vol -= 0.01;
                if (vol <= 0) {
                    bgMusic.pause();
                    clearInterval(fadeInterval);
                } else {
                    bgMusic.volume = vol;
                }
            }, 200);
        }
    }, 2500);
}

function goToCardView() {
    countdownView.classList.remove('active');
    setTimeout(() => {
        countdownView.classList.add('hidden');
        cardView.classList.remove('hidden');
        setTimeout(() => { cardView.classList.add('active'); }, 50);
    }, 800);
}

function openCard() {
    if (!cardCover.classList.contains('open')) {
        cardCover.classList.add('open');
        cardInner.classList.add('visible');
        triggerConfetti();
    }
}
