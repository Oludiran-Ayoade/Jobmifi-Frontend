import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ApplicationStatus {
  [key: string]: string; // applicationId: status
}

interface ApplicationStatusContextProps {
  status: ApplicationStatus;
  setStatus: (applicationId: string, status: string) => void;
}

const ApplicationStatusContext = createContext<ApplicationStatusContextProps | undefined>(undefined);

export const ApplicationStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ApplicationStatus>({});

  const updateStatus = (applicationId: string, status: string) => {
    setStatus(prev => ({ ...prev, [applicationId]: status }));
  };

  return (
    <ApplicationStatusContext.Provider value={{ status, setStatus: updateStatus }}>
      {children}
    </ApplicationStatusContext.Provider>
  );
};

export const useApplicationStatus = () => {
  const context = useContext(ApplicationStatusContext);
  if (context === undefined) {
    throw new Error('useApplicationStatus must be used within an ApplicationStatusProvider');
  }
  return context;
};
