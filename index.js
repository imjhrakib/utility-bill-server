const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jhratlas.m93791y.mongodb.net/?appName=jhrAtlas`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    // Connect the client to the server-	(optional starting in v4.7)
    await client.connect();

    const db = client.db("utility_bills");
    const billsCollection = db.collection("bills");
    const myBillsCollection = db.collection("myBills");

    // bills data post in database
    app.post("/bills", async (req, res) => {
      const newBills = req.body;
      const result = await billsCollection.insertMany(newBills);
      res.send(result);
    });

    app.get("/bills", async (req, res) => {
      const cursor = billsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/myBills", async (req, res) => {
      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = myBillsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
