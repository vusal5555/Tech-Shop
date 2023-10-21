import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../slices/productsApiSlice";
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { LinkContainer } from "react-router-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";

const ProductListPage = () => {
  const { pageNumber } = useParams();
  const { data, refetch, isLoading, error } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: productDeleteLoading }] =
    useDeleteProductMutation();

  const [createProduct, { isLoading: productLoading, error: productError }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    try {
      await deleteProduct(id);
      refetch();
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const createProductHandler = async () => {
    try {
      await createProduct();
      refetch();
      toast.success("Product created");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={() => createProductHandler()}>
            <FaEdit></FaEdit> Create Product
          </Button>
        </Col>
      </Row>

      {productLoading && <Loader></Loader>}
      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <>
          <Table striped responsive hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product, index) => {
                return (
                  <tr key={index}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit></FaEdit>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash style={{ color: "white" }}></FaTrash>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
          ></Paginate>
        </>
      )}
    </>
  );
};

export default ProductListPage;
