import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const userValid = useCallback(() => {
    let token = localStorage.getItem("userdbtoken");
    if (token) {
      console.log("user valid");
    } else {
      navigate("*");
    }
  }, [navigate]);

  useEffect(() => {
    userValid();
  }, [userValid]);

  return <div>Dashboard</div>;
};

export default Dashboard;
