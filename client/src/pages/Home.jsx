import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const Home = () => {
  return (
    <section className="hero">
      <span className="badge">Digital products for better living</span>

      <h1>Templates, trackers, and counselling in one clean store.</h1>

      <p>
        Buy Notion templates, habit trackers, planners, and book paid counselling
        sessions with secure UPI payments.
      </p>

      <div className="actions">
        <Link to="/products">
          <Button>Explore Products</Button>
        </Link>

        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </section>
  );
};

export default Home;