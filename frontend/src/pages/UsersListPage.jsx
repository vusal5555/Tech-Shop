import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../slices/usersApiSlice";
import { Table, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const UsersListPage = () => {
  const { data: users, refetch, isLoading, error } = useGetAllUsersQuery();

  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    try {
      await deleteUser(id);
      refetch();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.danger(error?.data?.message);
    }
  };

  return (
    <>
      <h2>Users</h2>

      {isLoading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <Table striped responsive hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-3">
                        <FaEdit></FaEdit>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTimes style={{ color: "white" }}></FaTimes>
                    </Button>
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

export default UsersListPage;
