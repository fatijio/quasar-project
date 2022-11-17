import { defineStore } from 'pinia';
import axios from "axios"

export const useMessageStore = defineStore({
    id: 'message',
    state: () => {
        return {
            messages: [],
            status: '',
            loading: false,
            error: ''
        }
    },
    getters: {
        getMessages(state) {
            return state.messages
        },
        getMessageCount(state) {
            return (type) => state.messages.filter((item) => {
                return item.folder === type;
            }).length;
        },
        getFilteredMessages(state) {
            let fold = this.folder;
            return this.messages.filter(function (elem) {
                if (fold === '') return true;
                else return elem.folder.indexOf(fold) > -1;
            })
        },
        getMessageContentAPI(state) {
            return (id) => {
                let detailMsg = this.messages.find(msg => msg.id === id);
                //console.log('Id', id);
                //console.log('Id', detailMsg.fulltext);
                return { ...detailMsg };
            }
        }
    },
    actions: {
        async getMessagesAPI() {
            try {
                const data = await axios.get('http://localhost:3000/api/messages');
                this.messages = data.data;
                //console.log('msg', data.data);
            }
            catch (error) {
                this.error = error;
                console.log(error);
            }
        },
        async createMessageAPI(titleMessage, textMessage) {
            //console.log('create');
            /*setTimeout(() => {
                this.messages.push({
                    "id": Date.now(),
                    "title": "Денис Золотухин",
                    "fulltext": "Техническое задание",
                    "folder": "draft",
                    "status": "receive",
                    "email": null,
                    "createdAt": "2022-11-16T01:34:48.000Z",
                    "updatedAt": "2022-11-16T01:34:48.000Z"
                })
            }, 1500);*/
            try {
                const data = await axios.post('http://localhost:3000/api/messages', {
                    title: titleMessage,
                    fulltext: textMessage,
                    folder: 'draft',
                });
                this.messages.push(data.data);
                //console.log('create message', data.data);
            }
            catch (error) {
                this.error = error;
                //console.log(error);
            }
        },
        async sentMessages(typeMessagesToSent) {
            //console.log('sent drafts');
            let typeSettings = {
                oldType: '',
                newType: ''
            }

            if (typeMessagesToSent === 'draft') {
                typeSettings.oldType = 'draft';
                typeSettings.newType = 'sended';
            }

            if (typeMessagesToSent === 'sended') {
                typeSettings.oldType = 'sended';
                typeSettings.newType = 'inbox';
            }

            let aMessageDraft = this.messages.filter((item) => {
                //return item.folder === 'draft'
                return item.folder === typeSettings.oldType;
            });
            if (aMessageDraft.length > 0) {
                try {
                    const data = await axios.post('http://localhost:3000/api/sent', { aMessages: aMessageDraft, settings: typeSettings });
                    if (data.status === 200) {
                        //console.log('aMessageDraft', aMessageDraft.length);
                        for (let i = 0; i < aMessageDraft.length; i++) {
                            this.messages.find((msg) => {
                                //console.log('msg 1', msg.id);
                                //console.log('msg 2', aMessageDraft[i].id);
                                if (msg.id === aMessageDraft[i].id) {
                                    //console.log('msg.folder 3', msg.folder);
                                    //msg.folder = 'sended';
                                    msg.folder = typeSettings.newType;
                                }
                            });
                            //console.log('aMessageDraft', aMessageDraft[i]);
                        }
                        //aMessageDraft.forEach((msg) => {
                        //if (msg.id === aMessageDraft.id)
                        //});
                    }
                    //console.log('data receive', data);
                } catch (error) {
                    this.error = error;
                    //console.log('error sent drafts', error);
                }
            } else {
                this.error = 'Нечего отправлять'
            }
            //console.log('drafts', aMessageDraft);
        },
        async removeMessageAPI(idMessage) {
            //console.log('Id', idMessage);
            try {
                const data = await axios.delete(`http://localhost:3000/api/messages/${idMessage}`);
                if (data.status === 200) {
                    const id = data.data.id;
                    this.messages = this.messages.filter((msg) => msg.id != id);
                    //console.log('success data', data.data);
                }
            } catch (error) {
                this.error = error;
                console.log('error', error);
            }
        }
    },
});