<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    NCard,
    NStatistic,
    NGrid,
    NGridItem,
    NSelect,
    NSpace,
    NProgress,
    useMessage,
} from 'naive-ui'
import { getTaskStats, getUsers, type TaskStats, type User } from '../api/statistics'
import { useAuthStore } from '@/stores/auth/auth.store'

const auth = useAuthStore()
const message = useMessage()
const stats = ref<TaskStats | null>(null)
const users = ref<User[]>([])
const loading = ref(false)
const selectedUserId = ref<number | undefined>(undefined)

const fetchStats = async (userId?: number) => {
    loading.value = true
    try {
        stats.value = await getTaskStats(userId)
    } catch (error) {
        console.error('Failed to fetch statistics:', error)
        message.error('Ошибка загрузки статистики')
    } finally {
        loading.value = false
    }
}

const fetchUsers = async () => {
    if (!auth.isAdmin) return
    try {
        users.value = await getUsers()
    } catch (error) {
        console.error('Failed to fetch users:', error)
    }
}

const handleUserFilterChange = (userId: number | undefined) => {
    selectedUserId.value = userId
    fetchStats(userId)
}

const getPercentage = (value: number) => {
    if (!stats.value || stats.value.total === 0) return 0
    return Math.round((value / stats.value.total) * 100)
}

onMounted(async () => {
    await fetchStats()
    if (auth.isAdmin) {
        await fetchUsers()
    }
})
</script>

<template>
    <div>
        <n-space vertical size="large">
            <!-- Фильтр для админов -->
            <n-card v-if="auth.isAdmin" title="Фильтры">
                <n-select
                    v-model:value="selectedUserId"
                    :options="[
                        { label: 'Все пользователи', value: undefined },
                        ...users.map((user) => ({
                            label: `${user.name} (${user.email})${user.roles.includes('admin') ? ' - Админ' : ''}`,
                            value: user.id,
                        })),
                    ]"
                    placeholder="Фильтр по пользователю"
                    clearable
                    style="width: 350px"
                    @update:value="handleUserFilterChange"
                />
            </n-card>

            <!-- Основная статистика -->
            <n-grid cols="1 s:2 m:4" responsive="screen" :x-gap="16">
                <n-grid-item>
                    <n-card title="Всего задач">
                        <n-statistic :value="stats?.total || 0" :loading="loading" />
                    </n-card>
                </n-grid-item>

                <n-grid-item>
                    <n-card title="Новые">
                        <n-statistic
                            :value="stats?.by_status.new || 0"
                            :loading="loading"
                            value-style="color: #2080f0"
                        />
                    </n-card>
                </n-grid-item>

                <n-grid-item>
                    <n-card title="В работе">
                        <n-statistic
                            :value="stats?.by_status.in_progress || 0"
                            :loading="loading"
                            value-style="color: #f0a020"
                        />
                    </n-card>
                </n-grid-item>

                <n-grid-item>
                    <n-card title="Завершенные">
                        <n-statistic
                            :value="stats?.by_status.completed || 0"
                            :loading="loading"
                            value-style="color: #18a058"
                        />
                    </n-card>
                </n-grid-item>
            </n-grid>

            <!-- Распределение по статусам -->
            <n-card title="Распределение по статусам" v-if="stats && stats.total > 0">
                <n-space vertical size="medium">
                    <div>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 8px;
                            "
                        >
                            <span>Новые</span>
                            <span>
                                {{ stats.by_status.new }} ({{
                                    getPercentage(stats.by_status.new)
                                }}%)
                            </span>
                        </div>
                        <n-progress
                            type="line"
                            :percentage="getPercentage(stats.by_status.new)"
                            color="#2080f0"
                            :show-indicator="false"
                        />
                    </div>

                    <div>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 8px;
                            "
                        >
                            <span>В работе</span>
                            <span>
                                {{ stats.by_status.in_progress }} ({{
                                    getPercentage(stats.by_status.in_progress)
                                }}%)
                            </span>
                        </div>
                        <n-progress
                            type="line"
                            :percentage="getPercentage(stats.by_status.in_progress)"
                            color="#f0a020"
                            :show-indicator="false"
                        />
                    </div>

                    <div>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 8px;
                            "
                        >
                            <span>Завершенные</span>
                            <span>
                                {{ stats.by_status.completed }} ({{
                                    getPercentage(stats.by_status.completed)
                                }}%)
                            </span>
                        </div>
                        <n-progress
                            type="line"
                            :percentage="getPercentage(stats.by_status.completed)"
                            color="#18a058"
                            :show-indicator="false"
                        />
                    </div>
                </n-space>
            </n-card>

            <!-- Пустое состояние -->
            <n-card v-if="stats && stats.total === 0" title="Нет данных">
                <div style="text-align: center; padding: 40px 0; color: #999">Задач не найдено</div>
            </n-card>
        </n-space>
    </div>
</template>
