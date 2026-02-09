import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { darkTheme } from 'naive-ui'

const THEME_KEY = 'ui-theme'

export const useUiStore = defineStore('ui', () => {
    const isDark = ref(localStorage.getItem(THEME_KEY) === 'dark')

    const theme = computed(() => (isDark.value ? darkTheme : null))

    watch(isDark, (value) => {
        localStorage.setItem(THEME_KEY, value ? 'dark' : 'light')
    })

    function toggleTheme() {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        theme,
        toggleTheme,
    }
})
