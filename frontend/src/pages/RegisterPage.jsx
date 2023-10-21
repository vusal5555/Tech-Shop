import { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../slices/usersApiSlice";

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((store) => store.auth);

  const [register, { isLoading }] = useRegisterMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      if (confirmPassword === password) {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
        toast.success("user registered");
      } else {
        toast.error("passwords do not match");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={registerHandler}>
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

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            as="input"
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            as="input"
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-3">
          Submit
        </Button>

        {isLoading && <Loader></Loader>}

        <p>
          Already have an acoount?{" "}
          <Link to={redirect ? `/login/?redirect=${redirect}` : "/login"}>
            register
          </Link>
        </p>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
