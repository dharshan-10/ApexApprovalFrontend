import { useState } from 'react';
import './Maintenance.css'; // Import CSS file

const Maintenance = () => {
    const initialFormData = {
        facultyName: '',
        facultyId: '',
        area: '',
        reason: '',
        amount: '',
        submitTo: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            reason: formData.reason,
            location: formData.area,
            applicationType: "New Building", // Or derive this from another input if necessary
            facultyId: formData.facultyId,
            submittedFacultyName: formData.facultyName,
            amount: Number(formData.amount)
        };

        const endpointMap = {
            Dean: 'http://localhost:8801/dean/add',
            Principal: 'http://localhost:8801/principal/add',
            MTeam: 'http://localhost:8801/mteam/add'
        };

        const endpoint = endpointMap[formData.submitTo];

        if (!endpoint) {
            console.error("No endpoint found for the selected submitTo value.");
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("Submitted the application successfully");
                setFormData(initialFormData);
            } else {
                console.log("Error while submitting the form");
            }
        } catch (error) {
            console.error("Error while submitting the Form:", error);
        }
    };

    return (
        <div className='container'>
            <div className='form'>
                <label htmlFor="facultyName">Faculty Name:</label>
                <input
                    type="text"
                    id="facultyName"
                    name="facultyName"
                    value={formData.facultyName}
                    onChange={handleChange}
                />
            </div>
            <div className='form'>
                <label htmlFor="facultyId">Faculty ID:</label>
                <input
                    type="text"
                    id="facultyId"
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleChange}
                />
            </div>
            <div className='form'>
                <label htmlFor="area">Maintenance Area:</label>
                <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                />
            </div>
            <div className='form'>
                <label htmlFor="reason">Reason:</label>
                <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                />
            </div>
            <div className='form'>
                <label htmlFor="amount">Amount:</label>
                <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                />
            </div>
            <div className='form'>
                <label htmlFor="submitTo">Submit form to:</label>
                <select
                    id="submitTo"
                    name="submitTo"
                    value={formData.submitTo}
                    onChange={handleChange}
                >
                    <option value="">Select the recipient</option>
                    <option value="Dean">Dean</option>
                    <option value="Principal">Principal</option>
                    <option value="MTeam">Maintenance Team</option>
                </select>
            </div>
            <button className='button' onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Maintenance;
