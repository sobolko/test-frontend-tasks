<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'
import { themeOverrides } from '@/styles/naive/theme'
import { useUiStore } from '@/stores/ui/ui.store'

const ui = useUiStore()
</script>

<template>
    <n-config-provider :theme="ui.theme" :theme-overrides="themeOverrides">
        <n-message-provider>
            <n-notification-provider>
                <n-dialog-provider>
                    <router-view />
                </n-dialog-provider>
            </n-notification-provider>
        </n-message-provider>
    </n-config-provider>
</template>
