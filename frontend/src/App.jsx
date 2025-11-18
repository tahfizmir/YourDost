import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [letterFilter, setLetterFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("https://reqres.in/api/users", {
          headers: {
            "x-api-key": "reqres-free-v1",
          },
        });
        const data = await res.json();
        setUsers(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, sortField, sortOrder, letterFilter]);

  const filteredAndSortedUsers = (() => {
    const term = search.toLowerCase().trim();

    let filtered = users.filter((u) => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      const email = u.email.toLowerCase();

      const matchesSearch =
        term === "" || fullName.includes(term) || email.includes(term);

      let matchesLetter = true;
      if (letterFilter === "a-m") {
        const ch = u.first_name?.[0]?.toLowerCase();
        matchesLetter = ch >= "a" && ch <= "m";
      } else if (letterFilter === "n-z") {
        const ch = u.first_name?.[0]?.toLowerCase();
        matchesLetter = ch >= "n" && ch <= "z";
      }

      return matchesSearch && matchesLetter;
    });

    filtered.sort((a, b) => {
      const valA = String(a[sortField]).toLowerCase();
      const valB = String(b[sortField]).toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  })();

  const totalPages = Math.ceil(
    filteredAndSortedUsers.length / itemsPerPage || 1
  );
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          User Directory Table
        </h1>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white rounded-xl shadow-sm p-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Sort by:</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="px-3 py-1 border-1 text-sm rounded-lg  text-black hover:bg-gray-100 transition"
              >
                <option value="first_name">First Name</option>
                <option value="email">Email</option>
              </select>
            </div>

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="px-3 py-1 border-1 text-sm rounded-lg  text-black hover:bg-gray-100 transition"
            >
              Order: {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">
                Filter by first letter:
              </label>
              <select
                value={letterFilter}
                onChange={(e) => setLetterFilter(e.target.value)}
                className="px-3 py-1 border-1 text-sm rounded-lg  text-black hover:bg-gray-100 transition"
              >
                <option value="all">All</option>
                <option value="a-m">A - M</option>
                <option value="n-z">N - Z</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center mt-10 gap-3">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-gray-600 text-sm">Loading users...</span>
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-red-600 font-medium mt-6">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Avatar
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        First Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Last Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <img
                              src={user.avatar}
                              alt={user.first_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {user.first_name}
                          </td>
                          <td className="px-4 py-3 text-gray-800">
                            {user.last_name}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.email}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                ◀ Prev
              </button>
              <span className="text-sm text-gray-700">
                Page <span className="font-semibold text-gray-900">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages || 1}
                </span>
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
