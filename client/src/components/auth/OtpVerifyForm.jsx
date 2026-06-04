import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { verifyOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const OtpVerifyForm = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const data = await verifyOtp(email, otp);
      login(data.token, data.user);
      navigate("/products");
    } catch (error) {
      setStatus(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h2>Verify OTP</h2>
      <p>OTP sent to {email}</p>

      <label>
        OTP
        <input
          className="input"
          type="text"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
        />
      </label>

      {status && <p className="error">{status}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  );
};

export default OtpVerifyForm;