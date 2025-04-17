import React, { useState } from 'react';
import axios from 'axios';
import './JobPostModal.css'; // Optional: For styling the modal
import { backendurl } from '../../url';
import Button from '../buttons/Button';
function JobPostModal({ onClose }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    cities: '',
    country: '',
    salary: '',
    tags: '',
  });
 
  const [status, setStatus] = useState(null); // To display submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePost = async () => {
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      cities: formData.cities.split(',').map((city) => city.trim()),
    };

    try {
        console.log("job post payload",payload)
      const response = await axios.post(`${backendurl}/jobs`, payload);
    //   console.log("response",response)
      setStatus('Job posted successfully!');
      // Optionally, reset the form or close the modal
    } catch (error) {
      console.error('Error posting job:', error);
      setStatus('Failed to post job.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Post a Job</h2>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Cities</label>
          <input
            type="text"
            name="cities"
            value={formData.cities}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        <Button handler={handlePost} label={"Post Job"}/>
        {/* <button className="post-button" onClick={handlePost}>
          Post Job
        </button> */}
        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
}

export default JobPostModal;
