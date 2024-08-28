import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplicationStatus } from '../../context/statusContext';
import { useAuth } from '../../context/useAuth';

interface Job {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  type: string;
  company: {
    name: string;
    logo: string;
  };
  qualifications: string[];
  skillsRequired: string[];
  jobResponsibilities: string[];
  salaryRange: string;
}

interface Application {
  _id: string;
  coverLetter: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  job: Job;
}

const JobDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>(); // Get jobId from URL params
  const [loading, setLoading] = useState<boolean>(true);
  const [application, setApplication] = useState<Application | null>(null);
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';
  const { status } = useApplicationStatus();

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/applications/user/${userId}`);
        
        const fetchedApplications: Application[] = response.data.applications;
        const matchingApplication = fetchedApplications.find(app => app.job._id === jobId);
        
        if (matchingApplication) {
          setApplication(matchingApplication);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [userId, jobId]);

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/employer/delete-application/${applicationId}`);
      setApplication(null);
      navigate('/skillers/applications');
    } catch (error) {
      console.error('Error withdrawing application:', error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted':
        return { color: 'green', backgroundColor: 'green' };
      case 'rejected':
        return { color: 'red', backgroundColor: 'red' };
      case 'pending':
      default:
        return { color: 'grey', backgroundColor: 'grey' };
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  if (loading) {
    return <div className="text-center" style={{ paddingTop: '150px' }}><Spinner animation="border" style={{ color: '#002745' }} role="status" /></div>;
  }

  if (!application) {
    return <div>No application found for this job.</div>;
  }

  return (
    <div style={{ paddingTop: '10px', padding: '20px' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
        <h1>{application.job.title}</h1>
        <h5>Category: {application.job.category}</h5>
        <h2>{application.job.company.name}</h2>
        <img 
          src={application.job.company.logo} 
          alt={`${application.job.company.name} logo`} 
          style={{ width: '100px' }} 
        />
        <p><strong>Location:</strong> {application.job.location}</p>
        <p><strong>Salary Range:</strong> ${parseInt(application.job.salaryRange).toLocaleString()}</p>
        <p><strong>Description:</strong> {application.job.description}</p>

        <h3>Job Responsibilities</h3>
        <ul>
          {application.job.jobResponsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>

        <h3>Skills Required</h3>
        <ul>
          {application.job.skillsRequired.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>

        <h3>Qualifications</h3>
        <ul>
          {application.job.qualifications.map((qualification, index) => (
            <li key={index}>{qualification}</li>
          ))}
        </ul>

        <div style={{ display: 'flex' }}>
          <strong>Status: </strong>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}>
            <div 
              style={{
                width: '15px', 
                height: '15px', 
                borderRadius: '50%', 
                backgroundColor: getStatusStyle(application.status).backgroundColor, 
                display: 'inline-block', 
                marginRight: '1px'
              }} 
            />
            {capitalizeFirstLetter(status[application._id] || application.status)}
          </div>
        </div>
        <Button 
          className='btn btn-danger' 
          onClick={() => handleWithdrawApplication(application._id)}>
          Withdraw Application
        </Button>
      </div>
    </div>
  );
};

export default JobDetailPage;
