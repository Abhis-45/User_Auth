import React from "react";
import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Somethigs went wrong!!</h1>
            <p>Sorry, we can't log you in.</p>
          </div>

          <p>
            Login Agian? <NavLink to="/">Login</NavLink>{" "}
          </p>
        </div>
      </section>
    </>
  );
};

export default Error;
