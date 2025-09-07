import { useEffect, useState } from "react";
import { getTokens } from "../api/tokenApi";
import DisplayTokenCard from "../components/DisplayTokenCard";

export default function DisplayBoard() {
  const [tokens, setTokens] = useState([]);

  const fetchTokens = async () => {
    try {
      const { data } = await getTokens();
      setTokens(data);
    } catch (err) {
      console.error("Failed to fetch tokens", err);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  return <DisplayTokenCard tokens={tokens} />;
}
