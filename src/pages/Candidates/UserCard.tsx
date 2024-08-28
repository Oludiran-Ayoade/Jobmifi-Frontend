import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';

interface UserCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  specialization: string;
  email: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId, firstName, lastName, profilePicture, specialization, email }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/candidates/profile/${userId}`);    
  };

  const handleContactClick = () => {
    const subject = encodeURIComponent(`Hello ${firstName}, let's connect on JobMifi!`);
    const body = encodeURIComponent(`Hi ${firstName} 
        ${lastName},\n\nI would like to discuss opportunities related to ${specialization}. 
        Looking forward to your response.\n\nBest regards`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="custom-user-card">
      <div onClick={handleCardClick} className="card-clickable-area">
        <div className="custom-profile-picture-container">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={`${firstName} ${lastName}`} 
              className="custom-profile-picture" 
            />
          ) : (
            <FaUserAlt className="custom-default-profile-icon" />
          )}
        </div>
        <div className="custom-user-info">
          <h3>{`${firstName} ${lastName}`}</h3>
          <h6>{specialization}</h6>
        </div>
      </div>
      <button 
        className="custom-contact-btn" 
        onClick={handleContactClick}
      >
        Contact
      </button>
    </div>
  );
};

export default UserCard;
