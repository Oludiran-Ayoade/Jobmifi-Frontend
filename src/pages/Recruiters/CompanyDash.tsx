import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

type Company = {
  _id: string;
  name: string;
  logo: string;
  location: string;
  jobCount: number;
  jobs: any;
};

const CompanyDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();
  const { token, user } = auth;
  const userId = user?._id || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/with-job-count/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch companies.');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token, userId]);

  if (loading) {
    return <div className="text-center" style={{ paddingTop: '150px' }}><Spinner animation="border" style={{ color: '#002745' }} role="status"></Spinner></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (companies.length === 0) {
    return (
      <div className="text-center" style={{ paddingTop: '100px' }}>
        <h3>No companies found</h3>
        <p>It looks like you haven't created a company yet. Click the button below to get started.</p>
        <Button variant="primary" onClick={() => navigate('/recruiter/create-company')}>Create a Company</Button>
      </div>
    );
  }

  const handleCompanyClick = (companyId: string) => {
    navigate(`/recruiter/view-company/${companyId}`);
  };

  return (
    <div className="company-dashboard">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Location</th>
            <th>Job Count</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id} onClick={() => handleCompanyClick(company._id)} style={{ cursor: 'pointer' }}>
              <td>
                <img src={company.logo} alt={`${company.name} logo`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              </td>
              <td>{company.name}</td>
              <td>{company.location}</td>
              <td>{company.jobs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CompanyDashboard;
