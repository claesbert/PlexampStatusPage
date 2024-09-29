// scripts/state.js

export const state = {
    lastMediaId: '',
    totalDuration: 0,
    currentOffset: 0, // Client-side playback position in milliseconds
    lastUpdate: Date.now(),
    isPlaying: false,
};
