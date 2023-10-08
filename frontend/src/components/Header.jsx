import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
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
          <Navbar.Brand>TechShop</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-collapse"></Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-collapse">
          <Nav className="ms-auto">
            <Nav.Link>Cart</Nav.Link>
            <Nav.Link>Sign In</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
