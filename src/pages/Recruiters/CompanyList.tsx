import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { Toast } from 'primereact/toast';

type Company = {
  _id: string;
  name: string;
  category: string;
  size: number;
  location: string;
};

const CompanyList: React.FC = () => {
  let navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { auth } = useAuth();
  const { user, token } = auth;
  const userId = user?._id || '';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/getcompany/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCompanies();
    }
  }, [userId]);

  const handleDelete = async (companyId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/delete/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(companies.filter(company => company._id !== companyId));
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Company Deleted Successfully', life: 2000 });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete company', life: 2000 });
    }
  };

  const handleUpdate = (companyId: string) => {
    navigate(`/recruiter/update-company/${companyId}`);
  };

  if (loading) {
    return <div className="text-center" style={{ paddingTop: '150px' }}><Spinner animation="border" style={{ color: '#002745' }} role="status"></Spinner></div>;
  }

  if (companies.length === 0) {
    return (
      <div className="text-center" style={{ paddingTop: '100px' }}>
        <h3>No companies found</h3>
        <p>It looks like you haven't created any companies yet. Click the button below to create your first company.</p>
        <Button variant="primary" onClick={() => navigate('/recruiter/create-company')}>Create a Company</Button>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <div className="company-list">
        <h1>Companies</h1>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company._id}>
                <td>
                  <Link to={`/recruiter/view-company/${company._id}`} className="custom-link">{company.name}</Link>
                </td>
                <td>
                  <Link to={`/recruiter/view-company/${company._id}`} className="custom-link">{company.category}</Link>
                </td>
                <td>
                  <Link to={`/recruiter/view-company/${company._id}`} className="custom-link">{company.size}</Link>
                </td>
                <td>{company.location}</td>
                <td>
                  <button className="btn btn-primary" style={{ background: '#002745' }} onClick={() => handleUpdate(company._id)}>Update</button>
                  <button className="btn btn-danger ms-2" onClick={() => handleDelete(company._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CompanyList;
