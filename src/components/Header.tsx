import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import Dropdown from 'react-bootstrap/Dropdown';
import SignInModal from '../pages/Auth/SignIn';
import SignUpModal from '../pages/Auth/SignUp';
import ForgotPasswordModal from '../pages/Auth/passwordReset/ForgotPassword'
import VerifyOtpModal from '../pages/Auth/passwordReset/VerifyOtp';
import ResetPasswordModal from '../pages/Auth/passwordReset/ResetPassword'
import useScrollToTop from '../hooks/ScrolltoTop';
// import './header.css'; // Import the external CSS


const Header: React.FC = () => {
  useScrollToTop();
  
  const [scrolled, setScrolled] = useState(false);
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [isVerifyOtpVisible, setIsVerifyOtpVisible] = useState<boolean>(false);
  const [ResetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');

    // remove applications
    localStorage.removeItem(`acceptedApplications_${userId}`);
    localStorage.removeItem(`rejectedApplications_${userId}`);
    logout();
    navigate('/');
  };

  return (
    <>
      <div className={`headerArea ${scrolled ? 'scrolled' : ''}`}>
        <Link to='/'><h2 className="siteName">JobMifi</h2></Link>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`hamburger_menu ${menuOpen ? 'active' : ''}`}>
          <li><Link className='nav_link' to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link className='nav_link' to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
          <li><Link className='nav_link' to="/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
          <li><Link className='nav_link' to="/candidates" onClick={() => setMenuOpen(false)}>Candidates</Link></li>
          {auth.user ? (
            <>
              <div className='nav_extra'>
                <li>{auth.user.role === 2 && (
                  <Link className='nav_link' to="/recruiter/dashboard" onClick={() => setMenuOpen(false)}>Profile</Link>
                ) || auth.user.role === 0 && (
                  <Link className='nav_link' to="/skillers/dashboard" onClick={() => setMenuOpen(false)}>Profile</Link>
                )}</li>
              </div>
              <div className='drop'>
                <Dropdown className='drop_down'>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className='drop_down_toggle'>
                    <MdAccountCircle style={{ fontSize: '25px' }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout} className='drop_item'>Sign Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </>
          ) : (
            <>
              <div className='drop'>
                <Dropdown className='drop_down'>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className='drop_down_toggle'>
                    <MdAccountCircle style={{ fontSize: '25px' }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ border: '2px solid #002745' }}>
                    <Dropdown.Item onClick={() => setIsSignInVisible(true)} className='drop_item'>Sign In</Dropdown.Item>
                    <Dropdown.Item onClick={() => setIsSignUpVisible(true)} className='drop_item'>Sign Up</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </>
          )}
        </ul>
      </div>

      <SignInModal visible={isSignInVisible} onHide={() => setIsSignInVisible(false)} onOpenForgotPassword={() => {setIsSignInVisible(false); setIsForgotPasswordVisible(true); }} onSignUpVisible={() => {setIsSignInVisible(false); setIsSignUpVisible(true); }} />
      <SignUpModal visible={isSignUpVisible} onHide={() => setIsSignUpVisible(false)} onSignInVisible={() => {setIsSignUpVisible(false); setIsSignInVisible(true);}} onOpenForgotPassword={() => {setIsSignInVisible(false); setIsForgotPasswordVisible(true); }}/>
      <ForgotPasswordModal visible={isForgotPasswordVisible} onHide={() => setIsForgotPasswordVisible(false)} onOpenVerifyOtp={() => {setIsForgotPasswordVisible(false); setIsVerifyOtpVisible(true) }}/>
      <VerifyOtpModal visible={isVerifyOtpVisible} onHide={() => setIsVerifyOtpVisible(false)} onOpenForgotPassword={() => {setIsVerifyOtpVisible(false); setResetPasswordVisible(true);}} />
      <ResetPasswordModal visible={ResetPasswordVisible} onHide={() => setResetPasswordVisible(false)} />
    </>
  );
};

export default Header;
