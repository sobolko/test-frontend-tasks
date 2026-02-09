<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NDataTable, NTag, NButton, NSpace, NSpin } from 'naive-ui'
import { getTasks, type Task, type TasksResponse } from '../api/tasks'
import { useAuthStore } from '@/stores/auth/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const tasks = ref<Task[]>([])
const loading = ref(false)

const pagination = ref({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    showQuickJumper: true,
    prefix: ({ itemCount }: any) => `Всего ${itemCount} записей`,
})

const sortState = ref<{
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}>({})

const statusColors = {
    new: 'info',
    in_progress: 'warning',
    completed: 'success',
} as const

const columns = [
    {
        title: 'ID',
        key: 'id',
        width: 80,
        sorter: true,
    },
    {
        title: 'Название',
        key: 'title',
        sorter: true,
    },
    {
        title: 'Пользователь',
        key: 'user_name',
        sorter: true,
    },
    {
        title: 'Статус',
        key: 'status',
        sorter: true,
        render: (row: Task) => {
            return h(
                NTag,
                {
                    type: statusColors[row.status] || 'default',
                    size: 'small',
                },
                { default: () => row.status_label || row.status }
            )
        },
    },
    {
        title: 'Создана',
        key: 'created_at',
        sorter: true,
        render: (row: Task) => new Date(row.created_at).toLocaleDateString(),
    },
    {
        title: 'Действия',
        key: 'actions',
        render: (row: Task) => {
            return h(
                NButton,
                {
                    size: 'small',
                    type: 'primary',
                    onClick: () => goToTask(row.id),
                },
                { default: () => 'Открыть' }
            )
        },
    },
]

const fetchTasks = async (page = 1, pageSize = 10, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    console.log('Fetching tasks with params:', { page, pageSize, sortBy, sortOrder })
    loading.value = true
    try {
        const response: TasksResponse = await getTasks(page, pageSize, sortBy, sortOrder)
        tasks.value = response.data
        pagination.value.page = response.meta.current_page
        pagination.value.pageSize = response.meta.per_page
        pagination.value.itemCount = response.meta.total
    } catch (error) {
        console.error('Failed to fetch tasks:', error)
    } finally {
        loading.value = false
    }
}

const handlePageChange = (page: number) => {
    fetchTasks(page, pagination.value.pageSize, sortState.value.sortBy, sortState.value.sortOrder)
}

const handlePageSizeChange = (pageSize: number) => {
    fetchTasks(1, pageSize, sortState.value.sortBy, sortState.value.sortOrder)
}

const handleSorterChange = (sorter: any) => {
    console.log('Sorter changed:', sorter)

    if (!sorter || !sorter.columnKey) {
        sortState.value = {}
        fetchTasks(pagination.value.page, pagination.value.pageSize)
        return
    }

    const sortBy = sorter.columnKey
    const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc'

    console.log('Sorting by:', sortBy, sortOrder)
    sortState.value = { sortBy, sortOrder }
    fetchTasks(1, pagination.value.pageSize, sortBy, sortOrder)
}

const goToTask = (id: number) => {
    router.push(`/tasks/${id}`)
}

const handleCreate = () => {
    router.push('/tasks/create')
}

onMounted(() => fetchTasks())
</script>

<template>
    <div>
        <n-space vertical size="large">
            <!-- Интересный факт о кошках -->
            <n-card v-if="authStore.externalData" title="🐱 Интересный факт о кошках" size="small">
                <div style="font-style: italic; color: #555">
                    {{ authStore.externalData.fact }}
                </div>
                <template #footer>
                    <small style="color: #999">Источник: Cat Facts API</small>
                </template>
            </n-card>

            <!-- Загрузка внешних данных -->
            <n-card
                v-else-if="authStore.externalDataLoading"
                title="🐱 Интересный факт о кошках"
                size="small"
            >
                <n-space align="center">
                    <n-spin size="small" />
                    <span>Загружаем интересный факт...</span>
                </n-space>
            </n-card>

            <!-- Основная таблица задач -->
            <n-card title="Задачи">
                <template #header-extra>
                    <n-button type="primary" @click="handleCreate">Создать задачу</n-button>
                </template>
                <n-data-table
                    :columns="columns"
                    :data="tasks"
                    :loading="loading"
                    :pagination="pagination"
                    :bordered="false"
                    :remote="true"
                    @update:page="handlePageChange"
                    @update:page-size="handlePageSizeChange"
                    @update:sorter="handleSorterChange"
                />
            </n-card>
        </n-space>
    </div>
</template>
