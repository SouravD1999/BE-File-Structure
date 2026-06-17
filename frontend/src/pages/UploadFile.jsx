import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../App';

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // Field name matches upload.single('image')

    try {
      const response = await axios.post('http://localhost:3000/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });
      setMessage(`Success! Saved as: ${response.data.fileName}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'File validation error');
    }
  };

  return (
    <div>
      <h2>Secure Media Processing</h2>
      <form onSubmit={handleUpload} className="crud-form">
        <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" required />
        <button type="submit">Upload Asset to Server</button>
      </form>
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}