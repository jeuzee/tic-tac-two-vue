import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Game from '../components/Game.vue'
import GameOver from '../components/GameOver.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/game',
        name: 'Game',
        component: Game,
    },
    {
        path: '/gameOver',
        name: 'GameOver',
        component: GameOver,
        props: true,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router;