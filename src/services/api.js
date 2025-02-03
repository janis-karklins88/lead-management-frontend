import axios from "axios";

const API_URL = "http://localhost:8080/api";

// ✅ Helper function to get token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};



export const getLeads = (sortBy = "createdAt", order = "desc", filters = {}) => {
  const params = new URLSearchParams();
  params.append("sortBy", sortBy);
  params.append("order", order);

  // Add filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value); // Only add non-empty filters
  });

  console.log("Sending API request with params:", params.toString()); // 🔍 Debugging Log

  return axios.get(`http://localhost:8080/api/leads/leads?${params.toString()}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


// ✅ Create lead (now includes JWT token)
export const createLead = (leadData) => {
  return axios.post(`${API_URL}/leads`, leadData, { headers: getAuthHeader() });
};

// ✅ Update lead (now includes JWT token)
export const updateLead = (leadData) => {
  console.log("Updating lead:", leadData); // Debugging log
  return axios.put(`http://localhost:8080/api/leads`, leadData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


// ✅ Delete lead (now includes JWT token)
export const deleteLead = (id) => {
  return axios.delete(`${API_URL}/leads/${id}`, { headers: getAuthHeader() });
};
