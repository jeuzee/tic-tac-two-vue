<script setup lang="ts">
import { onUnmounted } from 'vue';
import GameBoard from './GameBoard.vue';
import { useTimerStore } from '@/stores/timerStore';
import { useGameStore } from '@/stores/gameStore';
import { useOptionsAndModesStore } from '@/stores/optionsAndModesStore';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userDataStore';
import Login from './Login.vue';


const store = useUserDataStore();

const gameStore = useGameStore();
const timer = useTimerStore();
const optionsAndModesStore = useOptionsAndModesStore();
const router = useRouter()

onUnmounted(() => {
    gameStore.isShowingResults = false;
    optionsAndModesStore.setOptionPlacePiece();
    gameStore.resetGame();
})

</script>

<template>
    <div v-if="store.username.length > 0" class="page-content">
        <div v-if="gameStore.gameInstance.tieOrHasWinner" class="main-game-container">
            <div class="gif-column left-gifs">
                <img src="../../assets/gifs/gg.gif" alt="game over gif" class="gif-img">
                <img src="../../assets/gifs/monkey_spin.gif" alt="pixel flames gif" class="gif-img">
            </div>
            <div class="game-content">
                <div class="thing-text gradient-pulse-text">
                    {{ gameStore.winner }}
                </div>
                <div class="thing-text">
                    Mode - {{ optionsAndModesStore.mode }}
                </div>
                <div class="thing-text">
                    Final Time: {{ timer.formattedTime() }}
                </div>
                <div class="reset-buttons-container">
                    <button class="resetBtn" @click="
                        gameStore.resetGame(),
                        timer.resetTimer(),
                        timer.startTimer(),
                        optionsAndModesStore.setOptionPlacePiece(),
                        router.push('/game')">
                        RESTART GAME
                    </button>
                </div>
                <GameBoard :game-instance="gameStore.gameInstance" :selected-piece="null" />
            </div>
            <div class="gif-column right-gifs">
                <img src="../../assets/gifs/spinning-pikachu.gif" alt="soap cutting gif" class="gif-img">
                <img src="../../assets/gifs/pixel_flames.gif" alt="pixel flames gif" class="gif-img">
            </div>
        </div>
    </div>
    <div v-else>
        <Login />
    </div>
</template>