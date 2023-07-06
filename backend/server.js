require('dotenv').config();

const express = require('express');
const axios = require('axios');
const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_PASSWORD,
});

const app = express();

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await shopify.product.get(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/api/products/:id/buy', async (req, res) => {
  try {
    const checkout = await shopify.checkout.create({
      line_items: [{
        variant_id: req.params.id,
        quantity: 1,
      }]
    });

    res.json({ checkoutUrl: checkout.web_url });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3001, () => console.log(`Server is running on port 3001 in ${process.env.NODE_ENV} mode`));
