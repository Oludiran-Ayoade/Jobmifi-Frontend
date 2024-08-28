import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

interface Experience {
  company: string;
  role: string;
  duration: string;
}

interface Profile {
  userId: {
    firstName: string;
    lastName: string;
  };
  about: string;
  contactMail: string;
  skills: string[];
  profilePicture: string | null;
  coverImage: string | null;
  experiences: Experience[];
  cv: string | null;
  specialization: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    axios.get(`https://jobmifi-backend.onrender.com/api/users/profilecard/allusers/${id}`)
      .then(response => {
        setProfile(response.data);
        // console.log(response.data); 
      })
      .catch(() => {
        // console.error('Error fetching profile:', error);
      });
  }, [id]);

  if (!profile) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }

  return (
    <div className="profile-container" style={{ paddingTop: '100px', marginBottom: '15px' }}>
      {/* Cover Image */}
      {profile.coverImage && (
        <div className="cover-image-container" style={{
          width: '100%',
          height: '250px',
          overflow: 'hidden',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <img src={profile.coverImage} alt="Cover" style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover'
          }} />
        </div>
      )}

      <div className="" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt={`${profile.userId.firstName} ${profile.userId.lastName}`}
            className=""
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '5px solid #fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
        ) : (
          <div
            className="placeholder"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              color: '#fff',
              border: '5px solid #fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {profile.userId.firstName.charAt(0)}
          </div>
        )}
      </div>

      <h2 style={{ textAlign: 'center' }}>{`${profile.userId.firstName} ${profile.userId.lastName}`}</h2>
      <p style={{ textAlign: 'center' }}>
        <strong>Specialization:</strong> {profile.specialization || 'No specialization provided'}
      </p>
      <p style={{ textAlign: 'center' }}>
        <strong>About:</strong> {profile.about || 'No description provided'}
      </p>
      <p style={{ textAlign: 'center' }}>
        <strong>Contact Mail:</strong> {profile.contactMail || 'No contact mail provided'}
      </p>
      
      <div>
        <h3>Skills:</h3>
        {profile.skills.length > 0 ? (
          <ul>
            {profile.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills provided</p>
        )}
      </div>
      
      <div>
        <h3>Experiences:</h3>
        {profile.experiences.length > 0 ? (
          profile.experiences.map((experience, index) => (
            <div key={index} className="experience-item">
              <h4>{experience.role || 'No role provided'}</h4>
              <p>{experience.company || 'No company provided'}</p>
              <p>{experience.duration || 'No duration provided'}</p>
            </div>
          ))
        ) : (
          <p>No experiences provided</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
