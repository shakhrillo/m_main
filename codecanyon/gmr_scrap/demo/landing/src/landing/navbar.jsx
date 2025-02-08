import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import logo from "../img/logo-with-text.svg";

function CustomNavbar() {
  return (
    <Navbar collapseOnSelect expand={"lg"} className="w-100 pt-3">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="GeoScrapper" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto me-auto gap-4 my-2 my-lg-0 geo-navbar__content--menu"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#canGet">Date We Provide</Nav.Link>
            <Nav.Link href="#testimonial">Testimonial</Nav.Link>
            <Nav.Link href="#documentation">Documentation</Nav.Link>
            <Nav.Link href="#integration">Integration</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#faq">FAQ</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <button className="geo-btn geo-btn__style-two">
              Start a free trial
            </button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
