// scripts/main.js
import { fetchNowPlaying } from './api.js';
import { updateClock, initializeUI } from './ui.js';
import { getCurrentTheme, applyTheme } from './themes.js';
import { getPlexCredentials } from './utils.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Apply the current theme
    applyTheme(getCurrentTheme());

    // Initialize UI components and event listeners
    initializeUI();

    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);

    // Fetch now playing info periodically
    setInterval(fetchNowPlaying, 1000);
    fetchNowPlaying();
});
