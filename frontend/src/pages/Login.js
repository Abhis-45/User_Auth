import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "react-bootstrap/Spinner";
import "../styles/mix.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [spiner, setSpiner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const clearSession = async () => {
      try {
        await axios.post('/api/logout', {}, { withCredentials: true });
      } catch (error) {
        console.error('Failed to clear session:', error);
      }
    };

    clearSession();

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === "") {
      toast.error("Enter Your Email!");
      return;
    } else if (!formData.email.includes("@")) {
      toast.error("Enter Valid Email!");
      return;
    } else if (formData.password === "") {
      toast.error("Enter Your Password!");
      return;
    }

    setSpiner(true);
    try {
      await axios.post('/api/login', formData, { withCredentials: true });
      setSpiner(false);
      navigate("/otp", { state: { email: formData.email } });
    } catch (error) {
      setSpiner(false);
      navigate("/error");
      console.error('Login failed:', error);
      toast.error('Login failed');
    }
  };

  return (
    <>
      <ToastContainer />
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Login</h1>
            <p style={{textAlign:"center"}}>Welcome back! Please login to your account.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleChange} placeholder='Enter Your Email Address' required />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" onChange={handleChange} placeholder='Enter Your Password' required />
            </div>
            <button type="submit" className='btn'>
              Login
              {spiner ? (
                <span>
                  <Spinner animation="border" />
                </span>
              ) : (
                ""
              )}
            </button>
            <p>Don't have an account? <NavLink to="/register">Register</NavLink></p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
