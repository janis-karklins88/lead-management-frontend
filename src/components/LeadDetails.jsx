import React, { useEffect, useState } from "react";
import { getActivities, addActivity, deleteActivity } from "../services/api";

const LeadDetails = ({ lead, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ description: "", type: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch activities when component mounts
  useEffect(() => {
    fetchActivities();
  }, [lead.id]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities(lead.id);
      setActivities(response.data);
    } catch (err) {
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    try {
      if (!newActivity.description || !newActivity.type || !newActivity.date) {
        setError("Please fill in all fields.");
        return;
      }

      const formattedDate = newActivity.date.includes('T')
        ? newActivity.date
        : `${newActivity.date}T00:00:00`;

      await addActivity(lead.id, { ...newActivity, date: formattedDate });

      setNewActivity({ description: "", type: "", date: "" });
      fetchActivities();
    } catch (err) {
      setError("Failed to add activity.");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(activityId);
      fetchActivities();
    } catch (err) {
      setError("Failed to delete activity.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">X</button>
        <h2 className="text-xl font-bold mb-4">Lead Details: {lead.name}</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {loading ? (
          <p>Loading activities...</p>
        ) : (
          <ul className="mb-4">
            {activities.map((activity) => (
              <li key={activity.id} className="border p-2 mb-2 flex justify-between items-center">
                <div>
                  <p>{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.type} - {activity.date}</p>
                </div>
                <button onClick={() => handleDeleteActivity(activity.id)} className="text-red-500">Delete</button>
              </li>
            ))}
          </ul>
        )}

        {/* Adding activity inputs */}
        <h3 className="font-bold mb-2">Add Activity</h3>
        <input
          type="text"
          placeholder="Description"
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
          className="border rounded px-2 py-1 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Type"
          value={newActivity.type}
          onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
          className="border rounded px-2 py-1 mb-2 w-full"
        />
        <input
          type="datetime-local"
          name="date"
          value={newActivity.date}
          onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
          className="border rounded px-2 py-1 w-full mb-2"
        />

        <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Add Activity</button>
      </div>
    </div>
  );
};

export default LeadDetails;
