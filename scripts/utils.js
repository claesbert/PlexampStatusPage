// scripts/utils.js

// Format time in mm:ss
export function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Retrieve Plex credentials from localStorage
export function getPlexCredentials() {
    const plexToken = localStorage.getItem('plexToken');
    const plexIP = localStorage.getItem('plexIP');
    return { plexToken, plexIP };
}

// Save Plex credentials to localStorage
export function savePlexCredentials(plexToken, plexIP) {
    localStorage.setItem('plexToken', plexToken);
    localStorage.setItem('plexIP', plexIP);
}

// Get average RGB color from an image
export function getAverageRGB(imgEl) {
    const blockSize = 5; // Only visit every 5 pixels
    const defaultRGB = { r: 0, g: 0, b: 0 }; // Fallback color
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    let data, width, height;
    let i = -4;
    const rgb = { r: 0, g: 0, b: 0 };
    let count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        console.error('Security error, cannot access image data due to CORS');
        return defaultRGB;
    }

    const length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
}
