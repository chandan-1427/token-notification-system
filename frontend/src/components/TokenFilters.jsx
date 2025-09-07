export const TokenFilters = ({ filter, setFilter }) => {
  const filters = ["waiting", "served", "skipped"];

  return (
    <div className="flex justify-center gap-3 mt-4">
      {filters.map((status) => {
        const isActive = filter === status;
        return (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-3 rounded-lg text-md font-medium transition-colors duration-200
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        );
      })}
    </div>
  );
};
