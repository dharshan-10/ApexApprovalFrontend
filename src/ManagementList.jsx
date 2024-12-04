// src/ManagementList.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import './ManagementList.css'; // Ensure this CSS file is created

const ManagementList = () => {
  const [managements, setManagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagements = async () => {
      try {
        const response = await axios.get('http://localhost:8801/management/show');
        console.log('Fetched data:', response.data); // Debugging line
        setManagements(response.data);
      } catch (err) {
        console.error("Error fetching managements:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagements();
  }, []);

  const handleApproval = async (id, approvalStatus, action) => {
    try {
      await axios.put('http://localhost:8801/management/update', null, {
        params: {
          id,
          approvalStatus
        }
      });

      // Debugging: Confirm that update request was successful
      console.log(`Updated item ${id}: ${approvalStatus}`);

      setManagements(prevManagements =>
        prevManagements.map(management =>
          management.id === id
            ? { ...management, isApproved: approvalStatus, actionStatus: action }
            : management
        )
      );
    } catch (err) {
      console.error("Error updating approval status:", err);
      setError(err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  return (
    <div className="management-list-container">
      <h1>Management List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Application Type</th>
            <th>Location</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Approved By</th>
            <th>Submitted Faculty Name</th>
            <th>Faculty ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managements.map(management => (
            <tr key={management.id}>
              <td>{management.id}</td>
              <td>{management.applicationType}</td>
              <td>{management.location}</td>
              <td>{management.reason}</td>
              <td>{management.amount}</td>
              <td>{management.approvedBy}</td>
              <td>{management.submittedFacultyName}</td>
              <td>{management.facultyId}</td>
              <td>
                {management.isApproved === 0 ? (
                  <>
                    <button onClick={() => handleApproval(management.id, 1, 'Approved')}>Approve</button>
                    <button onClick={() => handleApproval(management.id, -1, 'Rejected')}>Reject</button>
                  </>
                ) : (
                  <span>{management.actionStatus || 'Action Done'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementList;
