import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row, Spinner, Button } from 'react-bootstrap';
import { useAuth } from '../../context/useAuth';
import { Toast } from 'primereact/toast';
import CoverLetterModal from './CoverLetterModal';

interface Job {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  type: string;
  salaryRange: string;
  company: {
    name: string;
    logo: string;
  };
}

const AllJobsComponent: React.FC = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { user } = auth;
  const userId = user?._id || '';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/alljobs/jobs');
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (error: any) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch jobs.', life: 2000 });
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApplyClick = (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (user?.role === 2) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'You cannot apply for a role as an admin.', life: 3000 });
      return;
    }

    if (!user) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please Sign-in to Apply.', life: 3000 });
      return;
    }

    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedJobId(null);
  };

  const handleModalSubmit = async (coverLetter: string) => {
    if (!selectedJobId) return;

    try {
      await axios.post('http://localhost:3000/api/users/application/jobs', {
        jobId: selectedJobId,
        coverLetter,
        userId
      });
      setShowModal(false);
      setSelectedJobId(null);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Application submitted successfully', life: 2000 });
    } catch (error:any) {
      if (error.response.status === 400) {
        // alert(error.response.data.message);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 });
        
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to submit application', life: 3000 });
        
      }
    }
  };

  const handleCardClick = (jobId: string) => {
    navigate(`/jobs-details/${jobId}`);
  };

  if (loading) {
    return <div className="text-center" style={{ paddingTop: '150px' }}><Spinner animation="border" style={{ color: '#002745' }} role="status"></Spinner></div>;
  }

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <Container className="alljobs">
        <Row>
          <Col>
            <h3>Explore the job opportunities available</h3>
          </Col>
        </Row>
        <Row>
          {jobs.map(job => (
            <Col md={4} key={job._id} className="mb-4">
              <Card 
                onClick={() => handleCardClick(job._id)} 
                style={{ 
                  cursor: 'pointer',
                  border: '1.5px solid #e6f0f9', 
                  borderRadius: '10px', 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Card.Body className="jobs_cards" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <img 
                      src={job.company.logo} 
                      alt={`${job.company.name} logo`} 
                      style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} 
                    />
                    <div>
                      <Card.Title style={{ fontSize: '1.01rem', fontWeight: 'bold' }}>{job.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1rem' }}>{job.company.name}</Card.Subtitle>
                    </div>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '1rem' }}>{job.category}</Card.Subtitle>
                  <Card.Text style={{ marginBottom: '15px', color: '#555' }}>
                    <strong>Location:</strong> {job.location}<br />
                    <strong>Type:</strong> {job.type}<br />
                    <strong>Salary:</strong>${parseInt(job.salaryRange).toLocaleString()}
                  </Card.Text>
                  <Button style={{background: '#002745'}} onClick={(event) => handleApplyClick(job._id, event)}>Apply</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {selectedJobId && (
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

export default AllJobsComponent;
