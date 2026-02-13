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
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37'
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

// No need for async loading functions anymore since we have the filenames
function loadImages() {
    // Initialize the shuffled images array
    shuffledImages = shuffleArray(images);
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
    shownImagesCount = 0;
    carouselImage.src = shuffledImages[currentImageIndex];

    // Change image every 3 seconds
    imageInterval = setInterval(() => {
        currentImageIndex++;
        shownImagesCount++;

        // If we've shown all images, reshuffle for next cycle
        if (currentImageIndex >= shuffledImages.length) {
            shuffledImages = shuffleArray(images);
            currentImageIndex = 0;
        }

        carouselImage.src = shuffledImages[currentImageIndex];
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
