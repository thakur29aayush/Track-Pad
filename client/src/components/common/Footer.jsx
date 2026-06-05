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

export default Footer;