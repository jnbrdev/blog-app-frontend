import { useContext } from "react";
import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Badge, Dropdown, Button} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";
import '../App.css';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  // Fetch cart data on component mount to get the item count
 
  return (
<Navbar expand="lg" className="navbar">
  <Container>
    <Navbar.Brand as={Link} to="/" className=" brand-font">
      Blogspot
    </Navbar.Brand>
    {user.id !== null ? (
          <>
          <Nav.Link as={Link} to="/posts" className="">
            My Posts
          </Nav.Link>
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" id="profile-dropdown" className="text-dark">
              <FontAwesomeIcon icon={faUser} className="text-dark" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
        ) : (
          // Other navbar links for logged-out users go here
          <></>
        )}

    {/* Login and Register buttons outside Navbar.Collapse to always show on small screens */}
    {user.id === null && (
      <Nav className="d-flex">
         <Nav.Link as={NavLink} to="/login" exact="true" className="text-white">
          <Button  className="nav-button">Login</Button>
        </Nav.Link>
        <Nav.Link as={NavLink} to="/register" exact="true" className="text-white">
          <Button className="nav-button">Register</Button>
        </Nav.Link>
      </Nav>
    )}
  </Container>
</Navbar>

  );
}
