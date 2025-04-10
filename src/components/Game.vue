<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useTimerStore } from '@/stores/timerStore';
import { useOptionsAndModesStore } from '@/stores/optionsAndModesStore';
import GameBoard from './GameBoard.vue';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userDataStore';
import Login from './Login.vue';


const store = useUserDataStore();
const router = useRouter()
const gameStore = useGameStore();
const timer = useTimerStore();
const optionsAndModesStore = useOptionsAndModesStore();

watch(() => gameStore.gameInstance.tieOrHasWinner, (newValue) => {
    if (newValue) {
        gameStore.isShowingResults = true;
        router.push('gameOver');
    }
});

onMounted(() => {
    optionsAndModesStore.setOptionPlacePiece();
});

onUnmounted(() => {
    if (!gameStore.isShowingResults) {
        timer.stopTimer();
        optionsAndModesStore.setOptionPlacePiece();
        optionsAndModesStore.resetMode();
        gameStore.resetGame();
    }
});

const checkGameState = () => {
    if (gameStore.gameInstance.checkTie()) {
        console.log("TIE");
        gameStore.winner = "Its a TIE!";
        timer.stopTimer();
    }

    var winner: null | undefined | string = gameStore.gameInstance.winColumn();
    console.log(`WINNER - ${winner}`);
    winner = gameStore.gameInstance.winRow();
    console.log(`WINNER - ${winner}`);
    winner = gameStore.gameInstance.winDiagonal();
    console.log(`WINNER - ${winner}`);

    if (
        gameStore.gameInstance.winColumn() === "X" ||
        gameStore.gameInstance.winRow() === "X" ||
        gameStore.gameInstance.winDiagonal() === "X"
    ) {
        console.log("X WON");
        gameStore.winner = "X WON!";
        timer.stopTimer();
    }

    if (
        gameStore.gameInstance.winColumn() === "O" ||
        gameStore.gameInstance.winRow() === "O" ||
        gameStore.gameInstance.winDiagonal() === "O"
    ) {
        console.log("O WON");
        gameStore.winner = "O WON!";
        timer.stopTimer();
    }

    if (
        gameStore.gameInstance.winColumn() === "TIE" ||
        gameStore.gameInstance.winRow() === "TIE" ||
        gameStore.gameInstance.winDiagonal() === "TIE"
    ) {
        console.log("ITS A TIE");
        gameStore.winner = "IT'S A TIE!";
        timer.stopTimer();
    }
}

