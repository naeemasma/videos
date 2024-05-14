import React from "react";
import {Navigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const host = 'http://localhost:8000'  
  const submit = async e => {
      e.preventDefault();      
      localStorage.clear();
      setMsg('');      
      const user = {
        username: username,
        password: password
      };
      try {
        // Invoke REST APIs concurrently to validate user credentials and 
        // check admin permission. Set JWT token in local storage. 
        const res = await Promise.all([
            axios.post('http://localhost:8000/token/', user ,{headers: {
            'Content-Type': 'application/json'
            }}, {withCredentials: true}),
            axios.get(
              `http://localhost:8000/isadmin?u=${username}`, {
              headers: {
                'Content-Type': 'application/json',
              }
            })
          ]);
          const data = res.map((res) => res.data);
        if(data[0]){
          localStorage.setItem('access_token', data[0].access);
          localStorage.setItem('refresh_token', data[0].refresh);
          localStorage.setItem('username', username);
          if(data[1].isAdmin)localStorage.setItem('is_admin_user', data[1].isAdmin);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;    
          
          window.location.href = '/'
        }else{
          setMsg('Invalid username and/or password.')
        } 
      } catch {
        setMsg('Error Logging in')
      }      
  }

  return(
      // Return Login Form
      <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Login</h3>
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
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <div className="form-group mt-3">
            <p class="text-danger">{msg}</p>       
          </div>
          <div className="d-grid gap-2 mt-3">
            <p class="text-center">            
              Don't have an account?  <Link to={`/userRegistration`} >Register here.</Link>
            </p>  
          </div>
        </div>
      </form>
  </div>
  )
}

export default Login;
