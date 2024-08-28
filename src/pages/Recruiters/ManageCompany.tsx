import React from 'react';
import { Link } from 'react-router-dom'
import CompanyList from './CompanyList';

const ManageCompany:React.FC = () => {
  return (
    <>
    <div className='manage_company'>
    <Link to="/recruiter/create-company">
        <button className="create-company-button">Create Company</button>
      </Link>
      {/* <h1>Manage Company</h1> */}
    </div>
    <CompanyList />
    </>
  );
};

export default ManageCompany;
