import React, {  useRef, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import forgot from '../../../assets/essentials/password-fig.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import VerifyOtpModal from '../passwordReset/VerifyOtp';
import ResetPasswordModal from '../passwordReset/ResetPassword';
import { ForgotPasswordModalProps } from '../../../dto/dto';



const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onHide , onOpenVerifyOtp }) => {
  const toast = useRef<Toast>(null);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [isVerifyOtpVisible, setIsVerifyOtpVisible] = useState<boolean>(false);
  const [ResetPasswordVisible, setResetPasswordVisible] = useState<boolean>(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState<boolean>(false);

  const url = 'http://localhost:3000/api/users/forgot-password';
 
  const sendOTP = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    if (!email) {
      setEmailError('Invalid email');
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid email', life: 3000 });
      return;
    }
    setEmailError('');
    setLoading(true);

    try {
      const response = await axios.post(
        url,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { status, message } = response.data;
      
      if (status) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 2000 });
        localStorage.setItem('resetEmail', email);
        const handleActionWithDelay = () => {
          setTimeout(() => {
            onHide();
            onOpenVerifyOtp();
            setEmail('');
          }, 2000); 
        };
        handleActionWithDelay();
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An Error Occured', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Toast ref={toast}  className="custom-toast"/>
      <Dialog visible={visible} className='forgot_password_modal' onHide={onHide} modal>
        <div className="p-fluid">
          <img src={forgot} alt="forgot password" />
          <h4 className='text-center'>Forgot Password</h4>
          <div className="p-field">
            <InputText 
              id="email" 
              type="text" 
              placeholder='Email address' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={emailError ? 'p-invalid' : ''}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            />

          </div>
          <Button label={loading ? '' : 'Get new password'} className='forgot_button' onClick={sendOTP} disabled={loading}>
            {loading && <ProgressSpinner className='spinner' style={{ width: '35px', height: '30px' }} strokeWidth="7" />}
          </Button>
        </div>
      </Dialog>
    {(isVerifyOtpVisible || isForgotPasswordVisible || ResetPasswordVisible) && (
    <Dialog visible={true} onHide={() => { setIsVerifyOtpVisible(false) }}>
    {isVerifyOtpVisible && <VerifyOtpModal visible={isVerifyOtpVisible} onHide={() => setIsVerifyOtpVisible(false)} onOpenForgotPassword = {()=> {setIsForgotPasswordVisible(false); setResetPasswordVisible(true)}} />}
    {isForgotPasswordVisible && <ForgotPasswordModal visible={isForgotPasswordVisible} onHide={() => setIsForgotPasswordVisible(false)} onOpenVerifyOtp={() => {setIsForgotPasswordVisible(false); setIsVerifyOtpVisible(true) }}/> }
    {ResetPasswordVisible && <ResetPasswordModal visible={ResetPasswordVisible} onHide={() => setResetPasswordVisible(false)} />}
    </Dialog>
     )}
    </>
  );
};

export default ForgotPasswordModal;
