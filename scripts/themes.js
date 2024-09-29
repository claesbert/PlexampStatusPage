// scripts/themes.js

export function applyTheme(theme, albumArtImage) {
    // First, remove any dynamic background classes or styles
    clearDynamicBackground();

    document.body.className = ''; // Reset any existing classes
    document.body.classList.add(theme);

    if ((theme === 'pastel' || theme === 'glass' || theme === 'gradient') && albumArtImage) {
        if (albumArtImage.complete) {
            // If the image is already loaded, apply the dynamic theme
            if (theme === 'pastel') {
                applyPastelTheme(albumArtImage);
            }
            // If the image is already loaded, apply the dynamic theme
            if (theme === 'gradient') {
                applyPastelGradientTheme(albumArtImage);
            }
                else if (theme === 'glass') {
                applyGlassTheme(albumArtImage);
            }
        } else {
            // If the image is not loaded yet, wait for it to load
            albumArtImage.onload = () => {
                if (theme === 'pastel') {
                    applyPastelTheme(albumArtImage);
                }
                // If the image is already loaded, apply the dynamic theme
                if (theme === 'gradient') {
                    applyPastelGradientTheme(albumArtImage);
                }

                else if (theme === 'glass') {
                    applyGlassTheme(albumArtImage);
                }
            };
        }
    }
}

function applyPastelTheme(imageElement) {
    const vibrant = new Vibrant(imageElement);
    vibrant.getPalette().then((palette) => {
        const pastelColor = palette.LightVibrant
            ? palette.LightVibrant.getHex()
            : '#ffffff';
        document.documentElement.style.setProperty('--pastel-color', pastelColor);
        document.body.classList.add('pastel-theme');
    });
}

function applyGlassTheme(imageElement) {
    const imageUrl = imageElement.src;
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.classList.add('glass-theme');
}

export function clearDynamicBackground() {
    // Remove dynamic background styles
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '';
    document.body.classList.remove('glass-theme', 'pastel-theme');
    document.documentElement.style.removeProperty('--pastel-color');
}

export function getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
}

export function setCurrentTheme(theme) {
    localStorage.setItem('theme', theme);
}


function applyPastelGradientTheme(imageElement) {
    const vibrant = new Vibrant(imageElement);
    vibrant.getPalette().then((palette) => {
        const pastelColor = palette.LightVibrant
            ? palette.LightVibrant.getHex()
            : '#ffffff';

        // Define the gradient from pastelColor to dark grey (#333333)
        const gradient = `linear-gradient(to top right, ${pastelColor}, #333333)`;

        // Apply the gradient as the background
        document.documentElement.style.setProperty('--background-gradient', gradient);

        // Apply the pastel theme class if you want to style it more
        document.body.classList.add('pastel-gradient-theme');
    });
}