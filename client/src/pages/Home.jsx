import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Clock
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
            Premium Digital Products for Modern Living
          </span>

          {/* Headline */}
          <h1>
            Elevate Your Productivity with
            <span> Smart Templates & Habit Tools</span>
          </h1>

          {/* Subheadline */}
          <p>
            Discover Notion templates, habit trackers, and digital planners designed for
            clarity, focus, and long-term success. Built for professionals, by professionals.
          </p>

          {/* CTA Buttons */}
          <div className="actions">
            <Link to="/products">
              <Button className="btn-primary">
                Explore Products <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="btn-secondary">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero-trust">
            <span>
              <ShieldCheck size={16} />
              Secure UPI & Card Payments
            </span>
            <span>
              <CheckCircle2 size={16} />
              Lifetime Access & Updates
            </span>
            <span>
              <Users size={16} />
              Trusted by 10,000+ Users
            </span>
          </div>
        </div>

        {/* Hero Card (Dashboard Preview) */}
        <div className="hero-card">
          <div className="dashboard-preview">
            {/* Preview Header */}
            <div className="preview-header">
              <div>
                <span className="mini-label">Pro Dashboard</span>
                <h3>Your Daily Focus</h3>
              </div>
              <Target size={24} className="target-icon" />
            </div>

            {/* Progress Block */}
            <div className="progress-block">
              <div className="progress-row">
                <span>Habit Tracker</span>
                <strong>99% <TrendingUp size={14} className="trending-icon" /></strong>
              </div>
              <div className="progress-track">
                <div style={{ width: "99%" }} />
              </div>
              <p className="progress-subtext">Consistency is key to success</p>
            </div>

            {/* Preview List */}
            <div className="preview-list">
              <div>
                <CheckCircle2 size={16} />
                <span>Self Improvement</span>
              </div>
              <div>
                <CheckCircle2 size={16} />
                <span>High Motivation</span>
              </div>
              <div>
                <CheckCircle2 size={16} />
                <span>30-Day Challenge</span>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-pill pill-one">
              <Clock size={14} />
              Real-Time Sync
            </div>
            <div className="floating-pill pill-two">
              <Sparkles size={14} />
              AI-Powered
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">
            <Sparkles size={24} />
          </div>
          <h3>Digital Templates</h3>
          <p>Notion systems, planners, and workflows to streamline your work and life.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Target size={24} />
          </div>
          <h3>Habit Tools</h3>
          <p>Track discipline, goals, and consistency with our intuitive tools.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <CalendarCheck size={24} />
          </div>
          <h3>Counselling</h3>
          <p>Book 1:1 sessions for personalized guidance and support.</p>
        </div>
      </div>

      {/* Testimonials Section (Optional) */}
      <div className="home-testimonials">
        <h2>Trusted by Professionals</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>"This template changed how I manage my projects. Highly recommend!"</p>
            <div className="testimonial-author">
              <span className="author-name">Priya Sharma</span>
              <span className="author-role">Product Manager</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"The habit tracker is a game-changer. My productivity has skyrocketed."</p>
            <div className="testimonial-author">
              <span className="author-name">Rahul Mehta</span>
              <span className="author-role">Entrepreneur</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        :root {
          --primary: #22c55e;
          --primary-dark: #16a34a;
          --secondary: #f5d800;
          --text: #1f2937;
          --muted: #6b7280;
          --card: #ffffff;
          --border: #e5e7eb;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .home-page {
          padding: 2rem 0 4rem;
          font-family: "Inter", "Syne", "DM Sans", system-ui, sans-serif;
          background: #f9fafb;
          color: var(--text);
        }

        .home-hero {
          min-height: calc(100vh - 200px);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.05);
        }

        .hero-copy h1 {
          margin: 0;
          max-width: 680px;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          line-height: 1.1;
          letter-spacing: -0.05em;
          font-weight: 800;
          color: var(--text);
        }

        .hero-copy h1 span {
          background: linear-gradient(120deg, #f5d800, #22c55e 60%, #e6a800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-copy p {
          margin: 1.5rem 0 0;
          max-width: 600px;
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--muted);
        }

        .actions {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: var(--primary);
          border: none;
          border-radius: 0.5rem;
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(34, 197, 94, 0.3);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
          background: transparent;
          border: 1px solid var(--primary);
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: rgba(34, 197, 94, 0.05);
          border-color: var(--primary-dark);
        }

        .hero-trust {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 2rem;
          color: var(--muted);
          font-size: 0.875rem;
          font-weight: 600;
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
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: 
            radial-gradient(circle, rgba(34, 197, 94, 0.25), transparent 65%),
            radial-gradient(circle at 70% 30%, rgba(245, 216, 0, 0.2), transparent 50%);
          filter: blur(10px);
          opacity: 0.9;
        }

        .dashboard-preview {
          position: relative;
          z-index: 2;
          width: min(500px, 100%);
          border-radius: 1.5rem;
          padding: 1.5rem;
          background: var(--card);
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-preview:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .dashboard-preview::before {
          content: "";
          position: absolute;
          inset: -80px -80px auto auto;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(245, 216, 0, 0.15);
          filter: blur(12px);
        }

        .preview-header {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .mini-label {
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .preview-header h3 {
          margin: 0.5rem 0 0;
          font-size: 1.75rem;
          letter-spacing: -0.04em;
          color: var(--text);
        }

        .target-icon {
          color: var(--secondary);
        }

        .progress-block {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
        }

        .progress-row {
          display: flex;
          justify-content: space-between;
          color: var(--text);
          font-size: 0.9375rem;
          font-weight: 700;
        }

        .trending-icon {
          color: var(--secondary);
          vertical-align: middle;
        }

        .progress-track {
          height: 0.5rem;
          margin-top: 0.75rem;
          border-radius: 9999px;
          background: rgba(34, 197, 94, 0.12);
          overflow: hidden;
        }

        .progress-track div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.5s ease;
        }

        .progress-subtext {
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: var(--muted);
          font-weight: 500;
        }

        .preview-list {
          margin-top: 1.25rem;
          display: grid;
          gap: 0.75rem;
        }

        .preview-list div {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 1rem;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(34, 197, 94, 0.1);
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .preview-list div:hover {
          background: rgba(34, 197, 94, 0.05);
          border-color: rgba(34, 197, 94, 0.2);
        }

        .preview-list svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .floating-pill {
          position: absolute;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border-radius: 9999px;
          color: var(--text);
          background: var(--card);
          border: 1px solid rgba(34, 197, 94, 0.15);
          box-shadow: var(--shadow);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .pill-one {
          top: 1.5rem;
          left: 1rem;
        }

        .pill-two {
          right: 1rem;
          bottom: 4rem;
        }

        .floating-pill svg {
          color: var(--primary);
        }

        /* Features Section */
        .home-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 2rem;
        }

        .feature-card {
          position: relative;
          padding: 1.75rem;
          border-radius: 1.25rem;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
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
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          background: rgba(34, 197, 94, 0.1);
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }

        .feature-card p {
          margin: 0;
          color: var(--muted);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        /* Testimonials Section */
        .home-testimonials {
          margin-top: 4rem;
          padding: 0 2rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .home-testimonials h2 {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 2rem;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .testimonial-card {
          padding: 1.5rem;
          border-radius: 1rem;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }

        .testimonial-card p {
          margin: 0 0 1rem;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text);
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .author-name {
          font-weight: 600;
          color: var(--text);
        }

        .author-role {
          font-size: 0.875rem;
          color: var(--muted);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .home-hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            min-height: auto;
            padding-top: 2rem;
          }

          .hero-card {
            min-height: 400px;
          }

          .home-features {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .home-page {
            padding: 1rem 0 3rem;
          }

          .hero-copy h1 {
            font-size: clamp(2rem, 8vw, 2.75rem);
          }

          .hero-copy p {
            font-size: 1rem;
          }

          .dashboard-preview {
            width: 100%;
            padding: 1.25rem;
            border-radius: 1.25rem;
          }

          .floating-pill {
            display: none;
          }

          .hero-card {
            min-height: 350px;
          }

          .actions {
            flex-direction: column;
          }

          .actions a,
          .actions button {
            width: 100%;
          }

          .hero-trust {
            gap: 1rem;
            font-size: 0.8125rem;
          }

          .testimonial-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;