import React, { useRef, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import SignUpModal from '../Auth/SignUp';
import signinfig from '../../assets/essentials/signinfig.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import ForgotPasswordModal from './passwordReset/ForgotPassword';
import VerifyOtpModal from '../Auth/passwordReset/VerifyOtp';
import ResetPasswordModal from '../Auth/passwordReset/ResetPassword';
import { SignInModalProps } from '../../dto/dto';


const SignInModal: React.FC<SignInModalProps> = ({ visible, onHide, onOpenForgotPassword, onSignUpVisible }) => {
  // const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [isVerifyOtpVisible, setIsVerifyOtpVisible] = useState<boolean>(false);
  const [ResetPasswordVisible, setResetPasswordVisible] = useState(false);

  const url = 'http://localhost:3000/api/users/signin';

  const signin = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    try {
      const response = await axios.post(
        url,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const { status, token, user, message } = response.data;

      if (!status) {
        // toast.error(message);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        login(user, token);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 2000 });

        setEmail('');
        setPassword('');
        // if (user.role === 1) {
        //   navigate('/admin');
        // } else if (user.role === 2) {
        //   navigate('/signup');
        // } else {
        //   navigate('/login');
        // }
        onHide();
      }
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
      // toast.error(error.response?.data?.message || 'An error occurred');
    }
  };


  return (
    <>
    <Dialog visible={visible} className='signin_modal' onHide={onHide} modal>
      <div className="p-fluid">
      <img src={signinfig} alt="login_img" />
      <h3>Welcome back!</h3>
        <div className="p-field">
          <InputText id="email" type="text" placeholder='Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="p-field" >
          <InputText id="password" type="password"  placeholder='Password' value={password}  onChange={(e) => setPassword(e.target.value)}  />
        </div>
        <Button label="Continue" className='signIn_button' onClick={signin} />
        <div style={{cursor: 'pointer'}}> <p className='text-center mt-4 forgot_pass' style={{fontSize: '15px'}} onClick={() => {onHide(); onOpenForgotPassword();}}>forgot password</p> </div>
      </div>
      <div>
        <h6 className='text-center newtojobmifi'>
        New to JobMifi? {''}     
            <button style={{border: 'none',background: 'transparent'}} onClick={() => { onSignUpVisible();  onHide();}}>
            Create an account
            </button>
        </h6>
      </div>
      <Toast ref={toast}  className="custom-toast"/>
    </Dialog>
    {( isSignInVisible || isForgotPasswordVisible || isSignUpVisible || isVerifyOtpVisible || ResetPasswordVisible ) && (
    <Dialog visible={true} onHide={()=> { setIsSignInVisible(false); setIsForgotPasswordVisible(false); }}>
    {isSignUpVisible && <SignUpModal visible={isSignUpVisible} onHide={() => setIsSignUpVisible(false)} onSignInVisible={() => {setIsSignUpVisible(false); setIsSignInVisible(true);}} onOpenForgotPassword={() => {setIsSignInVisible(false); setIsForgotPasswordVisible(true); }} />}
    {isSignInVisible && <SignInModal visible={isSignInVisible} onHide={() => setIsSignInVisible(false)}  onOpenForgotPassword={() => {setIsSignInVisible(false); setIsForgotPasswordVisible(true); }} onSignUpVisible={() => { setIsSignInVisible(false); setIsSignUpVisible(true); }} />}
    {isForgotPasswordVisible && <ForgotPasswordModal visible={isForgotPasswordVisible} onHide={() => setIsForgotPasswordVisible(false)} onOpenVerifyOtp={() => {setIsForgotPasswordVisible(false); setIsVerifyOtpVisible(true) }}/> }
    {isVerifyOtpVisible && <VerifyOtpModal visible={isVerifyOtpVisible} onHide={() => setIsVerifyOtpVisible(false)} onOpenForgotPassword = {()=> {setIsVerifyOtpVisible(false); setResetPasswordVisible(true); console.log(1+1)}}/>}
    {ResetPasswordVisible && <ResetPasswordModal visible={ResetPasswordVisible} onHide={() => setResetPasswordVisible(false)} />}
    </Dialog>
    )}
   </>
  );
};

export default SignInModal;
