import { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../slices/usersApiSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((store) => store.auth);

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

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
      toast.success("user logged in");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={loginHandler}>
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
        <Button type="submit" className="my-3">
          Submit
        </Button>

        {isLoading && <Loader></Loader>}

        <p>
          Don't have an acoount?{" "}
          <Link to={redirect ? `/register/?redirect=${redirect}` : "/register"}>
            register
          </Link>
        </p>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
