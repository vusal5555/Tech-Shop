import { useState } from "react";
import { Row, Col, ListGroup, Button, Image, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Rating from "../components/Rating";
import {
  useGetSingleProductQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductPage = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((store) => store.auth);

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetSingleProductQuery(productId);

  const [createReview, { isLoading: reviewLoading }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review added successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return isLoading ? (
    <Loader></Loader>
  ) : error ? (
    <Message variant="danger">{error?.data?.message}</Message>
  ) : (
    <>
      <Meta title={product.name}></Meta>
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

            {product.countInStock > 0 && (
              <ListGroup.Item>
                <Row>
                  <Col>Quantity</Col>
                  <Col>
                    <Form.Control
                      as="select"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <Button
                type="button"
                variant="primary"
                disabled={!product.countInStock}
                onClick={() => addToCartHandler()}
              >
                Add to Cart
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row className="review">
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            {product.reviews.map((review) => {
              return (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating}></Rating>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              );
            })}
            <ListGroup.Item>
              <h2>Write a review</h2>

              {reviewLoading && <Loader></Loader>}

              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent.</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button type="submit">Submit</Button>
                </Form>
              ) : (
                <p>Login</p>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductPage;
