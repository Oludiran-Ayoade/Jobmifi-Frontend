import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
}

interface Profile {
  userId: string;
  firstName: string;
  lastName: string;
  about: string;
  contactMail: string;
  skills: string[];
  profilePicture: string | null;
  coverImage: string | null;
  experiences: Experience[];
  cv: string | null;
  specialization: string;
}

const SkillerProfile: React.FC = () => {
  const location = useLocation();
  const { role } = location.state || {};
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';

  const [profile, setProfile] = useState<Profile>({
    userId: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    about: '',
    contactMail: '',
    skills: [],
    profilePicture: null,
    coverImage: null,
    experiences: [],
    cv: null,
    specialization: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/users/${userId}`)
      .then(response => {
        const { user, profile } = response.data;
        setProfile(prevProfile => ({
          ...prevProfile,
          userId: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          ...(profile && profile),
        }));
      })
      .catch(error => {
        console.error("There was an error fetching the profile!", error);
      });
  }, [userId]);

  const handleEditClick = () => {
    navigate(`/skillers/updateprofile/${userId}`);
  };

  return (
    <div className="profile-container">
        {role !== 'employer' && (
                <button className='btn btn-primary ms-5 mb-1' style={{background: '#002745'}} onClick={handleEditClick}>
                    Edit
                </button>
            )}
      {/* <button className='btn btn-primary ms-5 mb-1' onClick={handleEditClick}>Edit</button> */}
      <div className="cover-image-container">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="cover-image" />
        ) : (
          <div className="cover-placeholder">
            Cover Image
          </div>
        )}
        <div className="profile-picture-container">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            <div className="placeholder">
              {profile.firstName.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <h2>{profile.firstName} {profile.lastName}'s Profile</h2>
      <div className="about-container">
        <label> <b>About</b></label>
        <p>{profile.about}</p>
      </div>
      <div className="contact-mail-container">
        <label> <b>Contact Mail</b></label>
        <p>{profile.contactMail}</p>
      </div>
      <div className="specialization-container">
        <label><b>Specialization</b></label>
        <p>{profile.specialization}</p>
      </div>
      <div className="skills-container">
        <label><b>Skills</b></label>
        <ul>
          {profile.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div className="experiences-container">
        <label> <h3>Experience</h3></label>
        {profile.experiences.map((experience) => (
          <div key={experience.id} className="experience-item">
            <div className="experience-details">
              <h3>{experience.role}</h3>
              <p>{experience.company}</p>
              <p>{experience.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillerProfile;
