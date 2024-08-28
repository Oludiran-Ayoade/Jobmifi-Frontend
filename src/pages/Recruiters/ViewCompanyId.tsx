import React, { useEffect, useState, CSSProperties } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { useParams } from 'react-router-dom';
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
  length: number;
};

const ViewCompanyId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();
  const { user, token } = auth;
  const userId = user?._id || '';

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/getcompanyid/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompany(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch company data');
        setLoading(false);
      }
    };

    if (userId) {
      fetchCompany();
    }
  }, [id, userId, token]);

  if (loading) {
    return (
      <div className="text-center" style={{ paddingTop: '150px' }}>
        <Spinner animation="border" style={{ color: '#002745' }} role="status"></Spinner>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-company" style={styles.viewCompany}>
      {company && (
        <>
          <div className="company-header" style={styles.companyHeader}>
            <img
              src={company.coverImage}
              alt={`${company.name} Cover`}
              className="cover-image"
              style={styles.coverImage}
            />
            <div className="company-logo" style={styles.companyLogo}>
              <img src={company.logo} alt={`${company.name} Logo`} />
            </div>
          </div>
          <div className="" style={styles.companyDetails}>
            <h1 className="company-name" style={styles.companyName}>{company.name}</h1>
            <p className="company-about" style={styles.companyAbout}>
              <strong>About:</strong> {company.about}
            </p>
            <p className="company-founded" style={styles.companyFounded}>
              <strong>Founded:</strong> {company.founded}
            </p>
            <p className="company-size" style={styles.companySize}>
              <strong>Size:</strong> {company.size} employees
            </p>
            <p className="company-category" style={styles.companyCategory}>
              <strong>Category:</strong> {company.category}
            </p>
            <p className="company-location" style={styles.companyLocation}>
              <strong>Location:</strong> {company.location}
            </p>
            <div className="company-pictures" style={styles.companyPictures}>
              {company.length > 0 && <h3>Pictures:</h3>}
              {company.pictures.map((picture, index) => (
                <img
                  key={index}
                  src={picture}
                  alt={`Company Picture ${index + 1}`}
                  className="company-picture"
                  style={styles.companyPicture}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  viewCompany: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
  },
  companyHeader: {
    position: 'relative',
    marginBottom: '20px',
  },
  coverImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  companyLogo: {
    position: 'absolute',
    bottom: '-30px',
    left: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  companyDetails: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  companyName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  companyAbout: {
    fontSize: '1rem',
    marginBottom: '10px',
    lineHeight: '1.6',
  },
  companyFounded: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  companySize: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  companyCategory: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  companyLocation: {
    fontSize: '1rem',
    marginBottom: '20px',
  },
  companyPictures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
  },
  companyPicture: {
    width: '100%',
    borderRadius: '10px',
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default ViewCompanyId;
