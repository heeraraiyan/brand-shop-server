const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId, MongoAWSError } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kihbdij.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const cartCollection = client.db('productDB').collection('cart');


    app.get('/products', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async(req,res) =>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result);
    })


    app.get('/products_Brand/:brand_name', async(req,res)=>{
      const brandName = req.params.brand_name;
      // console.log(brandName)
      const query = {brand_name: brandName};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      // const result = await productCollection.findOne(query);
      res.send(result);
    })

    

   
    app.post('/products', async(req,res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })


    app.put('/products/:id', async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedProduct = req.body;
      const Product = {
        $set: {
          image: updatedProduct.image,
          name: updatedProduct.name,
          brand_name: updatedProduct.brand_name,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating
          
        }
      }

      const result = await productCollection.updateOne(filter,Product,options);
      res.send(result);
    })


    // cart related 

    app.get('/cart', async(req, res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/cart',async(req, res) =>{
      const userCart= req.body;
      console.log(userCart);
      const result = await cartCollection.insertOne(userCart);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('fashion and apparel server is running')
})

app.listen(port, () => {
  console.log(`server is run  on port ${port}`)
})