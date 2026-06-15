import { FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const styles = {
    footer: {
      marginTop: "4rem",
      padding: "2rem 1.5rem 1rem",
      borderTop: "1px solid var(--border)",
      background: "var(--card)",
      color: "var(--text)",
      transition: "all 0.3s ease",
    },

    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1.5rem",
    },

    brand: {
      flex: 1,
      minWidth: "280px",
    },

    title: {
      margin: 0,
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "var(--primary)",
    },

    description: {
      marginTop: "0.5rem",
      color: "var(--muted)",
      lineHeight: 1.6,
      maxWidth: "500px",
    },

    support: {
      marginTop: "0.8rem",
      color: "var(--muted)",
      fontSize: "0.9rem",
      lineHeight: 1.6,
    },

    supportLink: {
      color: "var(--primary)",
      textDecoration: "none",
      fontWeight: 700,
    },

    socials: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
    },

    icon: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "var(--primary-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--primary)",
      textDecoration: "none",
      fontSize: "1.2rem",
      border: "1px solid var(--border)",
      transition: "all 0.3s ease",
    },

    bottom: {
      marginTop: "1.5rem",
      paddingTop: "1rem",
      borderTop: "1px solid var(--border)",
      textAlign: "center",
      color: "var(--muted)",
      fontSize: "0.9rem",
    },
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = "var(--primary)";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = "var(--primary-soft)";
    e.currentTarget.style.color = "var(--primary)";
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <h3 style={styles.title}>TrackPad</h3>

          <p style={styles.description}>
            Smart digital products, study resources, productivity tools,
            planners, templates, and resources designed to help you learn
            faster, stay organized, and achieve more.
          </p>

          <p style={styles.support}>
            Need help or support? Contact us at{" "}
            <a
              href="mailto:trackkpad@gmail.com"
              style={styles.supportLink}
            >
              trackkpad@gmail.com
            </a>
          </p>
        </div>

        <div style={styles.socials}>
          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.icon}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://youtube.com/@yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.icon}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>

          <a
            href="mailto:trackkpad@gmail.com"
            style={styles.icon}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} TrackPad. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;import { FaEnvelope, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="tp-footer">
      <div className="tp-footer-container">
        <div className="tp-footer-brand">
          <h3>TrackPad</h3>

          <p>
            Smart digital products, study resources, productivity tools,
            planners, templates, and resources designed to help you learn
            faster, stay organized, and achieve more.
          </p>

          <p className="tp-footer-support">
            Need help or support? Contact us at{" "}
            <a href="mailto:trackkpad@gmail.com">trackkpad@gmail.com</a>
          </p>
        </div>

        <div className="tp-footer-socials">
          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://youtube.com/@yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>

          <a href="mailto:trackkpad@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </div>

      <div className="tp-footer-bottom">
        © {new Date().getFullYear()} TrackPad. All rights reserved.
      </div>

      <style>{`
        .tp-footer {
          margin-top: 3.5rem;
          padding: 1.65rem 1.25rem 0.9rem;
          border-top: 1px solid var(--border);
          background:
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.08), transparent 34%),
            var(--card);
          color: var(--text);
          transition: background 0.25s ease, color 0.25s ease;
        }

        .tp-footer-container {
          width: min(1120px, 92%);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.4rem;
        }

        .tp-footer-brand {
          max-width: 620px;
        }

        .tp-footer-brand h3 {
          margin: 0;
          font-size: 1.18rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          background: linear-gradient(120deg, #f5d800, #22c55e 60%, #d9a900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tp-footer-brand p {
          margin: 0.55rem 0 0;
          max-width: 560px;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.6;
        }

        .tp-footer-support {
          font-size: 0.84rem !important;
        }

        .tp-footer-support a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 800;
        }

        .tp-footer-support a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .tp-footer-socials {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .tp-footer-socials a {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          color: var(--primary);
          background: var(--primary-soft);
          border: 1px solid var(--border);
          font-size: 1rem;
          text-decoration: none;
          transition:
            transform 0.18s ease,
            background 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .tp-footer-socials a:hover {
          transform: translateY(-2px);
          color: #08120c;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          border-color: rgba(34, 197, 94, 0.28);
          box-shadow: 0 10px 22px rgba(34, 197, 94, 0.18);
        }

        .tp-footer-bottom {
          width: min(1120px, 92%);
          margin: 1.3rem auto 0;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border);
          text-align: center;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 600;
        }

        @media (max-width: 760px) {
          .tp-footer {
            margin-top: 3rem;
            padding-top: 1.4rem;
          }

          .tp-footer-container {
            align-items: flex-start;
            flex-direction: column;
          }

          .tp-footer-socials {
            width: 100%;
          }

          .tp-footer-socials a {
            width: 36px;
            height: 36px;
            border-radius: 12px;
          }

          .tp-footer-bottom {
            text-align: left;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;