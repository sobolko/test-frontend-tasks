<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NButton, NSpace, NBadge, NSelect, useMessage } from 'naive-ui'
import { getTaskById, updateTaskStatus, type Task } from '../api/tasks'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const taskId = Number(route.params.id)

const task = ref<Task | null>(null)
const loading = ref(false)
const updating = ref(false)

const statusOptions = [
    { label: 'Новая', value: 'new' },
    { label: 'В работе', value: 'in_progress' },
    { label: 'Завершена', value: 'completed' },
]

const statusColors = {
    new: 'info',
    in_progress: 'warning',
    completed: 'success',
} as const

const fetchTask = async () => {
    loading.value = true
    try {
        task.value = await getTaskById(taskId)
    } catch (error) {
        console.error('Failed to fetch task:', error)
        message.error('Ошибка загрузки задачи')
    } finally {
        loading.value = false
    }
}

const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task.value) return

    updating.value = true
    try {
        const updatedTask = await updateTaskStatus(task.value.id, newStatus)
        task.value = updatedTask
        message.success('Статус задачи обновлен')
    } catch (error) {
        console.error('Failed to update task status:', error)
        message.error('Ошибка обновления статуса')
    } finally {
        updating.value = false
    }
}

const goBack = () => {
    router.push('/tasks')
}

onMounted(fetchTask)
</script>

<template>
    <div v-if="task">
        <n-card>
            <template #header>
                <n-space align="center">
                    <span>Задача #{{ task.id }}</span>
                    <n-badge :type="statusColors[task.status]" :text="task.status_label" />
                </n-space>
            </template>

            <template #header-extra>
                <n-button @click="goBack">← Назад</n-button>
            </template>

            <n-space vertical size="large">
                <div>
                    <h3>{{ task.title }}</h3>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 500">
                        Статус:
                    </label>
                    <n-select
                        :value="task.status"
                        :options="statusOptions"
                        :loading="updating"
                        style="width: 200px"
                        @update:value="handleStatusChange"
                    />
                </div>

                <div>
                    <p>
                        <strong>Создана:</strong>
                        {{ new Date(task.created_at).toLocaleString() }}
                    </p>
                    <p>
                        <strong>Обновлена:</strong>
                        {{ new Date(task.updated_at).toLocaleString() }}
                    </p>
                    <p>
                        <strong>Пользователь:</strong>
                        {{ task.user_name }}
                    </p>
                </div>
            </n-space>
        </n-card>
    </div>

    <div v-else-if="loading">
        <n-card>Loading...</n-card>
    </div>

    <div v-else>
        <n-card>Task not found</n-card>
    </div>
</template>
