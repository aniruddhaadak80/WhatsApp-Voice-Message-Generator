// ===== VOICECRAFT — MAIN APPLICATION LOGIC =====

const API_KEY = import.meta.env.VITE_SARVAM_API_KEY;
const API_URL = 'https://api.sarvam.ai/text-to-speech';

// ===== SPEAKER DATA =====
const SPEAKERS = [
    { name: 'Shubh', gender: 'male' },
    { name: 'Aditya', gender: 'male' },
    { name: 'Ritu', gender: 'female' },
    { name: 'Priya', gender: 'female' },
    { name: 'Neha', gender: 'female' },
    { name: 'Rahul', gender: 'male' },
    { name: 'Pooja', gender: 'female' },
    { name: 'Rohan', gender: 'male' },
    { name: 'Simran', gender: 'female' },
    { name: 'Kavya', gender: 'female' },
    { name: 'Amit', gender: 'male' },
    { name: 'Dev', gender: 'male' },
    { name: 'Ishita', gender: 'female' },
    { name: 'Shreya', gender: 'female' },
    { name: 'Ratan', gender: 'male' },
    { name: 'Varun', gender: 'male' },
    { name: 'Manan', gender: 'male' },
    { name: 'Sumit', gender: 'male' },
    { name: 'Roopa', gender: 'female' },
    { name: 'Kabir', gender: 'male' },
    { name: 'Aayan', gender: 'male' },
    { name: 'Ashutosh', gender: 'male' },
    { name: 'Advait', gender: 'male' },
    { name: 'Amelia', gender: 'female' },
    { name: 'Sophia', gender: 'female' },
    { name: 'Anand', gender: 'male' },
    { name: 'Tanya', gender: 'female' },
    { name: 'Tarun', gender: 'male' },
    { name: 'Sunny', gender: 'male' },
    { name: 'Mani', gender: 'male' },
    { name: 'Gokul', gender: 'male' },
    { name: 'Vijay', gender: 'male' },
    { name: 'Shruti', gender: 'female' },
    { name: 'Suhani', gender: 'female' },
    { name: 'Mohit', gender: 'male' },
    { name: 'Kavitha', gender: 'female' },
    { name: 'Rehan', gender: 'male' },
    { name: 'Soham', gender: 'male' },
    { name: 'Rupali', gender: 'female' },
];

// Wobbly border-radius presets to randomize per card
const WOBBLY_VARIANTS = [
    '255px 15px 225px 15px / 15px 225px 15px 255px',
    '15px 225px 15px 255px / 255px 15px 225px 15px',
    '225px 15px 255px 15px / 15px 255px 15px 225px',
    '15px 255px 225px 15px / 225px 15px 15px 255px',
    '255px 25px 225px 5px / 25px 225px 5px 255px',
    '5px 225px 25px 255px / 225px 5px 255px 25px',
];

// Small random rotation for cards
function randomRotation() {
    const deg = (Math.random() - 0.5) * 4; // -2 to 2 degrees
    return `rotate(${deg.toFixed(1)}deg)`;
}

// ===== STATE =====
let selectedSpeaker = 'Aditya';
let currentAudioBlob = null;
let currentAudioUrl = null;
let animationFrameId = null;

