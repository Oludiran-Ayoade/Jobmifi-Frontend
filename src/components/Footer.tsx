import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <>
    <footer>
      <div className='footer_i'>
        <h2><span style={{color: '#0969c3'}}>j</span>obMifi</h2>
        <p>Call Us</p>
        <h3>(123) 456-7890</h3>
        <p>90 Fifth Avenue, 3rd Floor <br />
          San Francisco, CA 1980 <br />
          office@jobster.com</p>
      </div>
      <div className='footer_ii'>
        <h4>For Candidates</h4>
        <ul>
          <li>Find Jobs</li>
          <li>Candidate Dashboard</li>
          <li>My Applications</li>
          <li>Favourite Jobs</li>
          <li>My Inbox</li>
        </ul>
      </div>
      <div className='footer_iii'>
        <h4>For Employers</h4>
        <ul>
          <li>Find Candidates</li>
          <li>Company Dashboard</li>
          <li>Post a Job</li>
          <li>Manage Jobs</li>
        </ul>
      </div>
      <div className='footer_iv'>
        <h4>About Us</h4>
        <ul>
          <li>About Us</li>
          <li>Blog</li>
          <li>FAQs</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </footer>
    <div className='foot'>
      <div>
        <p>© 2024 JobMifi. All Right Reserved.</p>
      </div>
      <div className='foot_icons'>
        <span style={{marginLeft: '10px', cursor: 'pointer'}} className='fa_a'><FaFacebook /></span>
        <span style={{marginLeft: '10px', cursor: 'pointer'}} className='fa_b'><FaTwitter /></span>
        <span style={{marginLeft: '10px', cursor: 'pointer'}} className='fa_c'><FaInstagram /></span>
        <span style={{marginLeft: '10px', cursor: 'pointer'}} className='fa_d'><FaLinkedinIn /></span>
      </div>
    </div>
    </>
  );
};

export default Footer;
