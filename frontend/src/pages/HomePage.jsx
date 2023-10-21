import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col } from "react-bootstrap";
import {
  useGetProductsQuery,
  useGetTopProductsQuery,
} from "../slices/productsApiSlice";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomePage = () => {
  const { keyword, pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const {
    data: topProducts,
    isLoading: topLoading,
    error: TopError,
  } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

  return (
    <>
      {!keyword ? (
        <ProductCarousel products={topProducts}></ProductCarousel>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      <>
        <h2>Latest Products</h2>
        <Row>
          {data.products.map((product) => {
            return (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product}></Product>
              </Col>
            );
          })}
        </Row>
        <Paginate
          pages={data.pages}
          page={data.page}
          keyword={keyword ? keyword : ""}
        ></Paginate>
      </>
    </>
  );
};

export default HomePage;
