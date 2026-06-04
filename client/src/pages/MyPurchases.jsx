import { useEffect, useState } from "react";
import { getMyPurchases } from "../services/productApi";
import ProductAccessBox from "../components/products/ProductAccessBox";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [status, setStatus] = useState("Loading purchases...");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPurchases();
        setPurchases(data);
        setStatus("");
      } catch {
        setStatus("Failed to load purchases.");
      }
    };

    load();
  }, []);

  return (
    <section>
      <h1>My Purchases</h1>

      {status && <p>{status}</p>}

      <div className="grid">
        {purchases.map((purchase) => (
          <ProductAccessBox key={purchase.id} purchase={purchase} />
        ))}
      </div>
    </section>
  );
};

export default MyPurchases;