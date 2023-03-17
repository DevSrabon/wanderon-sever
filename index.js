const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require('express');

const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { query } = require('express');

const app = express();

// middleware
app.use(express.json());
app.use(cors())

// Database Connection
const uri =
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sajc8ea.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})


async function main() { 
    try {
        
    }
    finally {
        
    }
}
main().catch(err => console.dir(err));

app.get('/', (req, res) => {
res.send('Server is working!');
})

app.listen(port, () => console.log(`Server is running on port ${port}`));
