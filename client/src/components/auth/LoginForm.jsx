import { useState } from "react";
import Button from "../common/Button";
import { sendOtp } from "../../services/authApi";

const LoginForm = ({ onOtpSent }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const data = await sendOtp(email);
      setStatus(data.message);
      onOtpSent(email);
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>Login with Email OTP</h2>

      <label>
        Email
        <input
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      {status && <p>{status}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );
};

export default LoginForm;