// scripts/main.js

import { startFetchingNowPlaying } from './api.js';
import { updateClock, initializeUI } from './ui.js';
import { getCurrentTheme, applyTheme } from './themes.js';

document.addEventListener('DOMContentLoaded', () => {
    // Apply the current theme
    applyTheme(getCurrentTheme());

    // Initialize UI components and event listeners
    initializeUI();

    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);

    // Start fetching now playing info
    startFetchingNowPlaying();
});
