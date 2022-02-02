import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Status - FactoryFour</Navbar.Brand>
      </Container>
    </Navbar>
  );
};
export default Header;
