import TokenCard from "./TokenCard";

export default function TokenList({ tokens, onUpdate, onDelete }) {
  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <TokenCard
          key={token._id}
          token={token}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
