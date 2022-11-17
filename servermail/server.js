const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const cors = require('cors');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));

// === Получить все сообщения ===
app.get('/api/messages', (req, res) => {
    return db.Message.findAll()
        .then((messages) => res.send(messages))
        .catch((error) => {
            console.log('Ошибка получения сообщений', JSON.stringify(error))
            return res.send(error)
        });
});

// === Создание сообщение ===
app.post('/api/messages', (req, res) => {
    const { title, fulltext, folder } = req.body
    //console.log('title, text, folder', title, fulltext, folder);
    if (title === '' || title.length === 0) {
        return res.status(400).send('Пустой заголовок')
    }
    return db.Message.create({ title, fulltext, folder })
        .then((message) => res.send(message))
        .catch((error) => {
            console.log('Ошибка создания сообщения', JSON.stringify(error))
            return res.status(400).send(error)
        })
});

// === Обновление папки(поля) у сообщений ===
app.post('/api/sent', (req, res) => {
    const { aMessages, settings } = req.body
    //console.log('srv data aMessages', aMessages);
    //console.log('srv data settings', settings);
    let listMessages = aMessages.map(msg => msg.id)
    //console.log('array', listMessages)
    return db.Message.update({ folder: settings.newType }, { where: { id: { [Op.in]: listMessages } } })
        .then((ids) => res.send(ids))
        .catch((error) => {
            console.log('Не удалось отправить сообщения', JSON.stringify(error))
            res.status(400).send({ error: 'Не удалось отправить сообщения' })
        })
});

// === Удаление сообщения ===
app.delete('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log('id', id);
    return db.Message.findByPk(id)
        .then((message) => message.destroy({ force: true }))
        .then(() => res.send({ id }))
        .catch((error) => {
            console.log('Ошибка удаления сообщения', JSON.stringify(error))
            res.status(400).send('sadsad')
        })
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
}); 