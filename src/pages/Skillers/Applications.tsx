import React from 'react';
// import UserDashboard from './SkillersApplication';
import SkillersApplication from './SkillersApplication';

const Applications: React.FC = () => {
  return (
    <div>
      <h2 className='text-center' style={{marginTop:'-15px'}}>Applications</h2>
      <SkillersApplication />
    </div>
  );
};

export default Applications;
