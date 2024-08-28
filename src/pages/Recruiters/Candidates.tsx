import React from 'react';
import EmployerDashboard from './SkillersApplications';

const Candidates:React.FC = () => {
  return (
    <div>
      <h1 className='text-center' style={{marginTop: '-35px'}}>Candidates</h1>
      {/* Candidates content */}
      <EmployerDashboard />
    </div>
  );
};

export default Candidates;
