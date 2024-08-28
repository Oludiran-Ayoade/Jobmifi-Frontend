import React, { useRef, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import signupfig from '../../assets/essentials/signup-fig.png'
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.css';
import SignInModal from './SignIn';
import ForgotPasswordModal from './passwordReset/ForgotPassword';
import VerifyOtpModal from '../Auth/passwordReset/VerifyOtp';
import ResetPasswordModal from '../Auth/passwordReset/ResetPassword';
import { SignUpModalProps } from '../../dto/dto';


const SignUpModal: React.FC<SignUpModalProps> = ({ visible, onHide, onSignInVisible  }) => {
  const toast = useRef<Toast>(null);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isVerifyOtpVisible, setIsVerifyOtpVisible] = useState<boolean>(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const [ResetPasswordVisible, setResetPasswordVisible] = useState(false);
  // const navigate = useNavigate();

  const validationSchema = yup.object({
    firstName: yup.string().required('firstName is required!'),
    lastName: yup.string().required('lastName is required!'),
    email: yup.string().email('Invalid email').required('Email is required!'),
    password: yup.string().min(8, 'Password should be at least 8 characters').required('Password is required'),
    conpassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      conpassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const url = isRecruiter ? 'https://jobmifi-backend.onrender.com/api/users/jobpost' : 'https://jobmifi-backend.onrender.com/api/users/signup';
      await axios.post(url, values)
        .then((res) => {
          if (res.data.status) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: "Account Successfully Created", life: 2000 });
            // toast.success("Account Successfully Created");
            // setTimeout(() => navigate('/signin'), 5000);
            resetForm();
            onHide();
            onSignInVisible();
          } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error Signing In', life: 3000 });
          }
        })
        .catch(() => {
          // console.error(err);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error Signing In', life: 3000 });
        });
    },
  });

  return (
    <>
    <Dialog visible={visible} onHide={onHide} className="signup-modal">
      <img src={signupfig} alt="" />
      <h4 className='text-center mt-3'>Create an account</h4>
      <div className="button-group text-center">
        <Button label="I am a Candidate" className={!isRecruiter ? 'active' : ''} onClick={() => setIsRecruiter(false)} />
        <Button label="I am a Recruiter" className={isRecruiter ? 'active' : ''} onClick={() => setIsRecruiter(true)} />
      </div>
      <div className='signup_form'>
        <h1 className='text-center'>{isRecruiter ? '' : ''}</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className='first_last'> 
          <div>
          <InputText type="text" placeholder='First Name' className='form-control firstName' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName} name="firstName" />
          <p className='text-danger'>{formik.touched.firstName && formik.errors.firstName}</p>
          </div>
          <div> <InputText type="text" placeholder='Last Name' className='form-control lastName' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName} name="lastName" />
          <p className='text-danger'>{formik.touched.lastName && formik.errors.lastName}</p> </div>
         </div>
          <InputText type="text" placeholder='Email' className='form-control email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} name="email" />
          <p className='text-danger'>{formik.touched.email && formik.errors.email}</p>
          <Password type="password" className='form-control custom_password' placeholder='Password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} name="password"  toggleMask />
          <p className='text-danger'>{formik.touched.password && formik.errors.password}</p>
          <Password type="password" className='form-control con_password' placeholder='Confirm Password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.conpassword} name="conpassword" toggleMask />
          <p className='text-danger'>{formik.touched.conpassword && formik.errors.conpassword}</p>
          <Button type="submit" label="Continue" className='signup_button' />
        </form>
        <div className='already_have_account'><p>Already have an account? </p><button onClick={() => { onSignInVisible();  onHide(); }}> Sign In</button></div>
      </div>
      <Toast ref={toast}  className="custom-toast"/>
    </Dialog>
    {( isSignInVisible || isForgotPasswordVisible || isSignUpVisible || isVerifyOtpVisible || ResetPasswordVisible ) && (
    <Dialog visible={true} onHide={() => { setIsSignInVisible(false); setIsForgotPasswordVisible(false);  setIsSignUpVisible(false) }} closable={false}>
    {isSignInVisible && <SignInModal visible={isSignInVisible} onHide={() => setIsSignInVisible(false)}  onOpenForgotPassword={() => {setIsSignInVisible(false); setIsForgotPasswordVisible(true); }} onSignUpVisible={() => { setIsSignInVisible(false); setIsSignUpVisible(true); }} />}
    {isForgotPasswordVisible && <ForgotPasswordModal visible={isForgotPasswordVisible} onHide={() => setIsForgotPasswordVisible(false)} onOpenVerifyOtp={() => {setIsForgotPasswordVisible(false); setIsVerifyOtpVisible(true) }} />}
    {isSignUpVisible && <SignUpModal visible={isSignUpVisible} onHide={() => setIsSignUpVisible(false)} onOpenForgotPassword={() => {setIsSignUpVisible(false); setIsForgotPasswordVisible(true); }} onSignInVisible={() => {setIsSignUpVisible(false); setIsSignInVisible(true); setIsForgotPasswordVisible(false)}} />}
    {isVerifyOtpVisible && <VerifyOtpModal visible={isVerifyOtpVisible} onHide={() => setIsVerifyOtpVisible(false)} onOpenForgotPassword = {()=> {setIsVerifyOtpVisible(false); setResetPasswordVisible(true)}} />}
    {ResetPasswordVisible && <ResetPasswordModal visible={ResetPasswordVisible} onHide={() => setResetPasswordVisible(false)} />}
    </Dialog>
     )}
    </>
  );
};

export default SignUpModal;
