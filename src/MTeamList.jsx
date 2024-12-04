import axios from 'axios';
import { useEffect, useState } from 'react';
import './MTeamList.css'; // Ensure this CSS file is created

const MTeamList = () => {
  const [mteams, setMTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8801/mteam/show');
        console.log('Fetched data:', response.data); // Debugging line
        setMTeams(response.data);
      } catch (err) {
        console.error("Error fetching MTeams:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMTeams();
  }, []);

  const handleApproval = async (id, approvalStatus, action) => {
    try {
      await axios.put('http://localhost:8801/mteam/update', null, {
        params: {
          id,
          approvalStatus
        }
      });

      // Debugging: Confirm that update request was successful
      console.log(`Updated item ${id}: ${approvalStatus}`);

      setMTeams(prevMTeams =>
        prevMTeams.map(mteam =>
          mteam.id === id
            ? { ...mteam, isApproved: approvalStatus, actionStatus: action }
            : mteam
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
    <div className="mteam-list-container">
      <h1>MTeam List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Application Type</th>
            <th>Location</th>
            <th>Reason</th>
            <th>Amount</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mteams.map(mteam => (
            <tr key={mteam.id}>
              <td>{mteam.id}</td>
              <td>{mteam.applicationType}</td>
              <td>{mteam.location}</td>
              <td>{mteam.reason}</td>
              <td>{mteam.amount}</td>
              <td className={
                mteam.isApproved === 1
                  ? 'approved'
                  : mteam.isApproved === -1
                    ? 'rejected'
                    : 'pending'
              }>
                {mteam.isApproved === 0
                  ? 'Pending'
                  : (mteam.isApproved === 1 ? 'Approved' : 'Rejected')}
              </td>
              <td>
                {mteam.isApproved === 0 ? (
                  <>
                    <button onClick={() => handleApproval(mteam.id, 1, 'Approved')}>Approve</button>
                    <button onClick={() => handleApproval(mteam.id, -1, 'Rejected')}>Reject</button>
                  </>
                ) : (
                  <span>{mteam.actionStatus || 'Action Done'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MTeamList;
