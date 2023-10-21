import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const UserEditPage = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    refetch,
    isLoading,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser({
        userId,
        name,
        email,
        isAdmin,
      });
      refetch();
      navigate("/admin/userlist");
      toast.success("User updated");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                as="input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Role</Form.Label>
              <Form.Check
                as="input"
                type="checkbox"
                label="is admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(Boolean(e.target.checked))}
              ></Form.Check>
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

export default UserEditPage;
