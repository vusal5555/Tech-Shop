import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setCofirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((store) => store.auth);

  const [profile, { isLoading, error }] = useProfileMutation();
  const {
    data: orders,
    isLoading: orderLoading,
    error: orderError,
  } = useGetMyOrdersQuery();

  console.log(orders);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        const res = await profile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("profile updated");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User profile</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              as="input"
              type="text"
              placeholder="enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              as="input"
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              as="input"
              type="password"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmpassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              as="input"
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setCofirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit">Submit</Button>
          {isLoading && <Loader></Loader>}
        </Form>
      </Col>
      <Col md={9}>
        {orderLoading ? (
          <Loader></Loader>
        ) : orderError ? (
          <Message variant="danger">{orderError?.data?.message}</Message>
        ) : (
          <>
            <h2>MY Orders</h2>
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice}</td>
                      <td>{order.isPaid ? "Paid" : "Not Paid"}</td>
                      <td>
                        {order.isDelivered ? "Delivered" : "Not Delivered"}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm">Details</Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
