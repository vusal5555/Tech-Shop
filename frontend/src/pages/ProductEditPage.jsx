import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
  useUpdateProductMutation,
  useGetSingleProductQuery,
  useUploadProductImageMutation,
} from "../slices/productsApiSlice";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductEditPage = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    error,
  } = useGetSingleProductQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const navigate = useNavigate();

  const [uploadProductImage, { isLoading: uploadImageLoading }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      });
      toast.success("Product updated");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const uploadFileHadnler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader></Loader>}

        {isLoading ? (
          <Loader></Loader>
        ) : error ? (
          <Message variant="danger">{error?.data?.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                as="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                as="input"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                as="input"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                label="choose file"
                onChange={uploadFileHadnler}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3"></Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                as="input"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                as="input"
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" className="btn-primary">
              Submit
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditPage;
