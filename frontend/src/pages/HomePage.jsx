import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Product";

import { Row, Col, Card, Button } from "react-bootstrap";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    };

    fetchProducts();
  }, []);
  return (
    <>
      <h2>Latest Products</h2>
      <Row>
        {products.map((product) => {
          return (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product}></Product>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default HomePage;
