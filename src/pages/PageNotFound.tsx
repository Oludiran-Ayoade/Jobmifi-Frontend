import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  
  return (
    <>
    <div className="container justify-content-center align-items-center">
      <h1 className='text-orange text-center' style={{fontSize: '45px', marginTop: '40px'}}>404 - Page Not Found</h1>
      <p className='text-orange text-center' style={{fontSize: '20px'}}>The page you are looking for does not exist.</p>
      <p className='text-orange text-center' style={{fontSize: '20px'}}>
        Go back to <Link to="/">Home</Link>
      </p>
    </div>
    </>
  );
};

export default PageNotFound;
