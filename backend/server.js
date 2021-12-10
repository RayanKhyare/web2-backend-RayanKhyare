const {
    MongoClient,
    ObjectId
} = require('mongodb');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');

const cors = require('cors');
const {
    query
} = require('express');

require('dotenv').config()

const client = new MongoClient(process.env.URL);

const dbName = "courseProject";

const port = process.env.PORT

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())

app.get("", async (req, res) => {

    return res.send("Received a GET HTTP method");;
});

app.post("/", (req, res) => {
    return res.send("Received a POST HTTP method");
});

app.put("/", (req, res) => {
    return res.send("Received a PUT HTTP method");
});

app.delete("/", (req, res) => {
    return res.send("Received a DELETE HTTP method");
});

app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
);