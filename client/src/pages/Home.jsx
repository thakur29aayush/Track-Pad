import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  BookOpen,
  Zap,
  Activity,
  Flame
} from "lucide-react";
import Button from "../components/common/Button";

const Home = () => {
  return (
    <section className="home-page">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-copy">
          {/* Badge */}
          <span className="badge hero-badge">
            <Leaf size={14} />
            Digital products for better living
          </span>

          {/* Headline */}
          <h1>
            Build better habits with
            <span> templates, trackers, and guidance.</span>
          </h1>

          {/* Subheadline */}
          <p>
            Discover Notion templates, habit trackers, digital planners, and
            paid counselling sessions built for clarity and calm execution.
          </p>

          {/* CTA Buttons */}
          <div className="actions">
            <Link to="/products">
              <Button>
                <Zap size={16} />
                Explore Products <ArrowRight size={15} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">
                <Users size={16} />
                Login with OTP
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero-trust">
            <span>
              <ShieldCheck size={15} />
              Secure UPI payments
            </span>
            <span>
              <CheckCircle2 size={15} />
              Lifetime access
            </span>
            <span>
              <Clock size={15} />
              Real-time sync
            </span>
          </div>
        </div>

        {/* Hero Card (Dashboard Preview) */}
        <div className="hero-card">
          <div className="dashboard-preview">
            {/* Preview Header */}
            <div className="preview-header">
              <div>
                <span className="mini-label">
                  <Activity size={12} />
                  Growth Dashboard
                </span>
                <h3>Today’s Focus</h3>
              </div>
              <div className="header-icon-wrapper">
                <Target size={20} className="header-icon" />
              </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-overview">
              <div className="stat-item">
                <div className="stat-icon">
                  <Flame size={16} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">99%</span>
                  <span className="stat-label">Habit Completion</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <TrendingUp size={16} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">7 Days</span>
                  <span className="stat-label">Streak</span>
                </div>
              </div>
            </div>

            {/* Progress Block */}
            <div className="progress-block">
              <div className="progress-header">
                <span>
                  <CheckCircle2 size={14} />
                  Habit Tracker
                </span>
                <span className="progress-percentage">
                  99% <Flame size={12} className="fire-icon" />
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "99%" }} />
              </div>
            </div>

            {/* Preview List */}
            <div className="preview-list">
              <div className="list-item">
                <CheckCircle2 size={14} className="list-icon" />
                <span>Self Improvement</span>
              </div>
              <div className="list-item">
                <CheckCircle2 size={14} className="list-icon" />
                <span>High Motivation</span>
              </div>
              <div className="list-item">
                <CheckCircle2 size={14} className="list-icon" />
                <span>30 Days Challenge</span>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-pill pill-one">
              <Sparkles size={12} />
              AI-Powered
            </div>
            <div className="floating-pill pill-two">
              <Clock size={12} />
              Real-Time
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">
            <BookOpen size={20} />
          </div>
          <h3>Digital Templates</h3>
          <p>Notion systems, planners, trackers, and repeatable workflows.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Target size={20} />
          </div>
          <h3>Habit Tools</h3>
          <p>Simple products for tracking discipline, goals, and consistency.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <CalendarCheck size={20} />
          </div>
          <h3>Counselling</h3>
          <p>Paid bookings for guided personal support and clarity sessions.</p>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        :root {
          --primary: #22c55e;
          --primary-dark: #16a34a;
          --secondary: #f5d800;
          --text-light: #1f2937;
          --text-dark: #f9fafb;
          --muted-light: #6b7280;
          --muted-dark: #9ca3af;
          --card-light: #ffffff;
          --card-dark: #111827;
          --border-light: #e5e7eb;
          --border-dark: #374151;
          --shadow-light: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-dark: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
          --shadow-lg-light: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --shadow-lg-dark: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
        }

        .home-page {
          padding: 1rem 0 3rem;
          font-family: "Inter", "Syne", "DM Sans", system-ui, sans-serif;
          color: var(--text-light, var(--text-dark));
          background: var(--card-light, var(--card-dark));
        }

        .home-hero {
          min-height: calc(100vh - 180px);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.05);
        }

        .hero-badge svg {
          color: var(--primary);
        }

        .hero-copy h1 {
          margin: 0;
          max-width: 600px;
          font-size: clamp(2rem, 4.5vw, 3rem);
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 800;
        }

        .hero-copy h1 span {
          background: linear-gradient(120deg, #f5d800, #22c55e 60%, #e6a800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-copy p {
          margin: 1.25rem 0 0;
          max-width: 550px;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--muted-light, var(--muted-dark));
        }

        .actions {
          margin-top: 1.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .home-page .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 0.5rem;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.15);
          transition: all 0.2s ease;
          color: white;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border: none;
        }

        .home-page .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(34, 197, 94, 0.2);
        }

        .home-page .btn[variant="outline"] {
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
        }

        .home-page .btn[variant="outline"]:hover {
          background: rgba(34, 197, 94, 0.1);
        }

        .hero-trust {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--muted-light, var(--muted-dark));
        }

        .hero-trust span {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .hero-trust svg {
          color: var(--primary);
        }

        /* Hero Card */
        .hero-card {
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: 
            radial-gradient(circle, rgba(34, 197, 94, 0.25), transparent 65%),
            radial-gradient(circle at 70% 30%, rgba(245, 216, 0, 0.2), transparent 50%);
          filter: blur(8px);
          opacity: 0.9;
        }

        .dashboard-preview {
          position: relative;
          z-index: 2;
          width: min(450px, 100%);
          border-radius: 1.25rem;
          padding: 1.5rem;
          background: var(--card-light, var(--card-dark));
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: var(--shadow-lg-light, var(--shadow-lg-dark));
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-preview:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 40px rgba(0, 0, 0, 0.15);
        }

        .dashboard-preview::before {
          content: "";
          position: absolute;
          inset: -60px -60px auto auto;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(245, 216, 0, 0.15);
          filter: blur(10px);
        }

        .preview-header {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .mini-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .mini-label svg {
          color: var(--primary);
        }

        .preview-header h3 {
          margin: 0.5rem 0 0;
          font-size: 1.4rem;
          letter-spacing: -0.03em;
          color: var(--text-light, var(--text-dark));
        }

        .header-icon-wrapper {
          background: rgba(245, 216, 0, 0.1);
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .header-icon {
          color: var(--secondary);
        }

        /* Stats Overview */
        .stats-overview {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.1);
          flex: 1;
        }

        .stat-icon {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          background: rgba(34, 197, 94, 0.1);
          color: var(--primary);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--text-light, var(--text-dark));
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--muted-light, var(--muted-dark));
          font-weight: 500;
        }

        /* Progress Block */
        .progress-block {
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .progress-header span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-light, var(--text-dark));
        }

        .progress-header svg {
          color: var(--primary);
        }

        .progress-percentage {
          font-weight: 800;
          color: var(--primary);
        }

        .fire-icon {
          color: var(--secondary);
          vertical-align: middle;
        }

        .progress-track {
          height: 0.5rem;
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.12);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.5s ease;
        }

        /* Preview List */
        .preview-list {
          display: grid;
          gap: 0.5rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(34, 197, 94, 0.1);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-light, var(--text-dark));
          transition: all 0.2s ease;
        }

        .list-item:hover {
          background: rgba(34, 197, 94, 0.05);
          border-color: rgba(34, 197, 94, 0.2);
        }

        .list-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        /* Floating Pills */
        .floating-pill {
          position: absolute;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 9999px;
          background: var(--card-light, var(--card-dark));
          border: 1px solid rgba(34, 197, 94, 0.15);
          box-shadow: var(--shadow-light, var(--shadow-dark));
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-light, var(--text-dark));
        }

        .pill-one {
          top: 1rem;
          left: 1rem;
        }

        .pill-two {
          right: 1rem;
          bottom: 3rem;
        }

        .floating-pill svg {
          color: var(--primary);
        }

        /* Features Section */
        .home-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1.5rem;
        }

        .feature-card {
          position: relative;
          padding: 1.5rem;
          border-radius: 1rem;
          background: var(--card-light, var(--card-dark));
          border: 1px solid var(--border-light, var(--border-dark));
          box-shadow: var(--shadow-light, var(--shadow-dark));
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg-light, var(--shadow-lg-dark));
          border-color: rgba(34, 197, 94, 0.2);
        }

        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 45%);
          pointer-events: none;
        }

        .feature-icon {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          background: rgba(34, 197, 94, 0.1);
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-light, var(--text-dark));
        }

        .feature-card p {
          margin: 0;
          color: var(--muted-light, var(--muted-dark));
          font-size: 0.875rem;
          line-height: 1.6;
        }

        /* Light/Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .home-page {
            --text: var(--text-dark);
            --muted: var(--muted-dark);
            --card: var(--card-dark);
            --border: var(--border-dark);
            --shadow: var(--shadow-dark);
            --shadow-lg: var(--shadow-lg-dark);
          }
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .home-hero {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            min-height: auto;
            padding-top: 1.5rem;
          }

          .hero-card {
            min-height: 350px;
          }

          .home-features {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .actions a,
          .actions button {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .home-page {
            padding: 0.5rem 0 2rem;
          }

          .home-hero {
            padding: 0 1rem;
          }

          .hero-copy h1 {
            font-size: clamp(1.75rem, 8vw, 2.5rem);
          }

          .hero-copy p {
            font-size: 0.9rem;
          }

          .dashboard-preview {
            width: 100%;
            padding: 1rem;
            border-radius: 1rem;
          }

          .floating-pill {
            display: none;
          }

          .hero-card {
            min-height: 300px;
          }

          .hero-trust {
            gap: 0.75rem;
            font-size: 0.8rem;
          }

          .home-features {
            padding: 0 1rem;
          }

          .stats-overview {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;