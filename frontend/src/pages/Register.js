import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/mix.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    age: "",
    dob: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if (formData.name === "") {
      toast.error("Enter Your Name!");
      return;
    } else if (formData.email === "") {
      toast.error("Enter Your Email!");
      return;
    } else if (!formData.email.includes("@")) {
      toast.error("Enter Valid Email!");
      return;
    } else if (formData.password === "") {
      toast.error("Enter Your Password!");
      return;
    } else if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.");
      return;
    } else if (formData.companyName === "") {
      toast.error("Enter Your Company Name!");
      return;
    } else if (formData.dob === "") {
      toast.error("Enter Your Date of Birth!");
      return;
    } else if (formData.age === "") {
      toast.error("Enter Your Age!");
      return;
    } else if (formData.age < 0 || formData.age > 150) {
      toast.error("Enter a valid age");
      return;
    } else if (formData.image === null) {
      toast.error("Upload Your Profile Image!");
      return;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "dob") {
        const formattedDate = new Date(formData[key])
          .toISOString()
          .split("T")[0];
        data.append(key, formattedDate);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post("/api/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <ToastContainer />
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Sign Up</h1>
            <p style={{ textAlign: "center" }}>Welcome to you</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form_input">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                placeholder="Enter Your Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                placeholder="Enter Your password"
              />
            </div>
            <div className="form_input">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                onChange={handleChange}
                placeholder="Enter Your Company Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                name="dob"
                id="dob"
                onChange={handleChange}
                placeholder="Enter Your Date of Birth"
                max={today}
              />
            </div>
            <div className="form_input">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                name="age"
                id="age"
                onChange={handleChange}
                placeholder="Enter Your Age"
              />
            </div>
            <div className="form_input">
              <label htmlFor="image">Profile Image</label>
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleChange}
                accept="image/png, image/jpeg"
              />
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <p>
              You have an account? <NavLink to="/login">Login</NavLink>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
