import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import forgot from '../../../assets/essentials/password-fig.png';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.css';
import { onResetModalProps } from '../../../dto/dto';


const ResetPassword: React.FC<onResetModalProps> = ({ visible, onHide }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = React.useRef<Toast>(null);

 // get current otp
    const email = localStorage.getItem('resetEmail');
    const otp = localStorage.getItem('resetOTP');
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (values: any) => {
    const { newPassword, confirmNewPassword } = values;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/reset-password',
        { email, otp, newPassword, confirmNewPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { status, message } = response.data;

      if (status) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 2000 });
        setTimeout(() => {
          onHide();
        }, 2000);

      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
      }
    } catch (error: any) {
      // console.error('Error resetting password:', error.response?.data?.message);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'An error occurred', life: 3000 });
    }
  };

  const validationSchema = yup.object({
    newPassword: yup.string().min(8, 'Password should be at least 8 characters').required('New password is required'),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Confirm New Password is required'),
  });

  return (
    <>
      <Toast ref={toast} />
      <Dialog visible={visible} onHide={onHide}  modal className="Reset_password_modal">
         <img src={forgot} alt="forgot password" />
         <h4 className='text-center'>Reset Password</h4>
        <Formik
          initialValues={{ newPassword: '', confirmNewPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
        
          <Form className="p-fluid">
            <div className="p-field">
              <Field
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter new password'
                className='form-control password-password'
                name='newPassword'
              />
              <ErrorMessage name='newPassword' component='div' className='text-danger error_danger' />
            </div>

            <div className="p-field">
              <Field
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
                className='form-control password-password'
                name='confirmNewPassword'
              />
              <ErrorMessage name='confirmNewPassword' component='div' className='text-danger error_danger' />
            </div>

            <div className="p-field">
              <Button type="button" onClick={togglePasswordVisibility} className='p-button-successfull'>
                {showPassword ? 'Hide' : 'Show'}
              </Button>

              <Button type='submit' className='p-button-successful'>
                Reset
              </Button>
            </div>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
};

export default ResetPassword;
