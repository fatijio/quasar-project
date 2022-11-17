<template>
    <q-dialog v-modal="show">
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Создать сообщение</div>
            </q-card-section>

            <div class="q-pa-md">
                <div class="q-gutter-md">
                    <q-input outlined v-model="text" label="Заголовок" />
                    <q-input outlined v-model="text" label="Сообщение" type="textarea" />
                </div>
            </div>

            <q-card-actions align="right">
                <q-btn label="Сохранить" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from 'vue'

export default {
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    setup() {
        return {
            show: ref(false),
        }
    }

}
</script>

<style>

</style>