// ===== DOM ELEMENTS =====
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const clearBtn = document.getElementById('clearBtn');
const languageSelect = document.getElementById('languageSelect');
const paceSlider = document.getElementById('paceSlider');
const paceValue = document.getElementById('paceValue');
const generateBtn = document.getElementById('generateBtn');
const btnContentMain = document.getElementById('btnContentMain');
const btnContentLoading = document.getElementById('btnContentLoading');
const speakersGrid = document.getElementById('speakersGrid');
const speakerSearch = document.getElementById('speakerSearch');
const audioSection = document.getElementById('audioSection');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const waveformCanvas = document.getElementById('waveformCanvas');
const saveFavBtn = document.getElementById('saveFavBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const favoritesToggle = document.getElementById('favoritesToggle');
const favOverlay = document.getElementById('favOverlay');
const favSidebar = document.getElementById('favSidebar');
const closeFav = document.getElementById('closeFav');
const favList = document.getElementById('favList');
const favCount = document.getElementById('favCount');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const toastIcon = document.getElementById('toastIcon');

// ===== INIT SPEAKERS GRID =====
function renderSpeakers(filter = '') {
    const filtered = SPEAKERS.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase())
    );

    speakersGrid.innerHTML = filtered.map((speaker, i) => {
        const wobbly = WOBBLY_VARIANTS[i % WOBBLY_VARIANTS.length];
        const rotation = randomRotation();
        const isActive = speaker.name === selectedSpeaker;
        const initials = speaker.name.charAt(0);

        return `
      <div class="speaker-card ${isActive ? 'active' : ''}"
           data-speaker="${speaker.name}"
           style="border-radius: ${wobbly}; transform: ${rotation};">
        <div class="speaker-avatar ${speaker.gender}" style="border-radius: ${WOBBLY_VARIANTS[(i + 2) % WOBBLY_VARIANTS.length]};">
          ${initials}
        </div>
        <div class="speaker-name">${speaker.name}</div>
        <div class="speaker-gender">${speaker.gender}</div>
      </div>
    `;
    }).join('');

    // Attach click handlers
    speakersGrid.querySelectorAll('.speaker-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedSpeaker = card.dataset.speaker;
            // Clear active preset
            document.querySelectorAll('.preset-card').forEach(p => p.classList.remove('active'));
            renderSpeakers(speakerSearch.value);
        });
    });
}

renderSpeakers();

// ===== SPEAKER SEARCH =====
speakerSearch.addEventListener('input', () => {
    renderSpeakers(speakerSearch.value);
});

// ===== CHARACTER COUNT =====
messageInput.addEventListener('input', () => {
    charCount.textContent = messageInput.value.length;
});

// ===== CLEAR BUTTON =====
clearBtn.addEventListener('click', () => {
    messageInput.value = '';
    charCount.textContent = '0';
});

// ===== PACE SLIDER =====
function getPaceLabel(val) {
    if (val <= 0.6) return 'Very slow';
    if (val <= 0.9) return 'Slow';
    if (val <= 1.1) return 'Normal speed';
    if (val <= 1.4) return 'Fast';
    if (val <= 1.7) return 'Very fast';
    return 'Super fast!';
}

paceSlider.addEventListener('input', () => {
    const val = parseFloat(paceSlider.value);
    paceValue.textContent = val.toFixed(1) + 'x';
    paceValue.parentElement.childNodes[2].textContent = ' — ' + getPaceLabel(val);
});

// ===== EMOTION PRESETS =====
document.querySelectorAll('.preset-card').forEach(btn => {
    btn.addEventListener('click', () => {
        const speaker = btn.dataset.speaker;
        const pace = parseFloat(btn.dataset.pace);

        selectedSpeaker = speaker;
        paceSlider.value = pace;
        paceValue.textContent = pace.toFixed(1) + 'x';
        paceValue.parentElement.childNodes[2].textContent = ' — ' + getPaceLabel(pace);

        // Mark active preset
        document.querySelectorAll('.preset-card').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');

        renderSpeakers(speakerSearch.value);
        showToast(`${btn.dataset.mood} mode → ${speaker} at ${pace}x ✨`);
    });
});

