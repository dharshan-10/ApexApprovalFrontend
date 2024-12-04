import axios from 'axios';
import { useEffect, useState } from 'react';
import './PrincipalList.css';

const PrincipalList = () => {
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    facultyId: '',
    name: ''
  });
  const [flashMessage, setFlashMessage] = useState('');

  useEffect(() => {
    const fetchPrincipals = async () => {
      try {
        const response = await axios.get('http://localhost:8801/principal/show');
        console.log('Fetched data:', response.data); // Debugging line
        setPrincipals(response.data);
      } catch (err) {
        console.error("Error fetching principals:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrincipals();
  }, []);

  const handleApproval = async (id, approvalStatus, action) => {
    try {
      // Send a PUT request with URL parameters for id and approvalStatus
      await axios.put('http://localhost:8801/principal/update', null, {
        params: {
          id,
          approvalStatus
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`Updated item ${id}: ${approvalStatus}`);

      // Update the local state to reflect the new approval status and action
      setPrincipals(prevPrincipals =>
        prevPrincipals.map(principal =>
          principal.id === id
            ? { ...principal, isApproved: approvalStatus, actionStatus: action }
            : principal
        )
      );
    } catch (err) {
      console.error("Error updating approval status:", err);
      setError(err);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://localhost:8801/principal/addUser', newUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('User added:', newUser);

      // Fetch updated principals list
      const updatedPrincipals = await axios.get('http://localhost:8801/principal/show');
      setPrincipals(updatedPrincipals.data);

      // Set flash message and reset form
      setFlashMessage(response.data);
      setShowModal(false);
      setNewUser({ email: '', facultyId: '', name: '' });
    } catch (err) {
      console.error("Error adding user:", err);
      setFlashMessage("Error adding user: " + err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  return (
    <div className="principal-list-container">
      <h1>Principals List</h1>
      <button className="add-user-button" onClick={() => setShowModal(true)}>Add User</button>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
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
          {principals.map(principal => (
            <tr key={principal.id}>
              <td>{principal.id}</td>
              <td>{principal.applicationType}</td>
              <td>{principal.location}</td>
              <td>{principal.reason}</td>
              <td>{principal.amount}</td>
              <td className={
                principal.isApproved === 1
                  ? 'approved'
                  : principal.isApproved === -1
                    ? 'rejected'
                    : 'pending'
              }>
                {principal.isApproved === 0
                  ? 'Pending'
                  : (principal.isApproved === 1 ? 'Approved' : 'Rejected')}
              </td>
              <td>
                {principal.isApproved === 0 ? (
                  <>
                    <button onClick={() => handleApproval(principal.id, 1, 'Approved')}>Approve</button>
                    <button onClick={() => handleApproval(principal.id, -1, 'Rejected')}>Reject</button>
                  </>
                ) : (
                  <span>{principal.actionStatus || 'Action Done'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding a user */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Add User</h2>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="facultyId">Faculty ID:</label>
              <input
                type="text"
                id="facultyId"
                name="facultyId"
                value={newUser.facultyId}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
              />
            </div>
            <button className="submit-button" onClick={handleAddUser}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalList;
