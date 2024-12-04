import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { username } = useParams(); // Get username from URL
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8801/dashboard/show?username=${encodeURIComponent(username)}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return <div className="loading">Loading...</div>;

  // Check if the error indicates unauthorized access
  if (error) {
    const isUnauthorized = error.message.includes("Invalid table name");
    return (
      <div className="error">
        {isUnauthorized ? "You are Not an Authorized User" : `Error: ${error.message}`}
      </div>
    );
  }

  const handleAddRequestClick = () => {
    navigate(`/user/${username}`);
  };

  // Function to get the approval status class
  const getApprovalClass = (status) => {
    switch (status) {
      case 1:
        return 'approved'; // Green
      case 0:
        return 'inprogress'; // Yellow
      case -1:
        return 'rejected'; // Red
      default:
        return ''; // No class for unexpected values
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{data.name}'s Dashboard</h2>
      <button className="add-request-button" onClick={handleAddRequestClick}>
        Add Request
      </button>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Application Type</th>
            <th>Location</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Submit To</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.applicationType}</td>
              <td>{item.location}</td>
              <td>{item.reason}</td>
              <td>{item.amount}</td>
              <td>{item.submitTo}</td>
              <td className={getApprovalClass(item.isApproved)}>
                {item.isApproved === 1 ? 'Approved' : item.isApproved === 0 ? 'InProgress' : 'Rejected'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
