import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaToolbox } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { GiPadlock } from "react-icons/gi";

const Skillers: React.FC = () => {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <ul>
          <li><Link to="/skillers/dashboard"><CgProfile style={{ marginTop: '-2px' }} /> Profile </Link></li>
          <li><Link to="/skillers/applications"><FaToolbox style={{ marginTop: '-2px' }} /> Applications</Link></li>
          <li><Link to="/skillers/change-password"><GiPadlock style={{ marginTop: '-2px' }} /> Change Password</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Skillers;
