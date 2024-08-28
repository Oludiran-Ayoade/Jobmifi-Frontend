import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

interface Company {
  _id: string;
  name: string;
  coverImage: string;
  about: string;
  founded: Date;
  logo: string;
  contactmail: string;
  size: number;
  pictures: string[];
  category: string;
  location: string;
  title: string;
  type: string;
}

const CompanyDetails: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {   
        const response = await axios.get(`https://jobmifi-backend.onrender.com/api/users/getcompanyid/${id}`);
        setCompany(response.data.data);
        setJobs(response.data.jobs)
        console.log(response.data.data);
        
      } catch (error) {
        console.error('Error fetching company details:', error);
        setError('Error fetching company details.');
      }
    };

    fetchCompanyDetails();
  }, [id]);

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs-details/${jobId}`)
    // console.log('Clicked job ID:', jobId);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!company) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }

  return (
    <div className='job_details'>
      <img src={company.coverImage} alt={`${company.name} cover`} className='image_a' />
      <img src={company.logo} alt={`${company.name} cover`} className='image_b' />
      <div style={{marginLeft: '40px', fontSize: '20px'}}>
      <h1>{company.name}</h1>
      <p>{company.about}</p>
      <p>Contact Mail: <a href={`mailto:${company.contactmail}`} style={{ textDecoration: 'underline' }}>{company.contactmail}</a></p>
      <p>Founded: {new Date(company.founded).toLocaleDateString()}</p>
      <p>Size: {company.size} employees</p>
      <p>Category: {company.category}</p>
      <p>Location: {company.location}</p>
      <div>
        {company.pictures.map((picture, index) => (
          <img key={index} src={picture} alt={`${company.name} ${index + 1}`} className='company_image' />
        ))}
      </div>
      
      

      {jobs.length > 0 && (<h2 className='text-center mb-4'>Jobs</h2>)}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }} className='mb-5'>
        {jobs.map((job) => (
          <div key={job._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '200px' }}>
            {/* <img src={job.logo} alt={`${job.name} logo`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} /> */}
            <h5>{job.title}</h5>
            <h6>{job.category}</h6>
            <p>{job.location}</p>
            <p>{job.type}</p>
            <button className='btn btn-primary' style={{background: '#002745'}} onClick={() => handleJobClick(job._id)}>See More</button>
            {/* <p>{co.location}</p> */}
          </div>
        ))}
      </div>
      </div>

    </div>
  );
};

export default CompanyDetails;
