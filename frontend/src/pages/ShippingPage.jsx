import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckOutSteps from "../components/CheckOutSteps";

const ShippingPage = () => {
  const { shippingAddress } = useSelector((store) => store.cart);

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitFormHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      navigate("/payment");
    } catch (error) {
      console.log(error?.data?.message);
    }
  };

  return (
    <FormContainer>
      <CheckOutSteps step1 step2></CheckOutSteps>
      <h1>Shipping</h1>
      <Form onSubmit={submitFormHandler}>
        <Form.Group controlId="address" className="my-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="input"
            type="text"
            placeholder="enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className="my-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            as="input"
            type="text"
            placeholder="enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode" className="my-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            as="input"
            type="text"
            placeholder="enter postalcode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            as="input"
            type="text"
            placeholder="enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
          <Button type="submit" className="my-3">
            Submit
          </Button>
        </Form.Group>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
