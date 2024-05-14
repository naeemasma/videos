import React, { useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import NavDropdown from 'react-bootstrap/NavDropdown';

// Navigation Bar
const Navigation = () => {

  const submitform = async e => {
    e.preventDefault();
    console.log(search);
    window.location.href = '/?f='+search
  }

  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ username, setUsername ] = useState('');
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {      
      setIsAuth(true); 
    }  
    if (localStorage.getItem('is_admin_user')!== null) {      
      setIsAdmin(true); 
    }   
    if (localStorage.getItem('username') !== null) {
      setUsername(localStorage.getItem('username'));    
    }    
  }, [isAuth, isAdmin, username]);

  return(
    <div class='m-0'>    
      {!loading ? 
        <Navbar collapseOnSelect fixed='top' expand='sm' bg="dark" variant="dark">
        <Container>
          <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className="ml-auto">
              {isAdmin ?
                <Nav.Link href="/videoitem?create=y">New Video</Nav.Link>
                : null}
            </Nav>
            <Nav>              
                <Nav.Link href="/">All Videos</Nav.Link>                
            </Nav> 
            <Nav>
              {isAuth ?
                <Nav.Link href={`/?f=mylist`}>My List</Nav.Link>
                : null}
            </Nav>             
            <Form className="d-flex" onSubmit={submitform}>              
              <Form.Control
                type="search"
                placeholder="Search"
                className="ml-2"
                aria-label="Search"
                value={search}
                required
                onChange={e => setSearch(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={submitform}>Search</Button>
          </Form>
          
          <Nav className="ml-auto"> 
              {!isAuth ?             
                <Nav.Link href="/login">Login</Nav.Link> :null}                 
            </Nav>
            <Nav> 
              {!isAuth ?             
                <Nav.Link href="/userRegistration">Register</Nav.Link> :null}                 
          </Nav>
          <Nav className="me-auto">
            {isAuth ?
              <Nav.Link href="/logout">Logout</Nav.Link>:null}   
           </Nav> 
           <Nav className="mr-auto">
            {isAuth ?
              <Navbar.Text>
              Logged in as: <a href="#">{username}</a>
              </Navbar.Text> :null} 
           </Nav>            
          </Navbar.Collapse>
        </Container>
      </Navbar>
        : <div> Loading... </div>
      }
  </div>
  )
}

export default Navigation;