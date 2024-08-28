import { ReactNode } from "react";

// FormValues
export interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    conpassword: string;
  }

  // Define the types for props and user data
export interface Props {
  children: ReactNode;
}

// User dto
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number; 
}

// Authentication dto
export interface AuthContextType {
  isAuthenticated: boolean;
  auth: { user: User | null; token: string };
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// SignInModalProp dto
export interface SignInModalProps {
  visible?: boolean;
  onHide: () => void;
  onOpenForgotPassword: () => void;
  onSignUpVisible: () => void;
}

// SignUpModalProp dto
export interface SignUpModalProps {
  visible: boolean;
  onHide: () => void;
  onSignInVisible: () => void;
  onOpenForgotPassword: () => void;
}

// ForgotPasswordModalProps dto
export interface ForgotPasswordModalProps {
  visible?: boolean;
  onHide: () => void;
  onOpenVerifyOtp: () => void;
}

// onResetModalProps dto
export interface onResetModalProps {
  visible: boolean;
  onHide: () => void;
}

// VerifyOtpModalProps dto
export interface VerifyOtpModalProps {
  visible: boolean;
  onHide: () => void;
  onOpenForgotPassword: () => void;
}
