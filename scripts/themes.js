// scripts/themes.js
import { getAverageRGB } from './utils.js';

export function getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
}

export function applyTheme(theme, albumArtElement) {
    localStorage.setItem('theme', theme);
    document.body.className = theme;

    // Remove any dynamic backgrounds if not in dynamic themes
    if (theme !== 'glass' && theme !== 'pastel') {
        clearDynamicBackground();
    }

    // Update cursor for Bubblegum theme
    if (theme === 'bubblegum') {
        document.body.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>❤️</text></svg>") 16 0,auto`;
    } else {
        document.body.style.cursor = 'auto';
    }

    // Update modal theme
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.className = `modal ${theme}`;

    // Update clock and settings button colors for dark themes
    const clockElement = document.getElementById('clock');
    const settingsButton = document.getElementById('settings-button');

    if (theme === 'dark' || theme === 'dark-oled') {
        clockElement.style.color = '#fff';
        settingsButton.querySelector('img').src = 'https://img.icons8.com/ios-glyphs/30/ffffff/settings.png';
    } else {
        clockElement.style.color = '';
        settingsButton.querySelector('img').src = 'https://img.icons8.com/ios-glyphs/30/000000/settings.png';
    }

    // Apply theme-specific adjustments
    if (theme === 'pastel' && albumArtElement) {
        applyPastelTheme(albumArtElement);
    } else if (theme === 'glass' && albumArtElement) {
        applyGlassTheme(albumArtElement.src);
    }
}

function applyPastelTheme(imgEl) {
    // Get average color of the album art
    const rgb = getAverageRGB(imgEl);
    if (rgb) {
        // Adjust the color to make it lighter/brighter for pastel effect
        const pastelRGB = {
            r: Math.min(255, Math.floor(rgb.r + 100)),
            g: Math.min(255, Math.floor(rgb.g + 100)),
            b: Math.min(255, Math.floor(rgb.b + 100))
        };
        const pastelColor = `rgb(${pastelRGB.r}, ${pastelRGB.g}, ${pastelRGB.b})`;
        document.body.style.backgroundColor = pastelColor;

        // Adjust other elements to fit the pastel color
        document.documentElement.style.setProperty('--pastel-color', pastelColor);
    } else {
        // Fallback color
        document.body.style.backgroundColor = '#ffd1dc';
        document.documentElement.style.setProperty('--pastel-color', '#ffd1dc');
    }
}

function applyGlassTheme(imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.classList.add('glass-theme');
    document.body.classList.remove('pastel-theme');
}

function clearDynamicBackground() {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    document.body.classList.remove('glass-theme', 'pastel-theme');
    document.documentElement.style.removeProperty('--pastel-color');
}
