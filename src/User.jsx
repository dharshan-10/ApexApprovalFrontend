import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './User.css'; // Ensure this CSS file is created for styling

const User = ({ username }) => {
  const [applicationType, setApplicationType] = useState('');
  const [submitTo, setSubmitTo] = useState('');
  const [formData, setFormData] = useState({
    reason: '',
    location: '',
    name: '', // The name field will be used for both name and submittedFacultyName
    facultyId: '',
    amount: 0
  });
  const [formVisible, setFormVisible] = useState(false);
  const [showSubmitTo, setShowSubmitTo] = useState(false);

  const handleApplicationTypeChange = (e) => {
    const type = e.target.value;
    setApplicationType(type);
    setShowSubmitTo(true); // Show the Submit To dropdown
  };

  const handleSubmitToChange = (e) => {
    setSubmitTo(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = 'http://localhost:8801/dashboard/add';

    try {
      await axios.post(endpoint, {
        applicationType: applicationType,
        location: formData.location,
        reason: formData.reason,
        amount: formData.amount,
        submittedFacultyName: formData.name, // Set to same as name
        facultyId: formData.facultyId,
        name: formData.name, // Name field
        submitTo: submitTo,
        username: username // Include username in the payload
      });
      alert('Application submitted successfully');
      setFormData({
        reason: '',
        location: '',
        name: '', // Reset name
        facultyId: '',
        amount: 0
      });
      setApplicationType('');
      setSubmitTo('');
      setShowSubmitTo(false);
      setFormVisible(false);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application');
    }
  };

  return (
    <div className="user-container">
      <h1>Application Form</h1>
      {!formVisible ? (
        <>
          <div className="application-type">
            <label>Select Application Type:</label>
            <select onChange={handleApplicationTypeChange} value={applicationType}>
              <option value="">Select...</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Damage">Damage</option>
              <option value="Consumable">Consumable</option>
              <option value="Construction">Construction</option>
              <option value="Scholarship">Scholarship</option>
            </select>
          </div>
          {showSubmitTo && (
            <div className="submit-to">
              <label>Select Submission Target:</label>
              <select onChange={handleSubmitToChange} value={submitTo}>
                <option value="">Select...</option>
                <option value="Principal">Principal</option>
                <option value="Dean">Dean</option>
                <option value="MTeam">MTeam</option>
              </select>
              <button onClick={() => setFormVisible(true)}>Next</button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="reason">Reason:</label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="facultyId">Faculty ID:</label>
            <input
              type="text"
              id="facultyId"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

// Define prop types for the component
User.propTypes = {
  username: PropTypes.string.isRequired // Validate that username is passed as a prop
};

export default User;
