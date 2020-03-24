import React from "react";
import loginImg from "../../../images/Login.svg";
import FirebaseFunctions from "../../../config/FirebaseFunctions";

export function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = async () => {
    const businessID = await FirebaseFunctions.logIn(email, password);
    console.log(businessID);
  };

  return (
    <div className="base-container">
      <div className="header1">Login</div>
      <div className="content">
        <div className="image">
          <img src={loginImg} alt="" />
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="username"
              placeholder="email"
              value={email}
              onChange={event => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <p>Forgot Password?  </p>
        </div>
      </div>
      <div className="footer">
        <button className="btn" type="button" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
