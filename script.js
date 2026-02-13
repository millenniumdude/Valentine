// Get DOM elements
const homePage = document.getElementById('homePage');
const yesPage = document.getElementById('yesPage');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const imageLoader = document.getElementById('imageLoader');
const carouselImage1 = document.getElementById('carouselImage1');
const carouselImage2 = document.getElementById('carouselImage2');

// Image and Song arrays - using actual filenames from folders
let images = [
    'Pics/1.jpg', 'Pics/2.jpg', 'Pics/3.jpg', 'Pics/4.jpg', 'Pics/5.jpg',
    'Pics/6.jpg', 'Pics/7.jpg', 'Pics/8.jpg', 'Pics/9.jpg', 'Pics/10.jpg',
    'Pics/11.jpg', 'Pics/12.jpg', 'Pics/13.jpg', 'Pics/14.jpg', 'Pics/15.jpg',
    'Pics/16.jpg', 'Pics/17.jpg', 'Pics/18.jpg', 'Pics/19.jpg', 'Pics/20.jpg',
    'Pics/21.jpg', 'Pics/22.jpg', 'Pics/23.jpg', 'Pics/24.jpg', 'Pics/25.jpg',
    'Pics/26.jpg', 'Pics/27.jpg', 'Pics/28.jpg', 'Pics/29.jpg', 'Pics/30.jpg',
    'Pics/31.jpg', 'Pics/32.jpg', 'Pics/33.jpg', 'Pics/34.jpg', 'Pics/37.jpg'
];

let songs = [
    'Songs/Raabta.mp3',
    'Songs/Tum Ho.mp3',
    'Songs/Tum Se Hi.mp3'
];

let currentImageIndex = 0;
let currentSongIndex = 0;
let imageInterval;
let shuffledImages = []; // Holds the current shuffled order
let activeImg = carouselImage1;
let inactiveImg = carouselImage2;

// Fisher-Yates shuffle algorithm to randomize array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Helper to preload a single image
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
    });
}

function loadImages() {
    shuffledImages = shuffleArray(images);
    return preloadImage(shuffledImages[0]);
}

function loadSongs() {
    return Promise.resolve();
}

function getSongName(path) {
    return path.split('/').pop().replace(/\.[^/.]+$/, '');
}

function showLoader() {
    imageLoader.classList.add('active');
}

function hideLoader() {
    imageLoader.classList.remove('active');
}

// Initialize carousel
async function startCarousel() {
    if (images.length === 0) return;

    currentImageIndex = 0;
    activeImg = carouselImage1;
    inactiveImg = carouselImage2;

    // Set initial image
    activeImg.src = shuffledImages[currentImageIndex];
    activeImg.classList.add('active');
    inactiveImg.classList.remove('active');
    hideLoader();

    // Change image every 4 seconds
    imageInterval = setInterval(async () => {
        let nextIndex = (currentImageIndex + 1) % shuffledImages.length;
        if (nextIndex === 0) {
            shuffledImages = shuffleArray(images);
        }

        const nextImageUrl = shuffledImages[nextIndex];

        // Ensure next image is preloaded
        try {
            // We start preloading slightly before the transition or just await it if it's not ready
            // For a truly smooth transition, we await here. If it's cached, it's instant.
            await preloadImage(nextImageUrl);

            // Swap images
            inactiveImg.src = nextImageUrl;

            // Trigger cross-fade
            activeImg.classList.remove('active');
            activeImg.classList.add('fading');

            inactiveImg.classList.add('active');
            inactiveImg.classList.remove('fading');

            // Swap roles
            const temp = activeImg;
            activeImg = inactiveImg;
            inactiveImg = temp;

            currentImageIndex = nextIndex;
            hideLoader();
        } catch (err) {
            console.error('Failed to load image:', nextImageUrl);
            // If it fails, we just stay on current image and try next one in next interval
        }
    }, 4000);
}

// Initialize music player
function initMusicPlayer() {
    if (songs.length === 0) {
        songName.textContent = 'No songs found';
        return;
    }

    // Get last played song index from localStorage
    const lastSongIndex = localStorage.getItem('lastSongIndex');
    if (lastSongIndex !== null) {
        currentSongIndex = (parseInt(lastSongIndex) + 1) % songs.length;
    } else {
        currentSongIndex = 0;
    }

    // Save current song index
    localStorage.setItem('lastSongIndex', currentSongIndex);

    // Load and play song
    audioPlayer.src = songs[currentSongIndex];
    songName.textContent = `♪ ${getSongName(songs[currentSongIndex])}`;

    // Auto-play
    audioPlayer.play().catch(err => {
        console.log('Auto-play prevented:', err);
        playPauseBtn.textContent = '▶️';
    });

    // When song ends, play next
    audioPlayer.addEventListener('ended', playNextSong);
}

// Play next song
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    localStorage.setItem('lastSongIndex', currentSongIndex);
    audioPlayer.src = songs[currentSongIndex];
    songName.textContent = `♪ ${getSongName(songs[currentSongIndex])}`;
    audioPlayer.play();
    playPauseBtn.textContent = '⏸️';
}

// Event Listeners
yesBtn.addEventListener('click', async () => {
    homePage.classList.remove('active');
    yesPage.classList.add('active');

    // Load and start carousel and music
    await loadImages();
    await loadSongs();
    startCarousel();
    initMusicPlayer();
});

noBtn.addEventListener('click', () => {
    noClickCount++;
    // Cycle through the options repeatedly
    const textIndex = noClickCount % noTexts.length;
    noBtn.textContent = noTexts[textIndex];

    // Add shake animation
    noBtn.style.animation = 'none';
    setTimeout(() => {
        noBtn.style.animation = 'shake 0.5s';
    }, 10);
});

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️';
    }
});

nextBtn.addEventListener('click', () => {
    playNextSong();
});

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
