import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { GameBrain } from '../bll/gameBrain';

const gameInstance = new GameBrain();

export const useGameStore = defineStore('game', () => {
    const game = ref<GameBrain>(gameInstance) as Ref<GameBrain>;
    const selectedPiece = ref<{ x: number, y: number } | null>(null);
    const winner = ref("");
    const isShowingResults = ref(false);

    const resetGame = () => {
        game.value.resetGame();
        winner.value = "";
        selectedPiece.value = null;
    };

    return {
        gameInstance: game,
        selectedPiece,
        winner,
        isShowingResults,
        resetGame
    };
})
