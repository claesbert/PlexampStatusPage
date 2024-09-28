// scripts/api.js
import { updateNowPlayingUI, resetNowPlaying } from './ui.js';
import { getPlexCredentials, formatTime } from './utils.js';

let lastMediaId = '';
export let currentOffset = 0;
export let totalDuration = 0;
export let lastUpdate = Date.now();
export let isPlaying = false;

export async function fetchNowPlaying() {
    const { plexToken, plexIP } = getPlexCredentials();
    if (!plexToken || !plexIP) return;

    const url = `http://${plexIP}:32400/status/sessions?X-Plex-Token=${plexToken}`;
    try {
        const response = await fetch(url);
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");

        const media = xmlDoc.querySelector("Video") || xmlDoc.querySelector("Track");

        if (media) {
            const mediaId = media.getAttribute("ratingKey");
            const title = media.getAttribute("title");
            const artist = media.getAttribute("grandparentTitle") || media.getAttribute("parentTitle");
            const album = media.getAttribute("parentTitle");
            const albumYear = media.getAttribute("parentYear") || '';
            const coverUrl = media.getAttribute("thumb");
            const newOffset = parseInt(media.getAttribute("viewOffset")) || 0;
            const newDuration = parseInt(media.getAttribute("duration")) || 1;

            if (mediaId !== lastMediaId || Math.abs(newOffset - currentOffset) > 5000) {
                lastMediaId = mediaId;
                currentOffset = newOffset;
                totalDuration = newDuration;
                lastUpdate = Date.now();

                updateNowPlayingUI({
                    title,
                    artist,
                    album,
                    albumYear,
                    coverUrl,
                    plexIP,
                    plexToken
                });
            }

            isPlaying = true;

            // Update total time in the UI
            document.getElementById('total-time').innerText = formatTime(totalDuration);

        } else {
            // No media is playing
            resetNowPlaying();
        }
    } catch (error) {
        console.error('Error fetching now playing data:', error);
        resetNowPlaying();
    }
}
