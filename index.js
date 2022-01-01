const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aik0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("travelpro");
    const packageCollection = database.collection("packages");
    const bookingCollection = database.collection("booking");
    // GET API
    app.get('/packages', async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.json(packages);
    })

    //GET API FROM ID
    app.get('/packages/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await packageCollection.findOne(query)
      res.json(result)
    })

    //GET API FROM BOOKING
    app.get('/booking', async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.json(booking);
    })

    //POST BOOKING API
    app.post('/booking', async (req, res) => {
      const doc = req.body;
      const result = await bookingCollection.insertOne(doc);
      res.send(result)
    })

    //POST PACKAGE API
    app.post('/packages', async (req, res) => {
      const doc = req.body;
      const result = await packageCollection.insertOne(doc);
      res.send(result)
    })

    //BOOKING SPECIF ID
    app.get('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await bookingCollection.findOne(query)
      res.json(result)
    })


    //DELETE API
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })



  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('travelpro server running')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})