import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Spinner } from 'react-bootstrap';

type Company = {
  _id: string;
  name: any;
  coverImage: string;
  about: string;
  founded: string;
  logo: any;
  size: number;
  pictures: string[];
  category: string;
  location: string;
};

type Job = {
  _id: string;
  title: string;
  category: string;
  description: string;
  type: string;
  qualifications: string;
  skillsRequired: string;
  jobResponsibilities: string;
  salaryRange: string;
  companyId: Company;
  company: any;
};

const ViewJob: React.FC = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const { auth } = useAuth();
  const { token } = auth;

  useEffect(() => {
    const fetchJob = async () => {
      try {   
        const response = await axios.get(`http://localhost:3000/api/users/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch job details');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  if (loading) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!job) {
    return <div>No job found</div>;
  }

  return (
    <div className='job-details'>
      <div className='companydetails'>
        <img src={job.company.logo} alt="Logo" className="company-logo" />
        <h1>{job.company.name}</h1> 
        <div style={{marginTop: '20px'}}>
        <p><strong>Location:</strong> {job.company.location}</p>
        <p><strong>About:</strong> {job.company.about}</p>
        </div>
      </div>
      <div className='job-info'>
        <h2>{job.title}</h2>
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Qualifications:</strong> {job.qualifications}</p>
        <p><strong>Skills Required:</strong> {job.skillsRequired}</p>
        <p><strong>Job Responsibilities:</strong> {job.jobResponsibilities}</p>
        <p><strong>Salary Range: </strong> ${parseInt(job.salaryRange).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ViewJob;
