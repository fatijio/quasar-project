<template>
    <div>
        <q-splitter v-model="splitterModel" horizontal style="height:700px">

            <template v-slot:before>
                <div class="q-pa-md">
                    <div class="q-my-md" v-if:messages="messages.length > 0">
                        <q-list bordered separator>
                            <q-item clickable v-ripple v-for="message in messages">
                                <q-item-section @click="getOneMessage(message.id)">
                                    <q-item-label>{{ message.title }}</q-item-label>
                                </q-item-section>
                                <q-item-section top side>
                                    <div class="text-grey-8 q-gutter-xs">
                                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete"
                                            @click="removeMessage(message.id)" />
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div class="q-my-md" v-else>
                        <h5>Пусто</h5>
                    </div>
                </div>
            </template>

            <template v-slot:separator>
                <q-avatar square color="white" text-color="grey" size="40px" icon="more_horiz" />
            </template>

            <template v-slot:after>
                <div class="q-pa-md">
                    <div class="q-my-md">
                        <q-card class="my-card" flat bordered v-if:detail="detail">
                            <q-card-section horizontal>
                                <q-card-section class="q-pt-xs">
                                    <div class="text-h5 q-mt-sm q-mb-xs">{{ detail.title }}</div>
                                    <div class="text-caption text-grey">
                                        {{ detail.fulltext }}
                                    </div>
                                </q-card-section>

                            </q-card-section>

                            <q-separator />

                            <q-card-actions>
                                <q-btn flat round icon="event" />
                                <q-btn flat>
                                    {{ detail.createdAt }}
                                </q-btn>
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>
            </template>
        </q-splitter>

    </div>

</template>

<script>
import { computed, ref } from 'vue'
import { useMessageStore } from 'src/stores/message-store'
import { date } from 'quasar'

export default {
    name: 'MessagesList',
    props: {
        messages: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            detail: ''
        }
    },
    methods: {
        getOneMessage(id) {
            //console.log('id msg', id);
            this.detail = this.getMessageContent(id);
            this.detail.createdAt = date.formatDate(this.detail.createdAt, 'DD-MM-YYYY HH:mm:ss');
            //this.getDataFormat();
            //console.log(this.getMessageContent(id));
            //console.log('111');
        }
    },
    computed: {
        /*getOneMessage(id) {
            this.detail = this.getMessageContent(id);
            this.detail.createdAt = date.formatDate(this.detail.createdAt, 'DD-MM-YYYY HH:mm:ss');
        },
        getDataFormat() {
            //return this.detail.createdAt = date.formatDate(this.detail.createdAt, 'DD-MM-YYYY HH:mm:ss');
            //console.log('222');
        }*/
    },
    setup() {
        const messages = useMessageStore();

        return {
            splitterModel: ref(50),
            getMessageContent: computed(() => messages.getMessageContentAPI),
            removeMessage: computed(() => messages.removeMessageAPI)
        }
    }
}
</script>

<style>

</style>