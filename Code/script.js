let currentOffset = 0;
let totalDuration = 0;
let lastUpdate = Date.now();
let isPlaying = false;
let lastMediaId = ''; // To check if media has changed

// Function to format time (minutes:seconds)
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to update the real-time clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock(); // Call once to set immediately

// Function to update the progress bar smoothly
function updateProgressBar() {
    if (isPlaying) {
        const now = Date.now();
        const elapsedTime = now - lastUpdate;
        currentOffset += elapsedTime; // Increment progress locally
        lastUpdate = now;

        const progressPercentage = (currentOffset / totalDuration) * 100;
        document.getElementById('progress').style.width = progressPercentage + '%';
        document.getElementById('current-time').innerText = formatTime(currentOffset);

        if (currentOffset >= totalDuration) {
            isPlaying = false; // Stop progress when song ends
        }
    }
}

// Call updateProgressBar every 200ms for smooth updates
setInterval(updateProgressBar, 200);

// Function to fetch "Now Playing" information from Plex
async function fetchNowPlaying() {
    const { plexToken, plexIP } = getPlexCredentials();
    if (!plexToken || !plexIP) return; // In case setup fails or gets canceled
    const url = `http://${plexIP}:32400/status/sessions?X-Plex-Token=${plexToken}`;
    try {
        const response = await fetch(url);
        const data = await response.text(); // Plex API returns XML by default
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");

        let media = xmlDoc.querySelector("Video") || xmlDoc.querySelector("Track");

        if (media) {
            const mediaId = media.getAttribute("ratingKey");
            const title = media.getAttribute("title");
            const artist = media.getAttribute("grandparentTitle") || media.getAttribute("parentTitle");
            const coverUrl = media.getAttribute("thumb");
            const newOffset = parseInt(media.getAttribute("viewOffset")) || 0;
            const newDuration = parseInt(media.getAttribute("duration")) || 1;

            // Sync progress only if media has changed, or it's paused/seeked
            if (mediaId !== lastMediaId || Math.abs(newOffset - currentOffset) > 2000) {
                lastMediaId = mediaId;
                currentOffset = newOffset;
                totalDuration = newDuration;
                lastUpdate = Date.now(); // Reset the update time
            }

            isPlaying = true;

            const imageUrl = `http://${plexIP}:32400${coverUrl}?X-Plex-Token=${plexToken}`;
            document.getElementById('track-info').innerHTML = `
                <h2>${artist ? artist + ' - ' : ''}${title}</h2>
                <img src="${imageUrl}" alt="${title}">
            `;

            document.getElementById('total-time').innerText = formatTime(totalDuration);
        } else {
            document.getElementById('track-info').innerHTML = '<p>Nothing is currently playing.</p>';
            document.getElementById('progress').style.width = '0%';
            document.getElementById('current-time').innerText = '0:00';
            document.getElementById('total-time').innerText = '0:00';
            isPlaying = false;
        }
    } catch (error) {
        console.error('Error fetching now playing data:', error);
        document.getElementById('track-info').innerHTML = '<p>Error fetching data.</p>';
        document.getElementById('progress').style.width = '0%';
        document.getElementById('current-time').innerText = '0:00';
        document.getElementById('total-time').innerText = '0:00';
        isPlaying = false;
    }
}

function getPlexCredentials() {
    let plexToken = localStorage.getItem('plexToken');
    let plexIP = localStorage.getItem('plexIP');

    // If either the token or IP is missing, run the setup function
    if (!plexToken || !plexIP) {
        setupPlexCredentials();
    } else {
        return { plexToken, plexIP };
    }
}

function setupPlexCredentials() {
    const plexToken = prompt("Enter your Plex token:");
    const plexIP = prompt("Enter your Plex server IP address:");

    if (plexToken && plexIP) {
        localStorage.setItem('plexToken', plexToken);
        localStorage.setItem('plexIP', plexIP);
        alert('Plex token and IP saved successfully!');
    } else {
        alert('Both Plex token and IP are required.');
        setupPlexCredentials(); // Keep prompting if user cancels or leaves fields empty
    }
}


// Fetch now playing info every 5 seconds
setInterval(fetchNowPlaying, 5000);
fetchNowPlaying(); // Initial call
