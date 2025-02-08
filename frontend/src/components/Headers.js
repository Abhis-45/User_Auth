import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

const Headers = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <p className="mt-3 mx-2 text-light text-decoration-none">User_Auth</p>
          <Nav className="">
            <NavLink to="/" className=" text-light text-decoration-none">
              Home
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      <Navbar bg="dark" variant="dark" fixed="bottom">
      <Container className="justify-content-center">
        <p className="text-light mb-0">© 2025 User_Auth. All rights reserved.</p>
      </Container>
    </Navbar>
    </>
  );
};

export default Headers;
