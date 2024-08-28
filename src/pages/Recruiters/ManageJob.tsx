import React from 'react';
import { Link } from 'react-router-dom';
import JobList from './JobList';

const ManageJob:React.FC = () => {
  return (
    <>
    <div className='main_job' style={{marginLeft: '40px'}}>
    <Link to="/recruiter/job">
        <button className="btn btn-primary" style={{background: '#002745'}}>Create Job</button>
      </Link>
      {/* <h1>Manage Job</h1> */}
      </div>
      <JobList />
    </>
  );
};

export default ManageJob;
