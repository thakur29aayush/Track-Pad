import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { verifyOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const OtpVerifyForm = ({ email, onBack }) => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 6);
    setOtp(clean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setStatus("Enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const data = await verifyOtp({
       email,
       otp,
      });
      login(data.token, data.user);
      navigate("/products");
    } catch (error) {
      setStatus(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <button type="button" className="back-button" onClick={onBack}>
        <ArrowLeft size={15} />
        Change email
      </button>

      <div className="auth-icon">
        <KeyRound size={18} />
      </div>

      <div className="auth-heading">
        <h2>Check your email</h2>
        <p>
          We sent a 6-digit OTP to <strong>{email}</strong>.
        </p>
      </div>

      <label className="auth-field">
        <span>Verification code</span>

        <div className="otp-input-wrap">
          <input
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="000000"
            autoComplete="one-time-code"
            autoFocus
          />
        </div>
      </label>

      {status && <p className="auth-status error">{status}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? (
          "Verifying..."
        ) : (
          <>
            Verify OTP <CheckCircle2 size={15} />
          </>
        )}
      </Button>

      <p className="auth-note">
        In development mode, check your backend terminal if email delivery is
        disabled.
      </p>

      <style>{`
        .auth-card {
          width: 100%;
          padding: 24px;
          border-radius: 22px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-size: 0.86rem;
          font-weight: 800;
        }

        .back-button:hover {
          color: #16a34a;
        }

        .auth-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          margin-bottom: 16px;
        }

        .auth-heading h2 {
          margin: 0;
          font-size: 1.55rem;
          line-height: 1.15;
          letter-spacing: -0.04em;
        }

        .auth-heading p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .auth-heading strong {
          color: var(--text);
          word-break: break-word;
        }

        .auth-field {
          display: block;
          margin-top: 20px;
        }

        .auth-field span {
          display: block;
          margin-bottom: 7px;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .otp-input-wrap {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .otp-input-wrap:focus-within {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .otp-input-wrap input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          text-align: center;
          font-size: 1.45rem;
          font-weight: 900;
          letter-spacing: 0.32em;
        }

        .otp-input-wrap input::placeholder {
          color: var(--muted);
          opacity: 0.42;
        }

        .auth-status {
          margin: 13px 0 0;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.84rem;
          font-weight: 700;
          line-height: 1.45;
        }

        .auth-status.error {
          background: rgba(220, 38, 38, 0.12);
          color: var(--danger);
        }

        .auth-card .btn {
          width: 100%;
          margin-top: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px 18px;
          font-size: 0.92rem;
        }

        .auth-note {
          margin: 13px 0 0;
          color: var(--muted);
          font-size: 0.8rem;
          line-height: 1.5;
          text-align: center;
        }

        @media (max-width: 520px) {
          .auth-card {
            padding: 20px;
            border-radius: 20px;
          }

          .auth-heading h2 {
            font-size: 1.4rem;
          }

          .otp-input-wrap {
            height: 48px;
          }

          .otp-input-wrap input {
            font-size: 1.28rem;
            letter-spacing: 0.24em;
          }
        }
      `}</style>
    </form>
  );
};

export default OtpVerifyForm;