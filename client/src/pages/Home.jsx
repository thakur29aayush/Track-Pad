import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Button from "../components/common/Button";

const heroText = "Build better habits with templates, trackers, and guidance.";

const Home = () => {
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= heroText.length) {
        clearInterval(interval);
        setIsTypingDone(true);
        return;
      }

      setTypedText(heroText.slice(0, index + 1));
      index += 1;
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const normalText = typedText.slice(0, 25);
  const gradientText = typedText.slice(25);

  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="hero-copy">
          <span className="badge hero-badge">
            <Leaf size={13} />
            Digital tools for better living
          </span>

          <h1 className="typing-title" aria-label={heroText}>
            {normalText}
            <span className="gradient-word">{gradientText}</span>
            {!isTypingDone && <span className="typing-cursor" />}
          </h1>

          <p>
            Discover Notion templates, habit trackers, digital planners, and
            focused counselling sessions designed for clarity, discipline, and
            calm execution.
          </p>

          <div className="actions">
            <Link to="/products">
              <Button>
                Explore Products <ArrowRight size={14} />
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline">Login with OTP</Button>
            </Link>
          </div>

          <div className="hero-trust">
            <span>
              <ShieldCheck size={14} />
              Secure UPI payments
            </span>
            <span>
              <CheckCircle2 size={14} />
              Lifetime access
            </span>
          </div>
        </div>

        <div className="hero-card">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div>
                <span className="mini-label">Growth Dashboard</span>
                <h3>Today’s Focus</h3>
              </div>

              <div className="icon-box">
                <Target size={22} />
              </div>
            </div>

            <div className="progress-block">
              <div className="progress-row">
                <span>Habit Tracker</span>
                <strong>99%</strong>
              </div>

              <div className="progress-track">
                <div style={{ width: "99%" }} />
              </div>
            </div>

            <div className="preview-list">
              <div>
                <CheckCircle2 size={15} />
                Self improvement
              </div>
              <div>
                <CheckCircle2 size={15} />
                High motivation
              </div>
              <div>
                <CheckCircle2 size={15} />
                30 days challenge
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={18} />
          </div>
          <h3>Digital Templates</h3>
          <p>Notion systems, planners, trackers, and repeatable workflows.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Target size={18} />
          </div>
          <h3>Habit Tools</h3>
          <p>Simple products for tracking discipline, goals, and consistency.</p>
        </div>
      </div>

      <style>{`
        .home-page {
          padding: 6px 0 38px;
          font-family: "Syne", "DM Sans", system-ui, sans-serif;
        }

        .home-hero {
          min-height: calc(100vh - 220px);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 38px;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          padding: 7px 11px;
          font-size: 0.72rem;
          font-weight: 800;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .typing-title {
          margin: 0;
          max-width: 660px;
          min-height: 2.08em;
          font-size: clamp(2.35rem, 5vw, 4.75rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .gradient-word {
          background: linear-gradient(120deg, #f5d800, #22c55e 58%, #d9a900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .typing-cursor {
          display: inline-block;
          width: 0.08em;
          height: 0.78em;
          margin-left: 3px;
          border-radius: 99px;
          background: #22c55e;
          animation: cursorBlink 0.85s infinite;
          transform: translateY(0.08em);
        }

        @keyframes cursorBlink {
          0%, 45% {
            opacity: 1;
          }
          46%, 100% {
            opacity: 0;
          }
        }

        .hero-copy p {
          margin: 16px 0 0;
          max-width: 515px;
          font-size: 0.92rem;
          line-height: 1.62;
          color: var(--muted);
        }

        .home-page .actions {
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .home-page .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 15px;
          font-size: 0.86rem;
          border-radius: 13px;
          box-shadow: 0 8px 22px rgba(34, 197, 94, 0.13);
        }

        .hero-trust {
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
          margin-top: 18px;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .hero-trust span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .hero-trust svg {
          color: #22c55e;
        }

        .hero-card {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          width: 310px;
          height: 310px;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(34, 197, 94, 0.28), transparent 62%),
            radial-gradient(circle at 70% 30%, rgba(245, 216, 0, 0.22), transparent 48%);
          filter: blur(8px);
          opacity: 0.85;
        }

        .dashboard-preview {
          position: relative;
          z-index: 2;
          width: min(480px, 100%);
          border-radius: 26px;
          padding: 22px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
            var(--card);
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .dashboard-preview::before {
          content: "";
          position: absolute;
          top: -70px;
          right: -70px;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          background: rgba(245, 216, 0, 0.16);
          filter: blur(10px);
        }

        .preview-header {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .mini-label {
          color: #22c55e;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .preview-header h3 {
          margin: 6px 0 0;
          font-size: 1.55rem;
          letter-spacing: -0.045em;
        }

        .icon-box,
        .feature-icon {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.16);
          flex-shrink: 0;
        }

        .progress-block {
          margin-top: 24px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.16);
        }

        .progress-row {
          display: flex;
          justify-content: space-between;
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 800;
        }

        .progress-track {
          height: 8px;
          margin-top: 11px;
          border-radius: 99px;
          background: rgba(34, 197, 94, 0.14);
          overflow: hidden;
        }

        .progress-track div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22c55e, #f5d800);
        }

        .preview-list {
          margin-top: 16px;
          display: grid;
          gap: 9px;
        }

        .preview-list div {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 14px;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(34, 197, 94, 0.12);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .preview-list svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .home-features {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 8px;
          max-width: 780px;
        }

        .feature-card {
          position: relative;
          padding: 17px;
          border-radius: 18px;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 42%);
          pointer-events: none;
        }

        .feature-card h3 {
          position: relative;
          margin: 13px 0 5px;
          font-size: 0.98rem;
          letter-spacing: -0.02em;
        }

        .feature-card p {
          position: relative;
          margin: 0;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.5;
        }

        @media (max-width: 920px) {
          .home-hero {
            grid-template-columns: 1fr;
            gap: 24px;
            min-height: auto;
            padding-top: 22px;
          }

          .hero-card {
            min-height: 360px;
          }

          .home-features {
            grid-template-columns: 1fr;
            max-width: 100%;
          }
        }

        @media (max-width: 560px) {
          .home-page {
            padding: 4px 0 34px;
          }

          .typing-title {
            min-height: 2.55em;
            font-size: clamp(2rem, 4vw, 3.8rem);
          }

          .hero-copy p {
            font-size: 0.88rem;
          }

          .dashboard-preview {
            width: 100%;
            padding: 18px;
            border-radius: 22px;
          }

          .hero-card {
            min-height: 320px;
          }

          .home-page .actions {
            align-items: stretch;
            flex-direction: column;
          }

          .home-page .actions a,
          .home-page .actions button {
            width: 100%;
          }

          .hero-trust {
            gap: 10px;
            font-size: 0.78rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;