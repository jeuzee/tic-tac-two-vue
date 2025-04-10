import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserDataStore = defineStore('userData', () => {
	const username = ref('');
	const password = ref('');
	return { username, password };
})
