// scripts/utils.js

export function getPlexCredentials() {
    const plexToken = localStorage.getItem('plexToken') || '';
    const plexIP = localStorage.getItem('plexIP') || '';
    return { plexToken, plexIP };
}

export function savePlexCredentials(plexToken, plexIP) {
    localStorage.setItem('plexToken', plexToken);
    localStorage.setItem('plexIP', plexIP);
}

export function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export function getTimeFormat() {
    return localStorage.getItem('timeFormat') || '24h';
}

export function setTimeFormat(format) {
    localStorage.setItem('timeFormat', format);
}
