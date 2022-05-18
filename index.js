const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ffqd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const allTaskCollection = client.db('to-do-app').collection('task');




        app.get('/addTask', async (req, res) => {
            const query = {};
            const cursor = allTaskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        app.get('/addTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await allTaskCollection.findOne(query);
            res.send(item);
        });

        app.post('/addTask', async (req, res) => {
            const addTask = req.body;
            const result = await allTaskCollection.insertOne(addTask);
            res.send(result);
        });

        // Delete user added Tasks 
        app.delete('/addTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allTaskCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running to-do Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})