const express = require('express');
const app = express.Router();
const {
    MongoClient,
    ObjectId
} = require('mongodb');

const dbName = "courseProject";
const Game = require('../classes/Game')

const url = "mongodb+srv://admin:admin@cluster0.t4a9d.mongodb.net/$courseProject?retryWrites=true&w=majority";

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', async (req, res) => {
    try {
        await client.connect()
        const colli = client.db(dbName).collection('games')
        const clngs = await colli.find({}).toArray()

        res.status(200).json(clngs)
    } catch (error) {

        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})

app.post('/', async (req, res, next) => {
    try {
        //Check if there is someting in the object posted
        if (!req.body.userId || !req.body.gameId || !req.body.gameImg || !req.body.gameRelease) return res.status(400).send('Information not found')

        const db = client.db(dbName);
        const col = db.collection("games");

        await client.connect();

        let game = await new Game(req.body.userId, req.body.gameId, req.body.gameImg, req.body.gameName, req.body.gameRelease)

        res.status(200).send('succesfully uploaded')

        const p = await col.insertOne(game);

    } catch (err) {

    } finally {
        await client.close();
    }
})

app.get('/:id', async (req, res) => {
    try {
        await client.connect()
        const db = client.db(dbName);
        const col = db.collection("games");

        const query = {
            _id: ObjectId(req.params.id)
        }

        const clngs = await col.findOne(query)

        res.status(200).json(clngs)
    } catch (error) {
        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})

app.get('/bookmarks/:id', async (req, res) => {
    try {
        await client.connect()
        const db = client.db(dbName);
        const col = db.collection("games");

        const query = {
            userId: req.params.id
        }
        console.log(query)

        const clngs = await col.find(query).toArray()

        res.status(200).json(clngs)
    } catch (error) {
        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})


app.delete('/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("games");

        const query = {
            _id: ObjectId(req.params.id)
        }
        const userDelete = await col.deleteOne(query)
        res.status(200).send(userDelete);
    } catch (error) {

        res.status(500).send({
            error: 'error',
            value: error.stack
        });
    }
})


module.exports = app;