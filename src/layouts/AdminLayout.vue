<script setup lang="ts">
import { NLayout, NLayoutSider, NLayoutContent, NLayoutHeader } from 'naive-ui'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
</script>

<template>
    <n-layout style="height: 100vh">
        <n-layout-header style="height: 64px">
            <Header />
        </n-layout-header>
        <n-layout has-sider style="height: calc(100vh - 64px)">
            <n-layout-sider content-style="padding: 24px;">
                <Sidebar />
            </n-layout-sider>
            <n-layout-content content-style="padding: 24px;">
                <router-view />
            </n-layout-content>
        </n-layout>
    </n-layout>
</template>
