import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getTokens } from "../api/tokenApi";

export const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const socketRef = useRef(null);
  const connectedRef = useRef(false);

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
    const interval = setInterval(fetchTokens, 10000);

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

    if (!connectedRef.current) {
      connectedRef.current = true;
      socketRef.current = io(SOCKET_URL, { transports: ["websocket", "polling"], reconnectionAttempts: 5 });

      socketRef.current.on("connect", () => console.log("🔌 Socket connected:", socketRef.current.id));
      socketRef.current.on("tokens:changed", fetchTokens);
    }

    return () => {
      clearInterval(interval);
      socketRef.current?.disconnect();
      socketRef.current = null;
      connectedRef.current = false;
    };
  }, []);

  const addToken = (newToken) => setTokens([...tokens, newToken]);
  const updateToken = (updated) => setTokens(tokens.map(t => t._id === updated._id ? updated : t));
  const deleteToken = (id) => setTokens(tokens.filter(t => t._id !== id));

  return { tokens, addToken, updateToken, deleteToken };
};
