import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { unSetCredentials } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import SearchBox from "./SearchBox";

const Header = () => {
  const { cartItems } = useSelector((store) => store.cart);
  const { userInfo } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const logOutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(unSetCredentials());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      collapseOnSelect
      className="mb-3"
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="my-2">TechShop</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-collapse"></Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-collapse">
          <Nav className="ms-auto">
            <SearchBox></SearchBox>
            <LinkContainer to="/cart">
              <Nav.Link>
                <AiOutlineShoppingCart></AiOutlineShoppingCart> Cart{" "}
                {cartItems.length > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {userInfo ? (
              <NavDropdown title={userInfo.name}>
                <LinkContainer to="/profile">
                  <NavDropdown.Item>
                    <AiOutlineUser></AiOutlineUser> Profile
                  </NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Item onClick={() => logOutHandler()}>
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Sign In</Nav.Link>
              </LinkContainer>
            )}

            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin">
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
