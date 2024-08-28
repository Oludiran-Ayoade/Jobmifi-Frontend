import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { useApplicationStatus } from '../../context/statusContext';

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';
  const [applications, setApplications] = useState<any[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});
  const [expandedCoverLetters, setExpandedCoverLetters] = useState<{ [key: string]: boolean }>({});
  const [acceptedApplications, setAcceptedApplications] = useState<any[]>([]);
  const [rejectedApplications, setRejectedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setStatus } = useApplicationStatus();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`https://jobmifi-backend.onrender.com/api/users/employer/jobs/${userId}`);
        console.log(response);
        
        const pendingApplications = response.data.filter((app: any) => app.status === 'pending');
        const acceptedApplications = response.data.filter((app: any) => app.status === 'accepted');
        const rejectedApplications = response.data.filter((app: any) => app.status === 'rejected');

        setApplications(pendingApplications);
        setAcceptedApplications(acceptedApplications);
        setRejectedApplications(rejectedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchApplications();
  }, [userId]);

  const handleAction = async (application: any, action: 'accept' | 'reject') => {
    setDisabledButtons(prev => ({ ...prev, [application._id]: true }));

    try {
      // Update status in the backend
      await axios.post('https://jobmifi-backend.onrender.com/api/users/employer/update-status', {
        applicationId: application._id,
        status: action === 'accept' ? 'accepted' : 'rejected',
      });

      if (action === 'accept') {
        const updatedAccepted = [...acceptedApplications, application];
        setAcceptedApplications(updatedAccepted);
        setStatus(application._id, 'Accepted');
      } else {
        const updatedRejected = [...rejectedApplications, application];
        setRejectedApplications(updatedRejected);
        setStatus(application._id, 'Rejected');
      }

      const updatedApplications = applications.filter(app => app._id !== application._id);
      setApplications(updatedApplications);

      toast.current?.show({ severity: 'success', summary: 'Success', detail: `Application ${action}ed successfully`, life: 3000 });
    } catch (error) {
      console.error('Error handling application action:', error);
      setDisabledButtons(prev => ({ ...prev, [application._id]: false }));
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Application not ${action}ed`, life: 3000 });
    }
  };

  const handleDelete = async (applicationId: string) => {
    try {
      // Delete the application from the backend
      await axios.delete(`https://jobmifi-backend.onrender.com/api/users/employer/delete-application/${applicationId}`);

      setApplications(applications.filter(app => app._id !== applicationId));
      setAcceptedApplications(acceptedApplications.filter(app => app._id !== applicationId));
      setRejectedApplications(rejectedApplications.filter(app => app._id !== applicationId));

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Application deleted successfully', life: 3000 });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Application not deleted', life: 3000 });
    }
  };

  const toggleCoverLetter = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedCoverLetters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderApplications = (applications: any[], type: 'accepted' | 'rejected' | 'pending') => {
    return applications?.length > 0 ? applications.map((application: any) => (
      <Col key={application._id} md={type === 'pending' ? 4 : 12} className="mb-4">
        <Card>
          <Card.Body className={`application-card ${type}`}>
            <img 
              src={application.skillers.profilePicture} 
              alt="display picture" 
              style={{ borderRadius: '50%', marginBottom: '3px', height: '50px', marginLeft: '10px' }} 
            />

            <Card.Title>Job Title: {application.job?.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Company: {application.job?.company.name}</Card.Subtitle>
            <Card.Text><strong>Applicant:</strong> {application.skillers.userId.firstName} {application.skillers.userId.lastName}</Card.Text>
            <Card.Text><strong>Email:</strong> {application.skillers.userId.email}</Card.Text>
            <Card.Text><strong>Specialization:</strong> {application.skillers.specialization}</Card.Text>
            
            <Card.Text><strong>Salary Range:</strong> ${parseInt(application.job.salaryRange).toLocaleString()}</Card.Text>
            <Card.Text>
              <strong>Cover Letter:</strong>
              {expandedCoverLetters[application._id] ? application.coverLetter : `${application.coverLetter.slice(0, 100)}...`}
              <Button variant="link" onClick={(e) => toggleCoverLetter(application._id, e)}>
                {expandedCoverLetters[application._id] ? 'See Less' : 'See More'}
              </Button>
            </Card.Text>

            {type === 'pending' && (
              <div className="actions">
                <Button
                  className='btn btn-success'
                  onClick={() => handleAction(application, 'accept')}
                  disabled={disabledButtons[application._id]}>
                  Accept
                </Button>
                <Button
                  className='btn btn-danger'
                  onClick={() => handleAction(application, 'reject')}
                  disabled={disabledButtons[application._id]}>
                  Reject
                </Button>
              </div>
            )}
          </Card.Body>
          {/* /candidates/profile/:id */}
          <Button onClick={() => navigate(`/candidates/profile/${application.skillers.userId._id}`)}>
            View Applicant's Profile
          </Button>
          <Button variant="danger" className='mt-2' onClick={() => handleDelete(application._id)}>Delete</Button>
        </Card>
      </Col>
    )) : <p>No applications available</p>;
  }

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <Container>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" role="status">
              <span className="sr-only"></span>
            </Spinner>
          </div>
        ) : (
          <>
            {applications.length > 0 || acceptedApplications.length > 0 || rejectedApplications.length > 0 ? (
              <>
                {applications.length > 0 && (
                  <Row>
                    <Col>
                      <h5>Pending Applications</h5>
                      <Row>
                        {renderApplications(applications, 'pending')}
                      </Row>
                    </Col>
                  </Row>
                )}
                {acceptedApplications.length > 0 && (
                  <Row>
                    <Col>
                      <h5 className='text-center'>Accepted Applications</h5>
                      <Row>
                        {renderApplications(acceptedApplications, 'accepted')}
                      </Row>
                    </Col>
                  </Row>
                )}
                {rejectedApplications.length > 0 && (
                  <Row>
                    <Col>
                      <h5 className='text-center'>Rejected Applications</h5>
                      <Row>
                        {renderApplications(rejectedApplications, 'rejected')}
                      </Row>
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <h5 className='text-center'>No applications</h5>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default EmployerDashboard;
