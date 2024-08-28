import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaHouseUser } from "react-icons/fa";
import { ImOffice } from "react-icons/im";
import { FaToolbox } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { GiPadlock } from "react-icons/gi";

const Recruiter:React.FC = () => {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <ul>
          <li><Link to="/recruiter/dashboard"><FaHouseUser style={{marginTop: '-2px'}}/> Dashboard</Link></li>
          <li><Link to="/recruiter/manage-company"><ImOffice style={{marginTop: '-10px'}}/> Manage Company</Link></li>
          <li><Link to="/recruiter/manage-job"><FaToolbox style={{marginTop: '-2px'}}/> Manage Job</Link></li>
          <li><Link to="/recruiter/candidates"><CgProfile style={{marginTop: '-2px'}}/> Candidates</Link></li>
          <li><Link to="/recruiter/change-password"><GiPadlock style={{marginTop: '-2px'}}/> Change Password</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Recruiter;
