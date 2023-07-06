import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, useHistory } from "react-router-dom";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const ProductDetail = ({ match }) => {
  const [product, setProduct] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${API_BASE_URL}/api/products/${match.params.id}`);
      setProduct(result.data);
    }
    fetchData();
  }, [match.params.id]);

  const buyProduct = async () => {
    // You'd typically interact with your backend here, which would handle the Shopify checkout creation process.
    // Assuming your backend returns the checkout URL, you'd then redirect to this URL.
    try {
      const result = await axios.post(`${API_BASE_URL}/api/products/${match.params.id}/buy`);
      window.location.href = result.data.checkoutUrl;
    } catch (err) {
      console.error(err);
    }
  }

  return product ? (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <button onClick={buyProduct}>Buy</button>
      <Link to="/">Go back</Link>
    </div>
  ) : <p>Loading...</p>
}

const ConfirmationPage = ({ match }) => (
  <div>
    <h2>Confirmation</h2>
    <p>You have purchased item {match.params.id}</p>
    <Link to="/">Go back</Link>
  </div>
)

const HomePage = () => (
  <div>
    <h2>Welcome to our store!</h2>
    {process.env.NODE_ENV === 'development' && <p>This site is currently in development mode.</p>}
    <Link to="/product/1">Go to product 1</Link>
  </div>
)

const App = () => (
  <Router>
    <Route path="/" exact component={HomePage} />
    <Route path="/product/:id" exact component={ProductDetail} />
    <Route path="/confirmation/:id" component={ConfirmationPage} />
  </Router>
);

export default App;
