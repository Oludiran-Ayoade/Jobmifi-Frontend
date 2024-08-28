import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { Spinner } from 'react-bootstrap';

type Company = {
  name: string;
  coverImage: string;
  about: string;
  founded: string;
  logo: string;
  size: number;
  pictures: string[];
  category: string;
  location: string;
};

const ViewCompany: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();
  const { user, token } = auth;
  const userId = user?._id || '';

  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/getcompany/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        setCompany(response.data.data);
        // console.log(response.data.data);
        
        setLoading(false);
        console.log(userId);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch company data');
        console.log(userId);
        setLoading(false);
      }
    };

    if (userId) {
      fetchCompany();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='view_company'>
      {company && (
        <div className=''>
          <h1>{company.name}</h1>
          <img src={company.coverImage} alt={`${company.name} Cover`} style={{ width: '100%', height: 'auto' }} />
          <p><strong>About:</strong> {company.about}</p>
          <p><strong>Founded:</strong> {company.founded}</p>
          <img src={company.logo} alt={`${company.name} Logo`} style={{ width: '100px', height: '100px' }} />
          <p><strong>Size:</strong> {company.size} employees</p>
          <p><strong>Category:</strong> {company.category}</p>
          <p><strong>Location:</strong> {company.location}</p>
          <div>
            <h3>Pictures:</h3>
            {company.pictures.map((picture, index) => (
              <img key={index} src={picture} alt={`Company Picture ${index + 1}`} style={{ width: '200px', height: 'auto', margin: '10px' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCompany;
