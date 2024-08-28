import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import axios from 'axios';

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { auth } = useAuth();
  const { user } = auth;
  const email = user?.email || '';
//   console.log(email);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

     // Ensure new password and confirm password match before submitting
     if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setError(null);
    setSuccessMessage(null);

    const updatedFormData = { ...formData, email: email };
    try {
      const response = await axios.post('http://localhost:3000/api/users/change-password', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccessMessage(response.data.message);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      // setError(error.message);
    }
  };

  return (
    <div className='change_password'>
      {/* {error && <div className="error">{error}</div>} */}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Password</label><br />
          <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required />
        </div>
        <div>
          <label>New Password</label><br />
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password</label><br />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          {error && formData.confirmPassword && <div style={{ color: 'red' }}>{error}</div>}
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
