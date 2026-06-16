import { useState } from "react";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import Button from "../common/Button";
import { sendOtp } from "../../services/authApi";

const LoginForm = ({ onOtpSent }) => {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      mode,
      email: form.email.trim().toLowerCase(),
    };

    if (mode === "signup") {
      payload.name = form.name.trim();
      payload.phone = form.phone.trim();
    }

    if (!payload.email) {
      setStatus("Please enter your email address.");
      setStatusType("error");
      return;
    }

    if (mode === "signup" && (!payload.name || !payload.phone)) {
      setStatus("Please enter your name, phone number, and email.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatus("");
    setStatusType("");

    try {
      const data = await sendOtp(payload);

      setStatus(data.message || "OTP sent successfully.");
      setStatusType(data.emailSent === false ? "warning" : "success");
      onOtpSent(payload.email);
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
        <Mail size={17} />
      </div>

      <div className="auth-heading">
        <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p>
          {mode === "login"
            ? "Login with your email and we’ll send a one-time code."
            : "Enter your details and we’ll send a one-time login code."}
        </p>
      </div>

      <div className="auth-tabs">
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Login
        </button>

        <button
          type="button"
          className={mode === "signup" ? "active" : ""}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      {mode === "signup" && (
        <>
          <label className="auth-field">
            <span>Full name</span>
            <div className="auth-input-wrap">
              <User size={15} />
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Phone number</span>
            <div className="auth-input-wrap">
              <Phone size={15} />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="98XXXXXXXX"
                autoComplete="tel"
              />
            </div>
          </label>
        </>
      )}

      <label className="auth-field">
        <span>Email address</span>
        <div className="auth-input-wrap">
          <Mail size={15} />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
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
        {mode === "login"
          ? "Only email is required for existing users."
          : "Create once, then login with only your email next time."}
      </p>

      <style>{`
        .auth-card {
          width: 100%;
          padding: 18px;
          border-radius: 20px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .auth-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
          margin-bottom: 12px;
        }

        .auth-heading h2 {
          margin: 0;
          font-size: 1.35rem;
          line-height: 1.15;
          letter-spacing: -0.04em;
        }

        .auth-heading p {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 14px;
          padding: 4px;
          border-radius: 13px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .auth-tabs button {
          border: 0;
          border-radius: 9px;
          padding: 8px;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-weight: 900;
          font-size: 0.86rem;
        }

        .auth-tabs button.active {
          background: rgba(22, 163, 74, 0.14);
          color: #16a34a;
        }

        .auth-field {
          display: block;
          margin-top: 12px;
        }

        .auth-field span {
          display: block;
          margin-bottom: 6px;
          color: var(--text);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .auth-input-wrap {
          height: 42px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          border-radius: 13px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: #16a34a;
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
          font-size: 0.86rem;
          font-weight: 700;
        }

        .auth-status {
          margin: 10px 0 0;
          padding: 9px 11px;
          border-radius: 11px;
          font-size: 0.8rem;
          font-weight: 700;
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
          margin-top: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 16px;
        }

        .auth-note {
          margin: 10px 0 0;
          color: var(--muted);
          font-size: 0.76rem;
          text-align: center;
        }
      `}</style>
    </form>
  );
};

export default LoginForm;