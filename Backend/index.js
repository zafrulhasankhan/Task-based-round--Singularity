const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const cors = require('cors');
const port = 4000;
app.use(cors());

const uri = "mongodb+srv://nasim28:nasim28@cluster0.u2hyd5h.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/search/:term', async (req, res) => {
  try {
    await client.connect();

    const dbName = 'music_db';
    const collectionName = 'music_data';

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const searchTerm = req.params.term;

    const query = {
      $or: [
        { trackName: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search
        { artistName: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    const result = await collection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error retrieving data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
