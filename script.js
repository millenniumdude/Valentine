// Get DOM elements
const homePage = document.getElementById('homePage');
const yesPage = document.getElementById('yesPage');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const imageLoader = document.getElementById('imageLoader');

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
let shownImagesCount = 0; // Tracks how many images shown in current cycle

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
    // Initialize the shuffled images array
    shuffledImages = shuffleArray(images);
    // Preload the first image before starting
    showLoader();
    return preloadImage(shuffledImages[0]);
}

function loadSongs() {
    // Songs are already defined above
    return Promise.resolve();
}

// Get song name from path
function getSongName(path) {
    return path.split('/').pop().replace(/\.[^/.]+$/, '');
}

function showLoader() {
    imageLoader.classList.add('active');
    carouselImage.classList.remove('loaded');
}

function hideLoader() {
    imageLoader.classList.remove('active');
    carouselImage.classList.add('loaded');
}

// Initialize carousel
async function startCarousel() {
    if (images.length === 0) return;

    currentImageIndex = 0;
    shownImagesCount = 0;

    // Set initial image and hide loader
    carouselImage.src = shuffledImages[currentImageIndex];
    hideLoader();

    // Change image every 3 seconds
    imageInterval = setInterval(async () => {
        let nextIndex = (currentImageIndex + 1) % shuffledImages.length;

        // If we've shown all images in this shuffle, reshuffle for next cycle
        if (nextIndex === 0) {
            shuffledImages = shuffleArray(images);
        }

        const nextImageUrl = shuffledImages[nextIndex];

        // Start preloading the next image in the background
        preloadImage(nextImageUrl).then(() => {
            // Once preloaded, if we are still on the same interval, update UI
            // (The interval logic below actually handles the timing)
        });

        // Move to next image
        currentImageIndex = nextIndex;
        shownImagesCount++;

        // Show loading state if it takes time
        showLoader();

        try {
            await preloadImage(shuffledImages[currentImageIndex]);
            carouselImage.src = shuffledImages[currentImageIndex];
            hideLoader();
        } catch (err) {
            console.error('Failed to load image:', shuffledImages[currentImageIndex]);
            // Still try to move to the next one
            hideLoader();
        }
    }, 4000); // Increased to 4s to give more time for preloading/viewing
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
