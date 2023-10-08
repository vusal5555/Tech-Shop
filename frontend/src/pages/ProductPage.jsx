import { useEffect, useState } from "react";
import { Row, Col, ListGroup, Button, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Rating from "../components/Rating";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    };

    fetchData();
  }, []);

  return (
    <Row>
      <Col md={5}>
        <Image src={product.image} fluid></Image>
      </Col>
      <Col md={4}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>{product.name}</h2>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            ></Rating>
          </ListGroup.Item>
          <ListGroup.Item>
            <p>${product.price}</p>
          </ListGroup.Item>
          <ListGroup.Item>
            <p>{product.description}</p>
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <ListGroup>
          <ListGroup.Item>
            <Row>
              <Col>Price</Col>
              <Col>${product.price}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Status</Col>
              <Col>
                {product.countInStock >= 1 ? "In Stock" : "Out of Stock"}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Quantity</Col>
              <Col></Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              type="button"
              variant="primary"
              disabled={!product.countInStock}
            >
              Add to Cart
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default ProductPage;