// ===== TOAST =====
let toastTimeout;
function showToast(msg, isError = false) {
    toastMsg.textContent = msg;
    toastIcon.textContent = isError ? '❌' : '✅';
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== TTS API CALL =====
async function generateVoice() {
    const text = messageInput.value.trim();
    if (!text) {
        showToast('Write something first! ✍️', true);
        return;
    }

    // Show loading state
    generateBtn.classList.add('loading');
    btnContentMain.style.display = 'none';
    btnContentLoading.style.display = 'inline-flex';

    try {
        const requestBody = {
            inputs: [text],
            target_language_code: languageSelect.value,
            speaker: selectedSpeaker.toLowerCase(),
            pace: parseFloat(paceSlider.value),
            model: 'bulbul:v3',
        };

        console.log('TTS Request:', requestBody);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': API_KEY,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('TTS API Error Response:', errorData);
            const errorMsg = errorData.error?.message || errorData.message || errorData.detail || JSON.stringify(errorData);
            throw new Error(errorMsg || `API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.audios || !data.audios[0]) {
            throw new Error('No audio returned from API');
        }

        // Decode base64 audio
        const base64Audio = data.audios[0];
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        currentAudioBlob = new Blob([bytes], { type: 'audio/wav' });
        currentAudioUrl = URL.createObjectURL(currentAudioBlob);

        // Set audio source
        audioPlayer.src = currentAudioUrl;
        audioSection.style.display = 'block';

        // Reset player UI
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        saveFavBtn.classList.remove('saved');
        saveFavBtn.innerHTML = '<i class="far fa-heart"></i>';

        // Wait for metadata then play
        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
            drawWaveform();
        }, { once: true });

        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

        showToast(`Voice generated with ${selectedSpeaker}! 🎉`);

    } catch (error) {
        console.error('TTS Error:', error);
        showToast(error.message || 'Failed to generate voice 😞', true);
    } finally {
        generateBtn.classList.remove('loading');
        btnContentMain.style.display = 'inline-flex';
        btnContentLoading.style.display = 'none';
    }
}

generateBtn.addEventListener('click', generateVoice);

// ===== AUDIO PLAYER CONTROLS =====
playPauseBtn.addEventListener('click', () => {
    if (!audioPlayer.src) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = pct + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('ended', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
});

// Click on progress bar to seek
progressBar.addEventListener('click', (e) => {
    if (!audioPlayer.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioPlayer.currentTime = pct * audioPlayer.duration;
});

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ===== WAVEFORM VISUALIZATION =====
function drawWaveform() {
    const canvas = waveformCanvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const bars = 60;
    const barWidth = canvas.width / bars - 2;
    const heights = [];

    // Generate random-ish waveform shape (like a sketched wave)
    for (let i = 0; i < bars; i++) {
        const center = bars / 2;
        const dist = Math.abs(i - center) / center;
        const base = (1 - dist * 0.6) * canvas.height * 0.7;
        const noise = (Math.random() - 0.5) * canvas.height * 0.3;
        heights.push(Math.max(4, base + noise));
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const progress = audioPlayer.duration ? audioPlayer.currentTime / audioPlayer.duration : 0;

        for (let i = 0; i < bars; i++) {
            const x = i * (barWidth + 2) + 1;
            const h = heights[i];
            const y = (canvas.height - h) / 2;
            const barProgress = i / bars;

            if (barProgress < progress) {
                ctx.fillStyle = '#ff4d4d';
            } else {
                ctx.fillStyle = '#e5e0d8';
            }

            // Slightly wobbly bars
            ctx.fillRect(x, y + (Math.random() * 1), barWidth, h);
        }

        if (!audioPlayer.paused) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    // Cancel previous animation
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    draw();

    audioPlayer.addEventListener('play', () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        draw();
    });

    audioPlayer.addEventListener('pause', () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        draw(); // one final draw
    });

    audioPlayer.addEventListener('ended', () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
}

// ===== DOWNLOAD =====
downloadBtn.addEventListener('click', () => {
    if (!currentAudioBlob) return;
    const a = document.createElement('a');
    a.href = currentAudioUrl;
    a.download = `voicecraft_${selectedSpeaker}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded! 📥');
});

// ===== SHARE =====
shareBtn.addEventListener('click', async () => {
    if (!currentAudioBlob) return;

    const file = new File([currentAudioBlob], `voicecraft_${selectedSpeaker}.wav`, {
        type: 'audio/wav',
    });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: 'Voice Message from VoiceCraft',
                text: `Voice message generated with ${selectedSpeaker} voice`,
                files: [file],
            });
            showToast('Shared! 🚀');
        } catch (err) {
            if (err.name !== 'AbortError') {
                showToast('Sharing failed, try downloading instead', true);
            }
        }
    } else {
        // Fallback: download
        downloadBtn.click();
        showToast('Sharing not supported — downloaded instead! 📥');
    }
});

