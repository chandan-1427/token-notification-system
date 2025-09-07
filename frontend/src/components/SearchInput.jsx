import { Search, X } from "lucide-react";

export const SearchInput = ({ search, setSearch }) => (
  <div className="relative w-full max-w-md mx-auto">
    <input
      type="text"
      placeholder="Search patients by name or token #"
      aria-label="Search patients"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-11 pr-10 py-3 w-full rounded-lg
                 bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200 shadow-sm"
    />
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      size={20}
    />
    {search && (
      <button
        onClick={() => setSearch("")}
        aria-label="Clear search"
        className="absolute right-4 top-1/2 -translate-y-1/2 
                   text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={20} />
      </button>
    )}
  </div>
);
