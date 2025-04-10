<script setup lang="ts">
import { useUserDataStore } from '@/stores/userDataStore';
import Login from './Login.vue';

const store = useUserDataStore();


</script>

<template>
    <div class="page-content">
        <div v-if="store.username.length > 0" class="welcome-content">
            Welcome {{ store.username }}!<br>
            PLAY GAME. <br />
            <div class="gif-container">
                <img src="../../assets/gifs/shrek.gif" alt="shrek gif" class="gif-img">
            </div>
        </div>
        <div v-else>
            <Login />
        </div>
    </div>
</template>