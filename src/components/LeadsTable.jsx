import React, { useEffect, useState, useCallback } from "react";
import { getLeads } from "../services/api";
import { format } from "date-fns";
import debounce from "lodash.debounce"; 

const LeadsTable = ({ onEdit, onDelete, reloadTable }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchName, setSearchName] = useState("");

  /**
   * Fetch leads when sorting, filtering, or search changes.
   */
  useEffect(() => {
    setIsLoading(true);

    // Build filters dynamically
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
	if (priorityFilter) filters.priority = priorityFilter;
    if (searchName.trim() !== "") filters.name = searchName;

    console.log("Fetching leads with:", { sortBy, order, filters });

    getLeads(sortBy, order, filters)
      .then((response) => {
        console.log("API Response:", response.data); // ✅ Log API response
        setLeads(response.data);
      })
      .catch(() => setErrorMessage("Failed to load leads. Please try again later."))
      .finally(() => setIsLoading(false));
  }, [reloadTable, sortBy, order, statusFilter, priorityFilter, searchName]);

  /**
   * Debounced function to set `searchName` state after user stops typing.
   */
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchName(value);
    }, 800),
    [setSearchName]
  );

  /**
   * Handle search input change.
   */
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  if (isLoading) {
    return <p>Loading leads...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads</h1>

      {/* Search Bar & Sorting Controls */}
      <div className="mb-4 flex space-x-4">
        {/* Search Input for Name */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchInput} 
          onChange={handleSearchChange}
          className="border rounded px-2 py-1"
        />

        {/* Sort By Dropdown */}
        <label className="block">
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="createdAt">Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="status">Status</option>
			<option value="priority">Priority</option>

          </select>
        </label>

        {/* Order Dropdown */}
        <label className="block">
          Order:
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        {/* Status Filter Dropdown */}
        <label className="block">
          Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Closed">Closed</option>
          </select>
        </label>
		{/* Priority Filter Dropdown */}
		<label className="block">
          Priority:
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            
          </select>
        </label>
      </div>
		
		
		
		
      {/* Error message */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Leads Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
			<th className="border border-gray-300 px-4 py-2">Priority</th>
            <th className="border border-gray-300 px-4 py-2">Notes</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-gray-500">
                No leads found.
              </td>
            </tr>
          ) : (
            leads.map((lead) => {
              console.log("Rendering lead:", lead); // ✅ Debugging log
              return (
                <tr key={lead.id}>
                  
                  <td className="border border-gray-300 px-4 py-2">{lead.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.status}</td>
				  <td className="border border-gray-300 px-4 py-2">{lead.priority}</td>
                  <td className="border border-gray-300 px-4 py-2">{lead.notes || "—"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {lead.createdAt ? format(new Date(lead.createdAt), "dd.MM.yyyy") : "—"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => onEdit && onEdit(lead)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={!onEdit}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
