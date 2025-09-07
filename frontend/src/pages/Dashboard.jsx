import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTokens } from "../hooks/useTokens";
import TokenForm from "../components/TokenForm";
import TokenList from "../components/TokenList";
import { ExportButtons } from "../components/ExportButtons";
import { TokenFilters } from "../components/TokenFilters";
import { NextToken } from "../components/NextToken";
import { SearchInput } from "../components/SearchInput";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tokens, addToken, updateToken, deleteToken } = useTokens();
  const [filter, setFilter] = useState("waiting");
  const [search, setSearch] = useState("");

  const filteredTokens = useMemo(
    () => tokens.filter((t) => t.status === filter),
    [tokens, filter]
  );

  const searchedTokens = useMemo(
    () =>
      filteredTokens.filter(
        (t) =>
          (t.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (t.contact || "").includes(search) ||
          String(t.tokenNumber || "").includes(search)
      ),
    [filteredTokens, search]
  );

  const nextToken = useMemo(
    () =>
      tokens
        .filter((t) => t.status === "waiting")
        .sort(
          (a, b) => parseInt(a.tokenNumber) - parseInt(b.tokenNumber)
        )[0],
    [tokens]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-800">Queue Manager</h1>
        <p className="text-gray-600">
          Manage patients, tokens, and queue efficiently
        </p>
      </header>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/display")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            Open Display
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            Logout
          </button>
        </div>
        <ExportButtons tokens={tokens} />
      </div>

      {/* Token Form */}
      <section>
        <TokenForm onAdd={addToken} />
      </section>

      {/* Next Token */}
      <section>
        <NextToken token={nextToken} />
      </section>

      {/* Search + Filters */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchInput search={search} setSearch={setSearch} />
        </div>
        <TokenFilters filter={filter} setFilter={setFilter} />
      </section>

      {/* Token List */}
      <section>
        <TokenList
          tokens={searchedTokens}
          onUpdate={updateToken}
          onDelete={deleteToken}
        />
      </section>
    </div>
  );
}
