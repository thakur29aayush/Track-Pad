import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import OtpVerifyForm from "../components/auth/OtpVerifyForm";

const Login = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="grid">
      {!email ? (
        <LoginForm onOtpSent={setEmail} />
      ) : (
        <OtpVerifyForm email={email} />
      )}
    </section>
  );
};

export default Login;