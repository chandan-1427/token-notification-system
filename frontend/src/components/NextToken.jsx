import { Ticket, User } from "lucide-react";

export const NextToken = ({ token }) => {
  if (!token) {
    return (
      <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <p className="text-gray-500 font-medium">
          No patients in the queue at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-md border border-green-200 transition-transform">
      {/* Ribbon Badge */}

      {/* Token Info */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2 text-green-700">
          <Ticket size={22} />
          <span className="text-sm font-medium">Next Token Number</span>
        </div>

        <p className="text-5xl font-extrabold text-green-700 tracking-wide drop-shadow-sm">
          #{token.tokenNumber}
        </p>
      </div>

      {/* Patient Info */}
      <div className="mt-5 flex items-center justify-center gap-3 bg-white/60 rounded-xl p-3 border border-green-200">
        <User size={20} className="text-green-700" />
        <div className="text-left">
          <p className="font-semibold text-green-900">{token.name || "Anonymous"}</p>
          {token.contact && (
            <p className="text-sm text-green-700">{token.contact}</p>
          )}
        </div>
      </div>
    </div>
  );
};
