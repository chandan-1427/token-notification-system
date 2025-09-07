import { useState } from "react";
import { addToken } from "../api/tokenApi";

export default function TokenForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", contact: "", email: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.contact.trim()) {
      return setError("Name and contact are required.");
    }
    if (form.contact.length < 8) {
      return setError("Contact number is too short.");
    }

    try {
      const { data } = await addToken(form);
      onAdd(data);
      setForm({ name: "", contact: "", email: "" });
    } catch (err) {
      console.error("Failed to add token", err);
      setError("Failed to add token. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white shadow-sm rounded-lg flex gap-3 items-center flex-wrap border border-gray-200"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Contact"
        value={form.contact}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        Add
      </button>

      {error && <p className="text-red-500 text-sm mt-2 w-full">{error}</p>}
    </form>
  );
}
