import { formatTime } from "./formatTime";

export const getAudioDuration = (file) => {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
            const duration = formatTime(audio.duration);
            resolve(duration);
        };
    });
};