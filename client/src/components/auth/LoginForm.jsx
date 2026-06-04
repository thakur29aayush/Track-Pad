import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import Button from "../common/Button";
import { sendOtp } from "../../services/authApi";

const LoginForm = ({ onOtpSent }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setStatus("Please enter your email address.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatus("");
    setStatusType("");

    try {
      const data = await sendOtp(cleanEmail);

      setStatus(data.message || "OTP sent successfully.");
      setStatusType(data.emailSent === false ? "warning" : "success");
      onOtpSent(cleanEmail);
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to send OTP.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-icon">
        <Mail size={18} />
      </div>

      <div className="auth-heading">
        <h2>Welcome back</h2>
        <p>Enter your email and we’ll send a one-time login code.</p>
      </div>

      <label className="auth-field">
        <span>Email address</span>

        <div className="auth-input-wrap">
          <Mail size={16} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </label>

      {status && <p className={`auth-status ${statusType}`}>{status}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? (
          "Sending..."
        ) : (
          <>
            Send OTP <ArrowRight size={15} />
          </>
        )}
      </Button>

      <p className="auth-note">
        No password needed. Finally, one less thing to forget.
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

        .auth-input-wrap {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: #16a34a;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .auth-input-wrap:focus-within {
          border-color: rgba(22, 163, 74, 0.55);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .auth-input-wrap input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .auth-input-wrap input::placeholder {
          color: var(--muted);
        }

        .auth-status {
          margin: 13px 0 0;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.84rem;
          font-weight: 700;
          line-height: 1.45;
        }

        .auth-status.success {
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
        }

        .auth-status.warning {
          background: rgba(245, 216, 0, 0.13);
          color: #b38600;
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

          .auth-input-wrap {
            height: 46px;
          }
        }
      `}</style>
    </form>
  );
};

export default LoginForm;