const handleCellClick = (x: number, y: number) => {
    if (!gameStore.gameInstance.tieOrHasWinner) {
        switch (optionsAndModesStore.option) {
            case "Place Piece":
                if (optionsAndModesStore.mode === "Player vs Player" ||
                    (optionsAndModesStore.mode === "Player vs Ai" &&
                        gameStore.gameInstance.currentPlayer === "X")
                ) {
                    gameStore.gameInstance.makeAmove(x, y);
                }
                break;
            case "Move Grid":
                if (optionsAndModesStore.mode === "Player vs Player" ||
                    (optionsAndModesStore.mode === "Player vs Ai" &&
                        gameStore.gameInstance.currentPlayer === "X")
                ) {
                    gameStore.gameInstance.moveGrid(x, y);
                }
                break;
            case "Move Piece":
                if (optionsAndModesStore.mode === "Player vs Player" ||
                    (optionsAndModesStore.mode === "Player vs Ai" &&
                        gameStore.gameInstance.currentPlayer === "X")
                ) {
                    if (gameStore.selectedPiece === null) {
                        if (gameStore.gameInstance.board[x][y] === gameStore.gameInstance.currentPlayer) {
                            gameStore.selectedPiece = { x, y };
                        }
                    } else {
                        if (gameStore.gameInstance.board[x][y] === undefined || gameStore.gameInstance.board[x][y] === '&nbsp;') {
                            gameStore.gameInstance.movePiece(gameStore.selectedPiece.x, gameStore.selectedPiece.y, x, y);
                            gameStore.selectedPiece = null;
                        } else {
                            gameStore.selectedPiece = null;
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
    checkGameState();
};

const handleAiMove = () => {
    if (!gameStore.gameInstance.tieOrHasWinner) {
        if (optionsAndModesStore.mode === "Ai vs Ai" ||
            (optionsAndModesStore.mode === "Player vs Ai" &&
                gameStore.gameInstance.currentPlayer === "O")) {
            gameStore.gameInstance.aiAction();
        }
    }
    checkGameState();
}
</script>

<template>
    <div v-if="store.username.length > 0" class="page-content">
        <div class="main-game-container">
            <div v-if="optionsAndModesStore.mode" class="gif-column left-gifs">
                <img src="../../assets/gifs/subway_surfers.gif" alt="subway surfers gif" class="gif-img">
                <img src="../../assets/gifs/oiia.gif" alt="spinning cat gif" class="gif-img">
            </div>
            <div class="game-content">
                <div v-if="!optionsAndModesStore.mode" class="mode-selection">
                    <div class="modes-container">
                        <span class="thing-text gradient-pulse-text">
                            Select Game Mode
                        </span>
                        <button class="modeBtn" @click="optionsAndModesStore.setModePvP()">Player vs Player</button>
                        <button class="modeBtn" @click="optionsAndModesStore.setModePlvsAi()">Player vs Ai</button>
                        <button class="modeBtn" @click="optionsAndModesStore.setModeAivsAi()">Ai vs Ai</button>
                    </div>
                    <div class="gif-container">
                        <img src="../../assets/gifs/game_modes_select.gif" alt="mode select" class="gif-img">
                    </div>
                </div>
                <div v-else>
                    <div v-if="!gameStore.gameInstance.tieOrHasWinner">
                        {{ timer.startTimer() }}
                        <div class="thing-text">
                            Next move by - {{ gameStore.gameInstance.currentPlayer }}
                        </div>
                        <div class="thing-text">
                            Mode - {{ optionsAndModesStore.mode }}
                        </div>
                        <div class="options-container">
                            <div class="thing-text">
                                Option - {{ optionsAndModesStore.option }}
                            </div>
                            <div v-if="gameStore.gameInstance.piecesPlaced >= 4 &&
                                (optionsAndModesStore.mode === 'Player vs Player' ||
                                    optionsAndModesStore.mode === 'Player vs Ai')">
                                <!-- Show buttons only if player have pieces left -->
                                <button v-if="gameStore.gameInstance.amountOfPiecesX > 0 &&
                                    gameStore.gameInstance.currentPlayer === 'X'"
                                    class="gameBtn"
                                    @click="optionsAndModesStore.setOptionPlacePiece(), gameStore.selectedPiece = null">
                                    Place Piece
                                </button>
                                <button v-if="gameStore.gameInstance.amountOfPiecesO > 0 &&
                                    gameStore.gameInstance.currentPlayer === 'O'"
                                    class="gameBtn"
                                    @click="optionsAndModesStore.setOptionPlacePiece(), gameStore.selectedPiece = null">
                                    Place Piece
                                </button>
                                <!-- Show only if move grid is available (evety 2 turns) -->
                                <button v-if="gameStore.gameInstance.turnsToMoveGrid === 0" class="gameBtn"
                                    @click="optionsAndModesStore.setOptionMoveGrid(), gameStore.selectedPiece = null">
                                    Move Grid
                                </button>
                                <button class="gameBtn" @click="optionsAndModesStore.setOptionMovePiece(), gameStore.selectedPiece = null">
                                    Move Piece
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="optionsAndModesStore.mode === 'Player vs Ai' ||
                        optionsAndModesStore.mode === 'Ai vs Ai'">
                        <div class="thing-text">
                            AI Move
                        </div>
                        <button class="gameBtn" @click="handleAiMove()">
                            AI Move
                        </button>
                    </div>
                    <div class="thing-text">
                        Time: {{ timer.formattedTime() }}
                    </div>
                    <div class="reset-buttons-container">
                        <button class="resetBtn" @click="
                            gameStore.resetGame(),
                            timer.resetTimer(),
                            timer.startTimer(),
                            optionsAndModesStore.setOptionPlacePiece()">
                            RESET GAME
                        </button>
                        <button class="resetBtn" @click="
                            gameStore.resetGame(),
                            timer.resetTimer(),
                            timer.stopTimer(),
                            optionsAndModesStore.setOptionPlacePiece(),
                            optionsAndModesStore.resetMode()">
                            RESET MODE
                        </button>
                    </div>
                    <GameBoard :game-instance="gameStore.gameInstance" :selected-piece="gameStore.selectedPiece"
                        @cell-click="handleCellClick" />
                </div>
            </div>
            <div v-if="optionsAndModesStore.mode" class="gif-column right-gifs">
                <img src="../../assets/gifs/soap_cutting.gif" alt="soap cutting gif" class="gif-img">
                <img src="../../assets/gifs/amogus_dance.gif" alt="amogus dancing gif" class="gif-img">
            </div>
        </div>
    </div>
    <div v-else>
        <Login />
    </div>
</template>