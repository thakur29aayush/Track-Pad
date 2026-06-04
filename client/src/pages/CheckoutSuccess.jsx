import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const CheckoutSuccess = () => {
  return (
    <section className="card">
      <h1>Payment Successful</h1>
      <p>Your lifetime access has been created. A rare moment where software behaved.</p>

      <Link to="/my-purchases">
        <Button>View My Purchases</Button>
      </Link>
    </section>
  );
};

export default CheckoutSuccess;