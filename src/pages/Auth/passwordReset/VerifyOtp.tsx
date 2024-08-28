import React, { useState, useEffect } from 'react';
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
import ResetPasswordModal from '../passwordReset/ResetPassword';
import { VerifyOtpModalProps } from '../../../dto/dto';


const VerifyOtp: React.FC<VerifyOtpModalProps> = ({ visible, onHide, onOpenForgotPassword }) => {
  const [otp, setOTP] = useState<string>('');
  const [timer, setTimer] = useState<number>(60); 
  const  email = localStorage.getItem('resetEmail') || ''
  const [loading, setLoading] = useState<boolean>(false);
  const [ResetPasswordVisible, setResetPasswordVisible] = useState<boolean>(false);
  const toast = React.useRef<Toast>(null);

  
  useEffect(() => {
    // Reset OTP and timer when the component mounts
    setOTP('');
    setTimer(60);

    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [visible]);

  const verifyOTP = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();

    if (!otp) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter the OTP', life: 3000 });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/verify-otp',
        { email, userOTP: otp },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { status, message } = response.data;
      
      if (status) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 2000 });
        localStorage.setItem('resetOTP', otp);
        const handleActionWithDelay = () => {
          setTimeout(() => {
            onHide();
            onOpenForgotPassword();
            setOTP('');
          }, 2000); 
        };
        handleActionWithDelay();
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
      }
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'An error occurred', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog visible={visible} onHide={onHide} modal className='v-otp_modal'>
        <div className='p-fluid'>
        <img src={forgot} alt="forgot password" />
        <h5 className='text-center'>Verify OTP</h5>
          <p className='text-center sent_to'>Enter the OTP sent to <br /> {email}</p>
          <div className="p-field">
            <InputText
              id="otp"
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className='form-control border-2 rounded-5'
            />
          </div>
          {timer > 0 ? (
            <p className='text-center text-danger'>Time remaining: {timer} seconds</p>
          ) : (
            <p className='text-center text-danger'>OTP has expired</p>
          )}
          <Button
            label={loading ? '' : 'Verify OTP'}
            onClick={verifyOTP}
            className='btn btn-success mt-2 verify_otp_btn'
            disabled={loading}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading && <ProgressSpinner style={{ width: '20px', height: '20px', color: 'white' }} strokeWidth="4" />}
          </Button>
        </div>
      </Dialog>
      {(ResetPasswordVisible) && (
    <Dialog visible={true} onHide={() => {setResetPasswordVisible(false)}}>
    {ResetPasswordVisible && <ResetPasswordModal visible={ResetPasswordVisible} onHide={() => setResetPasswordVisible(false)} />}
    </Dialog> )}
    </>
  );
};

export default VerifyOtp;
