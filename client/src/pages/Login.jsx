import { useState } from "react";
import { LockKeyhole, ShieldCheck, MailCheck } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import OtpVerifyForm from "../components/auth/OtpVerifyForm";

const Login = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="login-page">
      <div className="login-layout">
        <div className="login-copy">
          <p className="eyebrow">Secure Access</p>

          <h1>
            Login with email OTP.
            <span>No password circus.</span>
          </h1>

          <p>
            Access your purchases, counselling bookings, and product dashboard
            using a secure one-time code sent to your email.
          </p>

          <div className="login-benefits">
            <div>
              <ShieldCheck size={16} />
              Secure OTP login
            </div>

            <div>
              <MailCheck size={16} />
              Email-based verification
            </div>

            <div>
              <LockKeyhole size={16} />
              Protected purchases
            </div>
          </div>
        </div>

        <div className="login-panel">
          {!email ? (
            <LoginForm onOtpSent={setEmail} />
          ) : (
            <OtpVerifyForm email={email} onBack={() => setEmail("")} />
          )}
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          padding: 0px 0 58px;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
        }

        .login-layout {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 42px;
          align-items: center;
        }

        .login-copy {
          max-width: 560px;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #16a34a;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .login-copy h1 {
          margin: 0;
          font-size: clamp(2.35rem, 4.6vw, 4.4rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .login-copy h1 span {
          display: block;
          color: #16a34a;
        }

        .login-copy > p {
          max-width: 520px;
          margin: 18px 0 0;
          color: var(--muted);
          font-size: 0.96rem;
          line-height: 1.65;
        }

        .login-benefits {
          display: grid;
          gap: 10px;
          margin-top: 24px;
          max-width: 360px;
        }

        .login-benefits div {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 13px;
          border-radius: 14px;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .login-benefits svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .login-panel {
          width: 100%;
          max-width: 390px;
          justify-self: end;
        }

        @media (max-width: 900px) {
          .login-page {
            align-items: flex-start;
          }

          .login-layout {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .login-panel {
            max-width: 430px;
            justify-self: start;
          }
        }

        @media (max-width: 560px) {
          .login-page {
            min-height: auto;
            padding: 28px 0 48px;
          }

          .login-copy h1 {
            font-size: clamp(2.15rem, 11vw, 3.3rem);
          }

          .login-copy > p {
            font-size: 0.92rem;
            line-height: 1.6;
          }

          .login-benefits {
            margin-top: 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default Login;