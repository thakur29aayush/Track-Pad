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
        <Mail size={18} />
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
              <User size={16} />
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
              <Phone size={16} />
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
          <Mail size={16} />
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

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 18px;
          padding: 5px;
          border-radius: 14px;
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .auth-tabs button {
          border: 0;
          border-radius: 10px;
          padding: 10px;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          font-weight: 900;
        }

        .auth-tabs button.active {
          background: rgba(22, 163, 74, 0.14);
          color: #16a34a;
        }

        .auth-field {
          display: block;
          margin-top: 16px;
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

        .auth-status {
          margin: 13px 0 0;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.84rem;
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
          margin-top: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px 18px;
        }

        .auth-note {
          margin: 13px 0 0;
          color: var(--muted);
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>
    </form>
  );
};

export default LoginForm;