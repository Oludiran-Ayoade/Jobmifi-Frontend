import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useApplicationStatus } from '../../context/statusContext';

const SkillersApplication: React.FC = () => {
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { status } = useApplicationStatus();

  useEffect(() => {
    const fetchApplications = async () => {
      try {  
        const response = await axios.get(`http://localhost:3000/api/users/applications/user/${userId}`);
        setApplications(response.data.applications);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [userId]);

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/employer/delete-application/${applicationId}`);
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  if (loading) {
    return <div className="text-center" style={{ paddingTop: '150px' }}><Spinner animation="border" style={{ color: '#002745' }} role="status"></Spinner></div>;
  }

  const handleViewDetails = (jobId: string, applicationId: string) => {
    navigate(`/skillers/job-details/${jobId}` , { state: { applicationId } });
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

  return (
    <Container style={{ paddingTop: '10px' }} className="mb-4">
      <Row>
        {applications.length > 0 ? (
          applications.map(application => (
            <Col key={application._id} md={4} className="mb-4">
              <Card>
                <Card.Img 
                  className='shadow-lg'
                  variant="top" 
                  src={application.job.company.logo} 
                  alt={application.job.company.name} 
                  style={{
                    height: '120px',   
                    width: '120px',    
                    objectFit: 'cover',  
                    borderRadius: '50%', 
                    margin: '10px auto',  
                    display: 'block'     
                  }} 
                />
                <Card.Body>
                  <Card.Title>Job Title: {application.job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Category: {application.job.category}</Card.Subtitle>
                  <Card.Text>
                    <strong>Company:</strong> {application.job.company.name}<br />
                    <strong>Location:</strong> {application.job.location}<br />
                    <strong>Salary Range:</strong>${parseInt(application.job.salaryRange).toLocaleString()} <br />
                    <div style={{display: 'flex'}}>
                    <strong>Status: </strong>
                    <div style={{ display: 'flex', alignItems: 'center',marginLeft: '5px' }}>
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
                  </Card.Text>
                  <Button 
                    className='btn btn-primary' 
                    style={{ background: '#002745' }}
                    onClick={() => handleViewDetails(application.job._id, application._id)}>
                    View Job Details
                  </Button>
                  <Button 
                    className='btn btn-danger mt-2' 
                    onClick={() => handleDeleteApplication(application._id)}>
                    Withdraw Application
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <h5 className='text-center'>You are yet to apply for a role.</h5>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SkillersApplication;
