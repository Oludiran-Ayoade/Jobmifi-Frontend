import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

const CompanySlider: React.FC = () => {
    const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://jobmifi-backend.onrender.com/api/users/allcompany/companies');
        const companiesData = response.data;

        // Use a Set to avoid duplicate companies
        const uniqueCompanies = Array.from(new Set(companiesData.map((company: Company) => company._id)))
          .map(id => companiesData.find((company: Company) => company._id === id));

        setCompanies(uniqueCompanies);
        console.log(uniqueCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Error fetching companies.');
      }
    };

    fetchCompanies();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const slidesToShow = Math.max(Math.min(companies.length, 3), 1);

  const settings = {
    dots: true,
    infinite: companies.length > 1,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.max(Math.min(companies.length, 2), 1),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container style={{ paddingTop: '100px', cursor: 'pointer' }} className='all_company'>
      <h1>Companies</h1>
      <Slider {...settings}>
        {companies.map((company) => (
          <div key={company._id} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '18rem', margin: '0 auto' }} onClick={() => navigate(`/company/${company._id}`)}>
              <Card.Img variant="top" src={company.logo} alt={`${company.name} logo`} className='company_logo' />
              <Card.Body>
                <Card.Title>{company.name}</Card.Title>
                <Card.Text>{company.location}</Card.Text>
                <Card.Text>Jobs Available: {company.jobs.length}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default CompanySlider;
