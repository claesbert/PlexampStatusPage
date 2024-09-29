// scripts/ui.js

import { getCurrentTheme, applyTheme } from './themes.js';
import { getPlexCredentials, savePlexCredentials, formatTime } from './utils.js';
import { fetchNowPlaying } from './api.js';
import { state } from './state.js';

const clockElement = document.getElementById('clock');
const progressElement = document.getElementById('progress');
const currentTimeElement = document.getElementById('current-time');
const totalTimeElement = document.getElementById('total-time');
const trackTitleElement = document.getElementById('track-title');
const trackArtistElement = document.getElementById('track-artist');
const trackAlbumElement = document.getElementById('track-album');
const albumArtElement = document.getElementById('album-art');

const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.getElementById('close-modal');
const saveSettingsButton = document.getElementById('save-settings');
const plexIPInput = document.getElementById('plex-ip');
const plexTokenInput = document.getElementById('plex-token');
const themeSelect = document.getElementById('theme-select');

export function initializeUI() {
    // Event listeners for settings modal
    settingsButton.addEventListener('click', openSettingsModal);
    closeModal.addEventListener('click', closeSettingsModal);
    window.addEventListener('click', outsideClick);
    saveSettingsButton.addEventListener('click', saveSettings);

    // Start the progress bar updater
    setInterval(updateProgressBar, 1000);
}

export function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.innerText = `${displayHours}:${minutes} ${ampm}`;
}

function updateProgressBar() {
    if (state.isPlaying) {
        const now = Date.now();
        const elapsedTime = now - state.lastUpdate;
        state.currentOffset += elapsedTime;
        state.lastUpdate = now;

        const progressPercentage = (state.currentOffset / state.totalDuration) * 100;
        progressElement.style.width = progressPercentage + '%';
        currentTimeElement.innerText = formatTime(state.currentOffset);

        if (state.currentOffset >= state.totalDuration) {
            state.isPlaying = false;
        }
    }
}

export function updateNowPlayingUI(mediaInfo) {
    const { title, artist, album, albumYear, coverUrl, plexIP, plexToken } = mediaInfo;
    const imageUrl = `http://${plexIP}:32400${coverUrl}?X-Plex-Token=${plexToken}`;

    trackTitleElement.innerText = title;
    trackArtistElement.innerText = artist;
    trackAlbumElement.innerText = albumYear ? `${album} (${albumYear})` : album;
    albumArtElement.crossOrigin = "Anonymous"; // Important for CORS
    albumArtElement.src = imageUrl;

    // Apply dynamic themes
    const theme = getCurrentTheme();
    if (theme === 'pastel' || theme === 'glass') {
        albumArtElement.onload = () => {
            applyTheme(theme, albumArtElement);
        };
    } else {
        clearDynamicBackground();
    }
}

export function resetNowPlaying() {
    trackTitleElement.innerText = 'Nothing is currently playing.';
    trackArtistElement.innerText = '';
    trackAlbumElement.innerText = '';
    albumArtElement.src = 'https://avatars.githubusercontent.com/u/43970498'; // Default image
    progressElement.style.width = '0%';
    currentTimeElement.innerText = '0:00';
    totalTimeElement.innerText = '0:00';
    state.isPlaying = false;

    // Reset background for dynamic themes
    clearDynamicBackground();
}

function openSettingsModal() {
    settingsModal.style.display = 'block';
    // Populate inputs with current values
    const { plexToken, plexIP } = getPlexCredentials();
    plexIPInput.value = plexIP || '';
    plexTokenInput.value = plexToken || '';
    themeSelect.value = getCurrentTheme();

    // Apply theme to modal
    settingsModal.className = `modal ${getCurrentTheme()}`;
}

function closeSettingsModal() {
    settingsModal.style.display = 'none';
}

function outsideClick(event) {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
}

function saveSettings() {
    const plexIP = plexIPInput.value.trim();
    const plexToken = plexTokenInput.value.trim();
    const selectedTheme = themeSelect.value;

    if (plexIP && plexToken) {
        savePlexCredentials(plexToken, plexIP);
    }

    applyTheme(selectedTheme);
    settingsModal.style.display = 'none';
    fetchNowPlaying(); // Refresh now playing info
}

function clearDynamicBackground() {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    document.body.classList.remove('glass-theme', 'pastel-theme');
    document.documentElement.style.removeProperty('--pastel-color');
}
