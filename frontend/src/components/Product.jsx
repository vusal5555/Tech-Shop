import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-2" style={{ height: "400px" }}>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image}></Card.Img>
      </Link>

      <Card.Body>
        <LinkContainer to={`/product/${product._id}`}>
          <Card.Title>{product.name}</Card.Title>
        </LinkContainer>
        <Rating
          value={product.rating}
          text={`${product.numReviews} reviews`}
        ></Rating>
        <Card.Text as="h2">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
