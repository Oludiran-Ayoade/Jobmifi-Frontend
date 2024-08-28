// JobList.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

interface Job {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  type: string;
  company: any;
  logo: any;
}

const JobList: React.FC = () => {
    const navigate = useNavigate()
  const { category } = useParams<{ category: string }>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://jobmifi-backend.onrender.com/api/users/alljobs/jobs');
        // console.log(response);
        const jobsData = response.data.jobs;
        // console.log(jobsData);
        setLoading(false);
        if (Array.isArray(jobsData)) {
          const filteredJobs = jobsData.filter((job: Job) => job.category === category);
          setJobs(filteredJobs);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Error fetching jobs.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category]);

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs-details/${jobId}`)
    // console.log('Clicked job ID:', jobId);
  };

  if (loading) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container style={{paddingTop: '100px'}} className='jobs_categories'>
      <Row>
        <Col>
          <h1>{category} Jobs</h1>
        </Col>
      </Row>
      <Row>
        {jobs.length === 0 ? (
          <Col>
            <div>No jobs available under this category.</div>
          </Col>
        ) : (
          jobs.map((job) => (
            <Col key={job._id} sm={12} md={6} lg={4} className="mb-4" onClick={() => handleJobClick(job._id)} style={{cursor:'pointer' }} >
              <Card className='job_box'>
                <Card.Body>
                <img src={job.company.logo} alt="" />
                <Card.Title>Category: {job.company.name}</Card.Title>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>{job.location}</Card.Text>
                  <Card.Text>Category: {job.company.category}</Card.Text>
                  <Card.Text>{job.description}</Card.Text>
                  <Card.Text>{job.type}</Card.Text>
                  <button className='btn btn-primary' style={{background: '#002745'}}>Open</button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default JobList;
