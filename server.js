const express = require('express');
const app = express();
const port = 3000;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://krisb1220:<password>@kwizzy.ziabc3a.mongodb.net/?retryWrites=true&w=majority&appName=Kwizzy";

// Create a MongoClient with a MongoClientOptions object to set the Stable API versiondd
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// Define a route handler for the default home pagegih
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
