<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { createTask, type CreateTaskData } from '../api/tasks'

const router = useRouter()
const message = useMessage()

const formData = ref<CreateTaskData>({
    title: '',
})

const loading = ref(false)
const formRef = ref()

const rules = {
    title: {
        required: true,
        message: 'Введите название задачи',
        trigger: ['input', 'blur'],
    },
}

const handleSubmit = async () => {
    try {
        await formRef.value?.validate()
        loading.value = true

        const newTask = await createTask(formData.value)
        message.success('Задача создана успешно')
        router.push(`/tasks/${newTask.id}`)
    } catch (error: any) {
        if (error?.length) {
            // Validation error
            return
        }
        console.error('Failed to create task:', error)
        message.error('Ошибка создания задачи')
    } finally {
        loading.value = false
    }
}

const goBack = () => {
    router.push('/tasks')
}
</script>

<template>
    <div>
        <n-card title="Создание задачи">
            <template #header-extra>
                <n-button @click="goBack">← Назад</n-button>
            </template>

            <n-form ref="formRef" :model="formData" :rules="rules" layout="vertical" size="large">
                <n-form-item label="Название задачи" path="title">
                    <n-input
                        v-model:value="formData.title"
                        placeholder="Введите название задачи"
                        :disabled="loading"
                    />
                </n-form-item>

                <n-space>
                    <n-button type="primary" :loading="loading" @click="handleSubmit">
                        Создать задачу
                    </n-button>
                    <n-button @click="goBack" :disabled="loading">Отмена</n-button>
                </n-space>
            </n-form>
        </n-card>
    </div>
</template>
