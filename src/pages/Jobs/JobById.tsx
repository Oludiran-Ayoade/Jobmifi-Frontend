import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import CoverLetterModal from './CoverLetterModal';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/useAuth';

interface Company {
  name: string;
  logo: string;
  location: string;
}

interface Job {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  type: string;
  company: Company;
  qualifications: string[];
  skillsRequired: string[];
  jobResponsibilities: string[];
  salaryRange: string;
}

const JobDetail: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { jobId } = useParams<{ jobId: string }>();
  const { auth } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = auth;
  const userId = user?._id || '';

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/jobsbyid/${jobId}`);
        const jobData = response.data.job;
        if (jobData) {
          setJob(jobData);
        } else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid data format', life: 3000 });
          // throw new Error('Invalid data format');
        }
      } catch (error) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error fetching job details.', life: 3000 });
        // setError('Error fetching job details.');
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApplyClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 

    if (user?.role === 2) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'You cannot apply for a role as an admin.', life: 3000 });
      return;
    }

    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async (coverLetter: string) => {
    if (!job) return;

    try {
      await axios.post('http://localhost:3000/api/users/application/jobs', {
        jobId: job._id,
        coverLetter,
        userId
      });
      setShowModal(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail:'Application submitted successfully', life: 2000 });
      // alert('Application submitted successfully');
    } catch (error:any) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
        // console.log(error);
        
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to submit application, you have already applied for this job', life: 3000 });
        // alert('Failed to submit application');
        // console.log(error);
        
      }
    }
  };

  // if (error) {
  //   return <div>{error}</div>;
  // }

  if (!job) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }

  return (
    <>
    <Toast ref={toast}  className="custom-toast"/>
    <Container className="job-detail-container mb-5">
      <Row>
        <Col className="job-detail-content">
          <h1>{job.title}</h1>
          <h2 className="text-muted">{job.category}</h2>
          <div className="company-details">
            <img src={job.company.logo} alt={`${job.company.name} logo`} className="company-logo" />
            <div>
              <h2>{job.company.name}</h2>
              <p>{job.company.location}</p>
            </div>
          </div>
          <p className="job-description">{job.description}</p>
          <h3>Job Responsibilities</h3>
          <ul>
            {job.jobResponsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
          <h3>Skills Required</h3>
          <ul>
            {job.skillsRequired.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          <h3>Qualifications</h3>
          <ul>
            {job.qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
          <p><strong>Job Type:</strong> {job.type}</p>
          <p><strong>Salary Range:</strong> ${parseInt(job.salaryRange).toLocaleString()}</p>
          <Button variant="primary" onClick={handleApplyClick}>Apply</Button>
        </Col>
      </Row>
      {job && (
        <CoverLetterModal
          show={showModal}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
        />
      )}
    </Container>
    </>
  );
};

export default JobDetail;
