import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTimerStore = defineStore('timer', () => {
    const seconds = ref(0);
    const minutes = ref(0);
    let timerInterval: number | null = null;

    const startTimer = () => {
        if (timerInterval !== null) return;
        resetTimer(); // Reset before starting
        timerInterval = setInterval(() => {
            seconds.value++;
            if (seconds.value === 60) {
                minutes.value++;
                seconds.value = 0;
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    };

    const resetTimer = () => {
        seconds.value = 0;
        minutes.value = 0;
    };

    const formattedTime = () => {
        return `${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}`;
    };

    return {
        seconds,
        minutes,
        formattedTime,
        startTimer,
        stopTimer,
        resetTimer,
    };
});