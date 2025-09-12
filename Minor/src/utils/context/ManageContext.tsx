import React, { createContext, useState, ReactNode } from 'react';

interface ManageContextType {
  manage: {
    history: string[];
    id: string;
    orgId: string;
  };
  setManage: React.Dispatch<React.SetStateAction<ManageContextType['manage']>>;
}

const ManageContext = createContext<ManageContextType>({
  manage: {
    history: [],
    id: '',
    orgId: '',
  },
  setManage: () => {},
});

interface ManageProviderProps {
  children: ReactNode;
}

export const ManageProvider: React.FC<ManageProviderProps> = ({ children }) => {
  const [manage, setManage] = useState({
    history: [],
    id: '',
  });

  return (
    <ManageContext.Provider value={{ manage, setManage }}>
      {children}
    </ManageContext.Provider>
  );
};

export default ManageContext;
