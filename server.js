const {
    MongoClient,
    ObjectId
} = require('mongodb');


const User = require('./User.js')
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const morgan = require('morgan')

const cors = require('cors');
const {
    query
} = require('express');

require('dotenv').config()

const dbName = "courseProject";

const port = process.env.PORT || 3000;

const url = "mongodb+srv://admin:admin@cluster0.t4a9d.mongodb.net/$courseProject?retryWrites=true&w=majority";

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('common'))

app.get('/', (req, res) => {
    res.status(300).redirect('/info.html')
})

app.get('/users', async (req, res) => {
    try {
        await client.connect()
        const colli = client.db(dbName).collection('users')
        const clngs = await colli.find({}).toArray()

        res.status(200).json(clngs)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'something went wrong',
            value: error
        })
    } finally {
        await client.close()
    }
})

app.post('/users', async (req, res) => {
    try {

        const db = client.db(dbName);
        const col = db.collection("users");
        console.log("Connected correctly to server");

        await client.connect();

        let user = new User(req.body.firstname, req.body.lastname, req.body.email, req.body.password)

        res.status(200).send('succesfully uploaded')

        const p = await col.insertOne(user);

        const myDoc = await col.findOne();

        console.log(myDoc);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
})

app.get('/users/:id', async (req, res) => {
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
        console.log(error)
        res.status(500).send({
            error: 'something went wrong',
            value: error
        })
    } finally {
        await client.close()
    }
})


app.delete('/users/:id', async (req, res) => {
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
        console.log(error);
        res.status(500).send({
            error: 'error',
            value: error
        });
    }
})



app.delete('/', async (req, res) => {

})

app.listen(port, () => {
    console.log(`REST API is running at http://localhost:${port}`);
})