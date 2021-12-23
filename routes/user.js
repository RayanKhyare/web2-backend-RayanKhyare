const express = require('express');
const app = express.Router();
const {
    MongoClient,
    ObjectId
} = require('mongodb');

const bcrypt = require('bcryptjs');

const dbName = "courseProject";
const User = require('../classes/User')

const url = "mongodb+srv://admin:admin@cluster0.t4a9d.mongodb.net/$courseProject?retryWrites=true&w=majority";

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.get('/', async (req, res) => {
    try {
        await client.connect()
        const colli = client.db(dbName).collection('users')
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
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) return res.status(400).send('Information not found')

        const db = client.db(dbName);
        const col = db.collection("users");

        await client.connect();

        let user = await new User(req.body.firstname, req.body.lastname, req.body.email)
        await user.hashPassword(req.body.password);

        res.status(200).send('succesfully uploaded')

        const p = await col.insertOne(user);

    } catch (err) {

    } finally {
        await client.close();
    }
})

app.get('/:id', async (req, res) => {
    try {
        await client.connect()
        const db = client.db(dbName);
        const col = db.collection("users");

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

app.post("/login", async (req, res) => {
    try {
        const db = client.db(dbName);
        const col = db.collection("users");

        await client.connect();

        const query = {
            email: req.body.email
        }

        const myDoc = await col.findOne(query)
        if (myDoc == null) return res.status(404).send("Nothing found") //guard clause

        const user = new User(myDoc.firstname, myDoc.lastname, myDoc.email, myDoc.password)

        let passwordCheck = await user.unHashPassword(req.body.password)
        if (passwordCheck == false) return res.status(400).send("False password")


        res.status(200).send(myDoc)

    } catch (err) {

    } finally {
        await client.close();
    }
})


app.delete('/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("users");

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

app.put('/:id', async (req, res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) return res.status(400).send('Information not found')

    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("users");

        const query = {
            _id: ObjectId(req.params.id)
        };

        let update = {
            $set: {
                email: req.body.email,
                password: req.body.password
            }
        };

        const updateChallenge = await col.updateOne(query, update)

        if (updateChallenge) {
            res.status(201).send({
                succes: `Challenge ${req.body._id} is successfully updated.`,
            });
            return;
        } else {
            res.status(400).send({
                error: `Challenge "${req.body._id}" isn't found.`,
                value: error,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
});

module.exports = app;