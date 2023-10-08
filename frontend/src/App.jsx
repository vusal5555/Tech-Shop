import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <>
      <Header></Header>
      <main className="p-3">
        <Container>
          <Outlet></Outlet>
        </Container>
      </main>
      <Footer></Footer>
    </>
  );
};

export default App;
