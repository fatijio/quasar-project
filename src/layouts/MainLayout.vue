<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          TurbAMail
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div>
      <q-splitter v-model="splitterModel2" unit="px" style="height: 100vh" :limits="[250, 350]">
        <template v-slot:before>
          <q-drawer v-model="leftDrawerOpen" side="left" class="bg-grey-3 wdts" bordered :width="0">
            <q-item class="GNL__drawer-item" v-ripple v-for="link in leftMenuLinks" :key="link.text" clickable
              @click="chooseFolder(link.type)">
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}
                  <CountMsg :linktype="link.type" />
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-drawer>
        </template>

        <template v-slot:separator>
          <q-avatar square class="divider-vert" text-color="grey" size="40px" icon="more_vert" />
        </template>

        <template v-slot:after>
          <q-page-container>
            <q-page padding>

              <MessagesList :messages="filteredList" />


            </q-page>

          </q-page-container>
        </template>
      </q-splitter>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="edit_note" color="primary" @click="showForm = true" />
      </q-page-sticky>
    </div>
    <q-dialog v-model="showForm" persistent>
      <q-card class="q-pa-md" style="width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Создать сообщение</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>


        <div class="q-pa-md">
          <div class="q-gutter-md">
            <q-input outlined v-model="formtitle" label="Заголовок" filled />
            <q-input outlined v-model="formtext" label="Сообщение" type="textarea" />
          </div>
        </div>

        <q-card-actions align="right">
          <q-btn label="Сохранить" color="primary" @click="sendMessageToDraft" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>
            <q-btn-group>
              <q-btn color="secondary" glossy label="Получить" @click="sentMessages('sended')" />
              <q-btn color="secondary" glossy label="Отправить" @click="sentMessages('draft')" />
            </q-btn-group>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { defineComponent, onMounted, computed, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import MessagesList from 'components/MessagesList.vue'
import CountMsg from 'components/CountMsg.vue'
import { useQuasar } from 'quasar'
//import DialogForm from 'components/DialogForm.vue'
import { useMessageStore } from 'src/stores/message-store'

const leftMenuLinks = [
  { icon: 'archive', text: 'Входящие', type: 'inbox' },
  { icon: 'schedule_send', text: 'Черновики', type: 'draft' },
  { icon: 'unarchive', text: 'Отправленные', type: 'sended' },
];

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink,
    MessagesList,
    CountMsg,
    //DialogForm
  },
  data() {
    return {
      formtitle: '',
      formtext: '',
      folder: 'inbox',
      /*messages: [
        { id: 1, title: 'test1', fulltext: 'подробное описание 1', folder: 'inbox' },
        { id: 2, title: 'test2', fulltext: 'подробное описание 2', folder: 'inbox' },
        { id: 3, title: 'test3', fulltext: 'подробное описание 3', folder: 'draft' },
        { id: 4, title: 'test4', fulltext: 'подробное описание 4', folder: 'sended' },
      ]*/
    }
  },
  watch: {
    error() {
      this.showNotif(this.error);
      //console.log('erorororroror');
    }
  },
  methods: {
    addLikes() {
      this.likes += 1;
    },
    chooseFolder(type) {
      this.folder = type;
    },
    sendMessageToDraft() {
      //console.log('this.formtitle', this.formtitle);
      if (this.formtitle.length === '' || this.formtitle.length === 0) {
        this.showNotif('Заполните поле заголовок');
        return;
      }
      this.createMessage(this.formtitle, this.formtext);
      this.showForm = false;
    }
  },
  computed: {
    filteredList() {
      let fold = this.folder;
      return this.messages.filter(function (elem) {
        if (fold === '') return true;
        else return elem.folder.indexOf(fold) > -1;
      })
    }
  },
  setup() {
    const leftDrawerOpen = ref(true);
    const messages = useMessageStore();
    const inputRef = ref(null);
    const $q = useQuasar();

    onMounted(() => {
      messages.getMessagesAPI();
    });

    //messages.createMessage();

    return {
      leftDrawerOpen,
      splitterModel2: ref(299, 100),
      inputRef,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      showNotif(messageError) {
        $q.notify({
          type: 'warning',
          message: messageError,
          //color: 'purple'
        })
      },
      leftMenuLinks,
      showForm: ref(false),
      messages: computed(() => messages.messages),
      error: computed(() => messages.error),
      //messageCounter: computed(() => messages.getMessageCount),
      createMessage: computed(() => messages.createMessageAPI),
      sentMessages: computed(() => messages.sentMessages),
    }
  },

})
</script>

<style>
aside {
  width: 100% !important;
}

.divider-vert {
  border-radius: 10px;
  margin-left: -1px;
}
</style>