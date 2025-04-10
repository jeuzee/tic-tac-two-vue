import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useOptionsAndModesStore = defineStore('optionMode', () => {
    const option = ref('Place Piece');
    const mode = ref('');


    const setOptionPlacePiece = () => {
        option.value = "Place Piece";
    };

    const setOptionMoveGrid = () => {
        option.value = "Move Grid";
    };

    const setOptionMovePiece = () => {
        option.value = "Move Piece";
    };

    const setModePvP = () => {
        mode.value = "Player vs Player";
    }

    const setModePlvsAi = () => {
        mode.value = "Player vs Ai";
    }

    const setModeAivsAi = () => {
        mode.value = "Ai vs Ai";
    }

    const resetMode = () => {
        mode.value = "";
    }

    return {
        option,
        mode,
        setOptionMovePiece,
        setOptionMoveGrid,
        setOptionPlacePiece,
        setModePvP,
        setModePlvsAi,
        setModeAivsAi,
        resetMode
    }
})
