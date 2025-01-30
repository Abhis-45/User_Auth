import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "https://user-auth-api-ecru.vercel.app/user/verifyOtp",
        { email: location.state.email, otp }
      );
      if (response.data.verified) {
        navigate("/dashboard", { state: { user: response.data.user } });
      }
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Otp Validation</h1>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="otp">Enter Otp</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
            <button className="btn" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Otp;
