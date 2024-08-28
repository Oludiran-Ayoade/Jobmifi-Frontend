import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Spinner } from 'react-bootstrap';
import { Toast } from 'primereact/toast';

type Company = {
  _id: string;
  name: string;
  coverImage: string;
  about: string;
  founded: string;
  logo: string;
  size: number;
  pictures: string[];
  category: string;
  location: string;
};

const CreateJob: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { auth } = useAuth();
  const { user, token } = auth;
  const { companyId } = useParams<{ companyId: string }>();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId || '');
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'Business Development',
    description: '',
    type: 'full-time',
    qualifications: [''],
    skillsRequired: [''],
    jobResponsibilities: [''],
    salaryRange: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`https://jobmifi-backend.onrender.com/api/users/getcompany/${user?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.data);
      } catch (error) {
        console.error('Failed to fetch company data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user?._id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleArrayChange = (index: number, field: string, value: string) => {
    setJobForm(prevForm => {
      const updatedArray = [...prevForm[field as keyof typeof jobForm]];
      updatedArray[index] = value;
      return { ...prevForm, [field]: updatedArray };
    });
  };

  const addField = (field: string) => {
    setJobForm(prevForm => ({
      ...prevForm,
      [field]: [...prevForm[field as keyof typeof jobForm], '']
    }));
  };

  const removeField = (index: number, field: string) => {
    setJobForm(prevForm => {
      const updatedArray = [...prevForm[field as keyof typeof jobForm]];
      updatedArray.splice(index, 1);
      return { ...prevForm, [field]: updatedArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`https://jobmifi-backend.onrender.com/api/users/post/jobs`, {
        ...jobForm,
        companyId: selectedCompanyId,
        userId: user?._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Job created successfully', life: 2000 });
      setJobForm({
        title: '',
        category: 'Business Development',
        description: '',
        type: 'full-time',
        qualifications: [''],
        skillsRequired: [''],
        jobResponsibilities: [''],
        salaryRange: '',
      });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create job', life: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: '#002745' }} role="status" />
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <div className="create-job-container">
        <div className="company-selection">
          <h2>Select Company</h2>
          <select value={selectedCompanyId} onChange={(e) => setSelectedCompanyId(e.target.value)} required>
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>{company.name}</option>
            ))}
          </select>
        </div>

        {selectedCompanyId && (
          <div className="company-details">
            <div style={{ marginLeft: '250px' }}>
              <h2 style={{ marginTop: '-10px' }}>{companies.find(company => company._id === selectedCompanyId)?.name}</h2>
              <p><strong>Location:</strong> {companies.find(company => company._id === selectedCompanyId)?.location}</p>
              <p>
                <img 
                  src={companies.find(company => company._id === selectedCompanyId)?.logo} 
                  alt="Logo" 
                  className="company-logo"
                  style={{
                    position: 'relative',
                    width: '150px',
                    height: 'auto',
                    marginTop: '-190px',
                    marginLeft: '-1200px',
                    marginBottom: '40px'
                  }} 
                />
              </p>
            </div>
          </div>
        )}

        <div className="job-creation-form">
          <h2>Create Job</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="title" value={jobForm.title} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="category">Job Category</label>
              <select id="category" name="category" value={jobForm.category} onChange={handleInputChange} required>
                <option value="Business Development">Business Development</option>
                <option value="Construction">Construction</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Finance">Finance</option>
                <option value="Health Care">Health Care</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing and Communication">Marketing and Communication</option>
                <option value="Software Development">Software Development</option>
                <option value="Project Management">Project Management</option>
              </select>
            </div>

            <div className="form-group">
              <label>Job Description</label>
              <textarea name="description" value={jobForm.description} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="type">Job Type</label>
              <select id="type" name="type" value={jobForm.type} onChange={handleInputChange} required>
                <option value="full-time">Full Time</option>
                <option value="hybrid">Hybrid</option>
                <option value="part-time">Part Time</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label>Qualifications</label>
              {jobForm.qualifications.map((qualification, index) => (
                <div key={index} className="array-input">
                  <textarea 
                    value={qualification} 
                    onChange={(e) => handleArrayChange(index, 'qualifications', e.target.value)} 
                    required 
                  />
                  {jobForm.qualifications.length > 1 && (
                    <button type="button" className='btn btn-danger mb-1' onClick={() => removeField(index, 'qualifications')}>Remove</button>
                  )}
                </div>
              ))}
              <button type="button" className='btn btn-success' onClick={() => addField('qualifications')}>Add More Qualifications</button>
            </div>

            <div className="form-group">
              <label>Skills Required</label>
              {jobForm.skillsRequired.map((skill, index) => (
                <div key={index} className="array-input">
                  <textarea 
                    value={skill} 
                    onChange={(e) => handleArrayChange(index, 'skillsRequired', e.target.value)} 
                    required 
                  />
                  {jobForm.skillsRequired.length > 1 && (
                    <button type="button" className='btn btn-danger mb-1' onClick={() => removeField(index, 'skillsRequired')}>Remove</button>
                  )}
                </div>
              ))}
              <button type="button" className='btn btn-success' onClick={() => addField('skillsRequired')}>Add More Skills</button>
            </div>

            <div className="form-group">
              <label>Job Responsibilities</label>
              {jobForm.jobResponsibilities.map((responsibility, index) => (
                <div key={index} className="array-input">
                  <textarea 
                    value={responsibility} 
                    onChange={(e) => handleArrayChange(index, 'jobResponsibilities', e.target.value)} 
                    required 
                  />
                  {jobForm.jobResponsibilities.length > 1 && (
                    <button type="button" className='btn btn-danger mb-1' onClick={() => removeField(index, 'jobResponsibilities')}>Remove</button>
                  )}
                </div>
              ))}
              <button type="button" className='btn btn-success' onClick={() => addField('jobResponsibilities')}>Add More Responsibilities</button>
            </div>

            <div className="form-group">
              <label>Salary Range</label>
              <input type="text" name="salaryRange" value={jobForm.salaryRange} onChange={handleInputChange} required />
            </div>

            <button type="submit" className="submit-button mt-1">Submit Job</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateJob;
