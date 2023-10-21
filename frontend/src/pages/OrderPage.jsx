import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Row, Col, ListGroup, Image, Button } from "react-bootstrap";
import {
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDeliverOrderMutation } from "../slices/ordersApiSlice";

const OrderPage = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId);

  const [payOrder, { isLoading: paypalLoading, error: paypalError }] =
    usePayOrderMutation();

  const [deliverOrder, { isLoading: deliverLoading, error: deliverError }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const deliverHandler = async () => {
    try {
      await deliverOrder({ orderId });
      refetch();
      toast.success("Payment successfull");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);

  const onApproveTest = async () => {
    try {
      await payOrder({ orderId, details: { payer: {} } });
      refetch();
      toast.success("Payment successfull");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successfull");
      } catch (error) {
        toast.error(error?.data?.message);
      }
    });
  };

  const onError = async (error) => {
    toast.error(error?.data?.message);
  };

  const createOrder = async (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  return isLoading ? (
    <Loader></Loader>
  ) : error ? (
    <Message variant="danger">{error?.data?.message}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.deliveredAt ? (
                <Message variant="success">{order.deliveredAt}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">{order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.map((order, index) => {
                return (
                  <ListGroup key={index}>
                    <ListGroup.Item>
                      <Row>
                        <Col md={2}>
                          <Image src={order.image} fluid rounded></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${order._id}`}>{order.name}</Link>
                        </Col>
                        <Col>
                          ${order.price} x {order.qty} = $
                          {order.price * order.qty}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                );
              })}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items Price</Col>
                <Col>${order.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping Price</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Tax Price</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item>
              <Row>
                <Col>Total Price</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>

            {!order.isPaid && (
              <ListGroup.Item>
                {paypalLoading && <Loader></Loader>}

                {isPending ? (
                  <Loader></Loader>
                ) : (
                  <>
                    <Button onClick={onApproveTest}>Test Pay</Button>

                    <div className="my-3">
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  </>
                )}
              </ListGroup.Item>
            )}
            {deliverLoading && <Loader></Loader>}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" onClick={deliverHandler}>
                    Mark as delivered
                  </Button>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderPage;
