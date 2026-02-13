// Get DOM elements
const homePage = document.getElementById('homePage');
const yesPage = document.getElementById('yesPage');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const carouselImage = document.getElementById('carouselImage');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const songName = document.getElementById('songName');

// "No" button text progression
const noTexts = [
    'No',
    'Please',
    'Please my love',
    'Please please please',
    'Aar ragabona please',
    'Ami khub valo bashi toke'
];
let noClickCount = 0;

// Image and Song arrays - using actual filenames from folders
let images = [
    'Pics/1000243757.jpg',
    'Pics/IMG-20231019-WA0009.jpg',
    'Pics/IMG-20231220-WA0010.jpg',
    'Pics/IMG-20240930-WA0019 (3).jpg',
    'Pics/IMG-20241225-WA0056.jpg',
    'Pics/IMG-20241226-WA0005.jpg',
    'Pics/IMG-20260123-WA0122.jpg',
    'Pics/IMG20231021120102.jpg',
    'Pics/IMG20231021132724.jpg',
    'Pics/IMG20241009140108.jpg',
    'Pics/IMG_20230709_145023.jpg',
    'Pics/IMG_20250304_230048.jpg',
    'Pics/IMG_20250330_151854.jpg',
    'Pics/IMG_20250914_125258.jpg',
    'Pics/IMG_20250914_130207.jpg',
    'Pics/IMG_20260123_225730.jpg',
    'Pics/IMG_20260213_213332.jpg',
    'Pics/Screenshot_2024-12-22-17-39-08-10_6012fa4d4ddec268fc5c7112cbb265e7.jpg'
];

let songs = [
    'Songs/Raabta.mp3',
    'Songs/Tum Ho.mp3',
    'Songs/Tum Se Hi.mp3'
];

let currentImageIndex = 0;
let currentSongIndex = 0;
let imageInterval;

// Fisher-Yates shuffle algorithm to randomize array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// No need for async loading functions anymore since we have the filenames
function loadImages() {
    // Shuffle images for random order
    images = shuffleArray(images);
    return Promise.resolve();
}

function loadSongs() {
    // Songs are already defined above
    return Promise.resolve();
}

// Get song name from path
function getSongName(path) {
    return path.split('/').pop().replace(/\.[^/.]+$/, '');
}

// Initialize carousel
function startCarousel() {
    if (images.length === 0) return;

    currentImageIndex = 0;
    carouselImage.src = images[currentImageIndex];

    // Change image every 3 seconds
    imageInterval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        carouselImage.src = images[currentImageIndex];
    }, 3000);
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
