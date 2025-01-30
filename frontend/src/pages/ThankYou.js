import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:4002/user/${user.email}`);
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header text-center">
          <h1>Welcome, {user.name}</h1>
        </div>
        <div className="card-body text-center">
          <img
            src={`http://localhost:4002/images/${user.image}`}
            alt="Profile"
            className="img-thumbnail mb-3"
            style={{ width: "150px", height: "150px" }}
          />
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Company:</strong> {user.companyName}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>DOB:</strong> {user.dob}
          </p>
          <button onClick={handleDeleteAccount} className="btn btn-danger m-2">
            Remove Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
