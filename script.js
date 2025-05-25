// script.js

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyBS_BpkTIZfioDba4mD-6VUKyIDAZgJ1lM",
    authDomain: "roufsmashorpass-5416f.firebaseapp.com",
    databaseURL: "https://roufsmashorpass-5416f-default-rtdb.firebaseio.com",
    projectId: "roufsmashorpass-5416f",
    storageBucket: "roufsmashorpass-5416f.firebasestorage.app",
    messagingSenderId: "48174781281",
    appId: "1:48174781281:web:749af64aba6b025049eb20"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const smashesRef = database.ref('smashes');

// Define pic range
const minNumber = 192591;
const maxNumber = 192695;
const totalPics = maxNumber - minNumber + 1;
const allNumbers = Array.from({ length: totalPics }, (_, i) => minNumber + i);

// Local storage for user progress
let seenNumbers = JSON.parse(localStorage.getItem('seenNumbers')) || [];
let availableNumbers = allNumbers.filter(num => !seenNumbers.includes(num));
let currentNumber;

// DOM elements
const currentImg = document.getElementById('currentImg');
const smashBtn = document.getElementById('smashBtn');
const passBtn = document.getElementById('passBtn');
const leaderboardList = document.getElementById('leaderboardList');
const themeToggle = document.getElementById('themeToggle');

// Set the current image with animation
function setImage(number) {
    currentImg.src = `https://allpicture.blob.core.windows.net/c47-bmarpc/students/${number}.jpg`;
    currentImg.classList.add('fade-in');
    setTimeout(() => currentImg.classList.remove('fade-in'), 500);
}

// Handle Smash or Pass choice
function choose(action) {
    if (action === 'smash') {
        smashesRef.child(currentNumber.toString()).transaction(count => (count || 0) + 1);
    }
    seenNumbers.push(currentNumber);
    localStorage.setItem('seenNumbers', JSON.stringify(seenNumbers));
    availableNumbers = availableNumbers.filter(num => num !== currentNumber);
    if (availableNumbers.length > 0) {
        currentNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        setImage(currentNumber);
    } else {
        endGame();
    }
}

// End the game when all pics are seen
function endGame() {
    document.getElementById('game').innerHTML = '<p>You’ve seen all the pics! Clear your cache to play again.</p>';
}

// Render the leaderboard
function renderLeaderboard(sortedSmashes) {
    leaderboardList.innerHTML = '';
    sortedSmashes.forEach(([number, count]) => {
        const div = document.createElement('div');
        div.classList.add('leaderboard-item');
        const img = document.createElement('img');
        img.src = `https://allpicture.blob.core.windows.net/c47-bmarpc/students/${number}.jpg`;
        img.alt = `Student ${number}`;
        img.classList.add('thumbnail');
        const text = document.createElement('span');
        text.textContent = `${count} smashes`;
        div.appendChild(img);
        div.appendChild(text);
        leaderboardList.appendChild(div);
    });
}

// Listen for real-time updates from Firebase
smashesRef.on('value', (snapshot) => {
    const smashes = snapshot.val() || {};
    const sortedSmashes = Object.entries(smashes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 for brevity
    renderLeaderboard(sortedSmashes);
});

// Event listeners
smashBtn.addEventListener('click', () => choose('smash'));
passBtn.addEventListener('click', () => choose('pass'));
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Initialize the app
function init() {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    // Start game or end if all pics seen
    if (availableNumbers.length > 0) {
        currentNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        setImage(currentNumber);
    } else {
        endGame();
    }
}

init();