import React from "react";
import EditText from "../../../components/EditText";
import HelpButton from "../../../components/HelpButton";
import "./Login.css"

export default function Login() {
  return (
    <div>
      <section class="input container">
        <EditText className="input" labelText="Email" widthPercent={600} />ƒ
      </section>
      <EditText labelText="Password" widthPercent={600} />
      <HelpButton label="Login" />
    </div>
  );
}
