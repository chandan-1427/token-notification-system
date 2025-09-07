import { serveToken, skipToken, deleteToken } from "../api/tokenApi";
import { CheckCircle, SkipForward, Trash2, User } from "lucide-react";

export default function TokenCard({ token, onUpdate, onDelete }) {
  const handleServe = async () => {
    const { data } = await serveToken(token._id);
    onUpdate(data.token);
  };

  const handleSkip = async () => {
    const { data } = await skipToken(token._id);
    onUpdate(data.token);
  };

  const handleDelete = async () => {
    await deleteToken(token._id);
    onDelete(token._id);
  };

  return (
    <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Token Info */}
      <div>
        <p className="text-lg font-bold text-gray-800">
          Token #{token.tokenNumber}
        </p>
        <div className="flex items-center gap-2 text-gray-700 mt-1">
          <User size={18} className="text-gray-500" />
          <span className="font-medium">{token.name || "Anonymous"}</span>
          {token.contact && (
            <span className="text-sm text-gray-500">({token.contact})</span>
          )}
        </div>
        <p
          className={`text-sm font-medium mt-1 ${
            token.status === "waiting"
              ? "text-yellow-600"
              : token.status === "served"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleServe}
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition"
        >
          <CheckCircle size={16} /> Serve
        </button>
        <button
          onClick={handleSkip}
          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition"
        >
          <SkipForward size={16} /> Skip
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