// ===== FAVORITES SYSTEM =====
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('voicecraft_favorites') || '[]');
    } catch {
        return [];
    }
}

function saveFavorites(favs) {
    localStorage.setItem('voicecraft_favorites', JSON.stringify(favs));
    updateFavCount();
}

function updateFavCount() {
    const count = getFavorites().length;
    favCount.textContent = count;
}

function renderFavorites() {
    const favs = getFavorites();

    if (favs.length === 0) {
        favList.innerHTML = `
      <div class="fav-empty-state">
        <span class="fav-empty-icon">💔</span>
        <p>No favorites yet!</p>
        <span>Generate a voice & save it here</span>
      </div>
    `;
        return;
    }

    favList.innerHTML = favs.map((fav, idx) => `
    <div class="fav-item" data-index="${idx}">
      <div class="fav-item-text">${escapeHtml(fav.text)}</div>
      <div class="fav-item-meta">
        <span class="fav-tag speaker-tag">🗣️ ${fav.speaker}</span>
        <span class="fav-tag lang-tag">🌍 ${fav.language}</span>
        <span class="fav-tag pace-tag">🏃 ${fav.pace}x</span>
        <div class="fav-item-actions">
          <button class="fav-use-btn" data-index="${idx}" title="Use this">↩</button>
          <button class="fav-del-btn" data-index="${idx}" title="Delete">✕</button>
        </div>
      </div>
    </div>
  `).join('');

    // Use button
    favList.querySelectorAll('.fav-use-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            const fav = favs[idx];
            messageInput.value = fav.text;
            charCount.textContent = fav.text.length;
            selectedSpeaker = fav.speaker;
            languageSelect.value = fav.language;
            paceSlider.value = fav.pace;
            paceValue.textContent = fav.pace + 'x';
            renderSpeakers(speakerSearch.value);
            closeFavorites();
            showToast('Loaded favorite! ✨');
        });
    });

    // Delete button
    favList.querySelectorAll('.fav-del-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            favs.splice(idx, 1);
            saveFavorites(favs);
            renderFavorites();
            showToast('Removed from favorites 🗑️');
        });
    });
}

// Save to favorites
saveFavBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (!text) {
        showToast('No message to save!', true);
        return;
    }

    const favs = getFavorites();
    favs.unshift({
        text,
        speaker: selectedSpeaker,
        language: languageSelect.value,
        pace: parseFloat(paceSlider.value).toFixed(1),
        timestamp: Date.now(),
    });

    saveFavorites(favs);
    saveFavBtn.classList.add('saved');
    saveFavBtn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast('Saved to favorites! ❤️');
});

// Favorites sidebar toggle
function openFavorites() {
    renderFavorites();
    favOverlay.classList.add('active');
    favSidebar.classList.add('active');
}

function closeFavorites() {
    favOverlay.classList.remove('active');
    favSidebar.classList.remove('active');
}

favoritesToggle.addEventListener('click', openFavorites);
closeFav.addEventListener('click', closeFavorites);
favOverlay.addEventListener('click', closeFavorites);

// ===== UTILITIES =====
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== INIT =====
updateFavCount();

// Keyboard shortcut: Ctrl+Enter to generate
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateVoice();
    }
});
