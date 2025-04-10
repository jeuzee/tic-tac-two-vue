<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

import { useUserDataStore } from '../stores/userDataStore';

const store = useUserDataStore();

const username = ref("");
const password = ref("");

const doLogin = () => {
    if (username.value.length >= 3 && password.value.length >= 6) {
        store.username = username.value;
        store.password = password.value;
        router.push('/');
    }
}

</script>

<template>
    <form @submit.prevent="doLogin" class="page-content">
        <div class="gif-container">
            <img src="../../assets/gifs/good_morning.gif" alt="good morning gif" class="gif-img">
        </div>
        <div class="mb-3">
            <label for="usernameInput" class="form-label">Username</label>
            <input v-model="username" type="username" class="form-control" id="usernameInput"
                aria-describedby="usernameHelp" placeholder="Enter your username">
            <div id="usernameHelp" class="form-text">Username length must be 3 or more.</div>
        </div>
        <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="passwordInput"
                aria-describedby="passwordHelp" placeholder="Type your password">
            <div id="passwordHelp" class="form-text">Password length must be 6 or more.</div>
        </div>
        <button type="submit" class="btn btn-primary">Log in</button>
    </form>
</template>
