import React from "react";
import {Navigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserRegistration = () => {
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [msg, setMsg] = useState('');
  const [isAdmin, setAdminUser] = React.useState(false);
  const [adminToken, setAdminToken] = React.useState('');

  const submit = async e => {    
      e.preventDefault();
      
      setMsg('')
      const user = {
          username: username,
          useremail: useremail,
          password: password,
          confirmation: confirmation,
          isAdmin: isAdmin,
          adminToken: adminToken
        };
        // Invoke REST API to register user
        try { 
          const {data} = await axios.post('http://localhost:8000/registration', user ,{headers: {
          'Content-Type': 'application/json'
        }});
        localStorage.clear();
        if(data){
          if(data.error){
            setMsg(data.error)
          }else{
            window.location.href = '/login'
          }   
        }           
      } catch (e) {
          setMsg('User registration Failure. Backend service may not be available.')
      }      
  }
 
  return(
      // Return user registration form
      <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Register</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name='username'
              type='text'
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Email"
              name='useremail'
              type='text'
              value={useremail}
              required
              onChange={e => setUseremail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>
              <input type="checkbox" checked={isAdmin} onChange={e => setAdminUser(!isAdmin)} />
              Admin User
            </label>            
          </div>
          <div className="form-group mt-3" hidden={!isAdmin}>
            <label>Admin User's Validation Token</label>
            <input
              name='adminToken'
              type="password"
              className="form-control mt-1"
              placeholder="Enter Username for this Demo"
              value={adminToken}
              required={isAdmin}             
              onChange={e => setAdminToken(e.target.value)}/>
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name='password'
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Confirm Password</label>
            <input
              name='confirmation'
              type="password"
              className="form-control mt-1"
              placeholder="Confirm password"
              value={confirmation}
              required
              onChange={e => setConfirmation(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
          <div className="form-group mt-3">
            <p class="text-danger">{msg}</p>       
          </div>
          <div className="d-grid gap-2 mt-3">
            <p class="text-center">            
            Already have an account?  <Link to={`/login`} >Log In here.</Link>
            </p>  
          </div>
        </div>
      </form>
  </div>
  )
}

export default UserRegistration;
