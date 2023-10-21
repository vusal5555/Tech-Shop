import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <ToastContainer></ToastContainer>
    </>
  );
};

export default App;
