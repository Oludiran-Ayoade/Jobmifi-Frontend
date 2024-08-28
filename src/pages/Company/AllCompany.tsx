import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';

interface Company {
  _id: string;
  name: string;
  logo: string;
  location: string;
  jobs: Job[];
}

interface Job {
  _id: string;
}

const AllCompanies: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/allcompany/companies');
        const companiesData = response.data;

        // Use a Set to avoid duplicate companies
        const uniqueCompanies = Array.from(new Set(companiesData.map((company: Company) => company._id)))
          .map(id => companiesData.find((company: Company) => company._id === id));

        setCompanies(uniqueCompanies);
        setLoading(false);
        // console.log(uniqueCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Error fetching companies.');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  
if (loading) {
  return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
}

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container style={{ paddingTop: '100px' }} className='all_company'>
      <h1>Companies</h1>
      <Row>
        {companies.map((company) => (
          <Col key={company._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card style={{ cursor: 'pointer' }} onClick={() => navigate(`/company/${company._id}`)} className='shadow'>
              <Card.Img variant="top" src={company.logo} alt={`${company.name} logo`} style={{width: '220px'}} className='company_logo' />
              <Card.Body>
                <Card.Title>{company.name}</Card.Title>
                <Card.Text>{company.location}</Card.Text>
                <Card.Text>Jobs Available: {company.jobs.length}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllCompanies;
