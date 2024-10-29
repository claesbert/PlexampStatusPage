// scripts/api.js

import { updateNowPlayingUI, resetNowPlaying, useHttps } from './ui.js';
import { getPlexCredentials } from './utils.js';

let fetchIntervalId = null;

export function startFetchingNowPlaying() {
    fetchNowPlaying();
    if (fetchIntervalId) clearInterval(fetchIntervalId);
    fetchIntervalId = setInterval(fetchNowPlaying, 5000); // Fetch every 5 seconds
}

export async function fetchNowPlaying() {
    const { plexToken, plexIP } = getPlexCredentials();
    if (!plexToken || !plexIP) return;

    // Use the imported HTTPS setting
    const protocol = useHttps() ? 'https' : 'http';

    const url = `${protocol}://${plexIP}:32400/status/sessions?X-Plex-Token=${plexToken}`;
    try {
        const response = await fetch(url);
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');

        const media = xmlDoc.querySelector('Video') || xmlDoc.querySelector('Track');

        if (media) {
            const mediaId = media.getAttribute('ratingKey');
            const title = media.getAttribute('title');

            // Handle Various Artists issue
            let artist;
            if (media.getAttribute('grandparentTitle') === 'Various Artists') {
                artist =
                    media.getAttribute('originalTitle') ||
                    media.getAttribute('title') ||
                    'Unknown Artist';
            } else {
                artist =
                    media.getAttribute('grandparentTitle') ||
                    media.getAttribute('parentTitle') ||
                    'Unknown Artist';
            }

            const album = media.getAttribute('parentTitle');
            const albumYear = media.getAttribute('parentYear') || '';
            const coverUrl = media.getAttribute('thumb');
            const viewOffset = parseInt(media.getAttribute('viewOffset')) || 0;
            const duration = parseInt(media.getAttribute('duration')) || 1;

            updateNowPlayingUI({
                mediaId,
                title,
                artist,
                album,
                albumYear,
                coverUrl,
                plexIP,
                plexToken,
                viewOffset,
                duration,
            });
        } else {
            // No media is playing
            resetNowPlaying();
        }
    } catch (error) {
        console.error('Error fetching now playing data:', error);
        resetNowPlaying();
    }
}
