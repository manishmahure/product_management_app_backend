const express = require('express');
const mongoose = require('mongoose');
const Product = require('./Product');


const cors = require('cors');


const app = express();
app.use(cors());
// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/product_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// API Routes
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.delete('/api/products/:id', async (req, res) => {
//   try {
//     const productId = req.params.id;
//     // Use Mongoose to delete the product by ID
//     const deletedProduct = await Product.findByIdAndDelete(productId);

//     if (!deletedProduct) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(deletedProduct);
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Deleting product with ID:', productId);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Deleted product:', deletedProduct);
    res.json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
