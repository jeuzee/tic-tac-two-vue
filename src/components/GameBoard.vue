<script setup lang="ts">
import { ref, watch } from 'vue';
import type { GameBrain } from "../bll/gameBrain";

interface Props {
    gameInstance: GameBrain;
    selectedPiece: { x: number, y: number } | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['cellClick']);

const boardState = ref(props.gameInstance.board);

watch(() => props.gameInstance.board, (newBoard) => {
    boardState.value = newBoard; // Force update when board changes
}, { deep: true });


const displayCell = (cell: string) => cell === '&nbsp;' ? ' ' : cell;

const isInGrid = (x: number, y: number) => {
    return x >= props.gameInstance.gridStartX &&
        x <= props.gameInstance.gridEndX &&
        y >= props.gameInstance.gridStartY &&
        y <= props.gameInstance.gridEndY;
};

</script>

<template>
    <div class="game-container">
        <div class="board">
            <div v-for="(row, rowIndex) in boardState" :key="`row-${rowIndex}`" class="row">
                <div v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`" class="cell" :class="{
                    'grid-cell': isInGrid(rowIndex, colIndex),
                    'selected': props.selectedPiece?.x === rowIndex && props.selectedPiece?.y === colIndex
                }" @click="emit('cellClick', rowIndex, colIndex, $event)">
                    {{ displayCell(cell) }}
                </div>
            </div>
        </div>
    </div>
</template>
