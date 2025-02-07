import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verifyOtp",
        { email: location.state.email, otp },
        { withCredentials: true }
      );
      if (response.data.verified) {
        navigate("/thankyou", { state: { user: response.data.user } });
      } else {
        navigate("/error");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      navigate("/error");
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>OTP Validation</h1>
          </div>
          <form onSubmit={handleVerifyOtp}>
            <div className="form_input">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                required
              />
            </div>
            <button type="submit" className="btn">Verify OTP</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Otp;
