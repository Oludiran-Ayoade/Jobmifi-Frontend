import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/useAuth';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

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

const SkillersProfile: React.FC = () => {
  const navigate = useNavigate()
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

  const toast = React.useRef<Toast>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<string>('');
  const [newExperience, setNewExperience] = useState<Experience>({ id: '', company: '', role: '', duration: '' });

  useEffect(() => {
    axios.get(`https://jobmifi-backend.onrender.com/api/users/${userId}`)
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
      .catch(() => {
        // console.error("There was an error fetching the profile!", error);
      });
  }, [userId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value }); 
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    if (id) {
      const updatedExperiences = profile.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      );
      setProfile({ ...profile, experiences: updatedExperiences });
    } else {
      setNewExperience({ ...newExperience, [field]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setProfile({ ...profile, [name]: reader.result as string });
      };
    }
  };

  const handleEdit = (field: string) => {
    setEditField(field);
  };

  const handleBlur = () => {
    setEditField(null);
  };

  const handleSubmit = () => {
    axios.post(`https://jobmifi-backend.onrender.com/api/users/${userId}`, profile)
      .then(response => {
        console.log(response.data);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Profile updated successfully!' , life: 2000 });
        // alert('Profile updated successfully!');
         // Delay the navigation by 5 seconds
      setTimeout(() => {
        navigate(`/skillers/profile/${userId}`);
      }, 2000); // 5000 milliseconds = 2 seconds
      })
      .catch(() => {
        // console.error("There was an error updating the profile!", error);
        toast.current?.show({ severity: 'error', summary: 'Success', detail: "There was an error updating the profile!" , life: 2000 });
      });
  };

  const handleAddSkill = () => {
    if (newSkill) {
      setProfile(prevProfile => ({
        ...prevProfile,
        skills: [...prevProfile.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      skills: prevProfile.skills.filter(s => s !== skill),
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.role && newExperience.duration) {
      setProfile(prevProfile => ({
        ...prevProfile,
        experiences: [...prevProfile.experiences, { ...newExperience, id: `${new Date().getTime()}` }],
      }));
      setNewExperience({ id: '', company: '', role: '', duration: '' });
    }
  };

  const handleRemoveExperience = (id: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      experiences: prevProfile.experiences.filter(exp => exp.id !== id),
    }));
  };


  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.text('Profile', 10, 10);
    doc.text(`Name: ${profile.firstName} ${profile.lastName}`, 10, 20);
    doc.text(`About: ${profile.about}`, 10, 30);
    doc.text(`Contact: ${profile.contactMail}`, 10, 40);
    doc.text('Skills:', 10, 50);
    profile.skills.forEach((skill, index) => {
      doc.text(`${index + 1}. ${skill}`, 10, 60 + index * 10);
    });
    doc.text('Experiences:', 10, 100);
    profile.experiences.forEach((exp, index) => {
      doc.text(`${index + 1}. ${exp.company} - ${exp.role} (${exp.duration})`, 10, 110 + index * 10);
    });
    const pdfBlob = doc.output('blob');
    saveAs(pdfBlob, 'profile.pdf');
  };

  // Inline styles for the profile and cover images
  const styles = {
    profilePictureContainer: {
      position: 'relative' as 'relative',
      display: 'inline-block' as 'inline-block',
      cursor: 'pointer',
    },
    profilePicture: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover' as 'cover',
      border: '2px solid #ddd',
    },
    coverImageContainer: {
      position: 'relative' as 'relative',
      display: 'inline-block' as 'inline-block',
      width: '100%',
      maxHeight: '330px',
      overflow: 'hidden' as 'hidden',
      cursor: 'pointer',
    },
    coverImage: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover' as 'cover',
      borderRadius: '5px',
    },
    editIcon: {
      position: 'absolute' as 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      padding: '5px',
      boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
    },
    placeholder: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '50px',
      color: '#fff',
      border: '2px solid #ddd',
      cursor: 'pointer',
    },
    coverPlaceholder: {
      width: '100%',
      maxHeight: '200px',
      backgroundColor: '#ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: '#fff',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <>
    <Toast ref={toast}  className="custom-toast"/>
    <div className="profile-container">
      <button onClick={handleSubmit} className='btn btn-primary' style={{background: '#002745'}}>Done</button>
      <h2>{profile.firstName} {profile.lastName}'s Profile</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div  style={styles.profilePictureContainer}>
          <label>Profile Picture</label>
          {profile.profilePicture ? (
            <div>
              <img src={profile.profilePicture} alt="Profile" className="profile-picture" style={styles.profilePicture} />
              <FaPen onClick={() => document.getElementById('profilePicture')?.click()} style={styles.editIcon} className="edit-icon" />
              <input id="profilePicture" type="file" name="profilePicture" onChange={handleFileChange} hidden />
            </div>
          ) : (
            <div className="placeholder" style={styles.placeholder} onClick={() => document.getElementById('profilePicture')?.click()}>
              {profile.firstName.charAt(0)}
              <FaPen className="edit-icon" style={styles.editIcon} />
              <input id="profilePicture" type="file" name="profilePicture" onChange={handleFileChange} hidden />
            </div>
          )}
        </div>
        <div className="cover-image-container" style={styles.coverImageContainer}>
          <label>Cover Image</label>
          {profile.coverImage ? (
            <div>
              <img src={profile.coverImage}  style={styles.coverImage} alt="Cover" className="cover-image" />
              <FaPen style={styles.editIcon} onClick={() => document.getElementById('coverImage')?.click()} className="edit-icon" />
              <input id="coverImage" type="file" name="coverImage" onChange={handleFileChange} hidden />
            </div>
          ) : (
            <div className="cover-placeholder" onClick={() => document.getElementById('coverImage')?.click()}>
              <FaPen style={styles.editIcon} className="edit-icon" />
              <input id="coverImage" type="file" name="coverImage" onChange={handleFileChange} hidden />
            </div>
          )}
        </div>
        <div className="about-container">
          <label>About</label>
          {editField === 'about' ? (
            <textarea name="about" value={profile.about} onChange={handleInputChange} onBlur={handleBlur} />
          ) : (
            <div onClick={() => handleEdit('about')}>
              <p>{profile.about}</p>
              <FaPen style={{  bottom: '10px',
                               right: '10px',
                               backgroundColor: '#fff',
                               borderRadius: '50%',
                               padding: '5px',
                               boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)'}} 
                               className="edit-icon" />
            </div>
          )}
        </div>
        <div className="contact-mail-container">
          <label>Contact Mail</label>
          {editField === 'contactMail' ? (
            <input type="email" name="contactMail" value={profile.contactMail} onChange={handleInputChange} onBlur={handleBlur} />
          ) : (
            <div onClick={() => handleEdit('contactMail')}>
              <p>{profile.contactMail}</p>
              <FaPen  style={{  bottom: '10px',
                               right: '10px',
                               backgroundColor: '#fff',
                               borderRadius: '50%',
                               padding: '5px',
                               boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)'}} 
                               className="edit-icon" />
            </div>
          )}
        </div>
        <div className="specialization-container">
          <label>Specialization</label>
          <select name="specialization" value={profile.specialization} onChange={handleInputChange}>
            <option value="">Select your specialization</option>
            <option value="Business Development">Business Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Project Management">Project Management</option>
            <option value="Health Care">Health Care</option>
          </select>
        </div>
        <div className="skills-container">
          <label>Skills</label>
          <ul>
            {profile.skills.map((skill, index) => (
              <li key={index}>
                {skill}
                <FaTrash onClick={() => handleRemoveSkill(skill)} className="remove-icon" />
              </li>
            ))}
          </ul>
          <div className="add-skill">
            <input
              type="text"
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="button" style={{ border: 'none'}} onClick={handleAddSkill}>
            <FaPlus style={{ color: '#002745', fontSize: '20px',margin: '10px', cursor: 'pointer', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  }} />
            </button>
          </div>
        </div>
        <div className="cv-upload-container">
          {/* <label>CV Upload</label>
          <input type="file" name="cv" onChange={handleFileChange} /> */}
          {profile.cv && (
            <div>
              {/* <button type="button" onClick={handleDownloadCv}>Download CV</button> */}
              <button type="button" onClick={handleGeneratePdf} style={{background: '#002745'}} className='btn btn-primary'>Generate PDF</button>
            </div>
          )}
        </div>
        <div className="experiences-container">
          <label>Experiences</label>
          {profile.experiences.map((experience) => (
            <div key={experience.id} className="experience-item">
              <div className="experience-details">
                <h3>{experience.role}</h3>
                <p>{experience.company}</p>
                <p>{experience.duration}</p>
              </div>
              <FaTrash onClick={() => handleRemoveExperience(experience.id)} className="remove-icon" />
            </div>
          ))}
          <div className="add-experience">
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) => handleExperienceChange('', 'company', e.target.value)}
              placeholder="Company"
            />
            <input
              type="text"
              value={newExperience.role}
              onChange={(e) => handleExperienceChange('', 'role', e.target.value)}
              placeholder="Role"
            />
            <input
              type="text"
              value={newExperience.duration}
              onChange={(e) => handleExperienceChange('', 'duration', e.target.value)}
              placeholder="Duration"
            />
            <button type="button" onClick={handleAddExperience}>
              <FaPlus />
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
};

export default SkillersProfile;
