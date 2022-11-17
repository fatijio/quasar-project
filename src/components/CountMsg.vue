<template>
    ({{ messageCounter(linktype) }})
</template>

<script>
import { computed } from 'vue'
import { useMessageStore } from 'src/stores/message-store'

//console.log(linktype);

export default {
    props: {
        linktype: {
            type: String,
            required: true
        }
    },

    setup() {
        const messages = useMessageStore();

        return {
            messageCounter: computed(() => messages.getMessageCount)
        }
    }
}
</script>

<style>

</style>