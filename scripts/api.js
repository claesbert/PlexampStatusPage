// scripts/api.js

import { updateNowPlayingUI, resetNowPlaying } from './ui.js';
import { getPlexCredentials, formatTime } from './utils.js';
import { state } from './state.js';

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

            if (mediaId !== state.lastMediaId || Math.abs(newOffset - state.currentOffset) > 5000) {
                state.lastMediaId = mediaId;
                state.currentOffset = newOffset;
                state.totalDuration = newDuration;
                state.lastUpdate = Date.now();

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

            state.isPlaying = true;

            // Update total time in the UI
            document.getElementById('total-time').innerText = formatTime(state.totalDuration);

        } else {
            // No media is playing
            resetNowPlaying();
        }
    } catch (error) {
        console.error('Error fetching now playing data:', error);
        resetNowPlaying();
    }
}
