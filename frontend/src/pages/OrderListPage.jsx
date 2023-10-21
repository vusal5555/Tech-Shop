import { useGetAllOrdersQuery } from "../slices/ordersApiSlice";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  console.log(orders);
  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <Table striped responsive hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.isPaid ? "Paid" : "Not Paid"}</td>
                  <td>{order.isDelivered ? "Delivered" : "Not Delivered"}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button type="button" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListPage;
