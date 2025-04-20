// context/PermitsContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Permit } from '../models/permit';
import { mockPermits } from '../services/mock-data';

type PermitsContextType = {
  permits: Permit[];
  addPermit: (permit: Permit) => void;
  updatePermit: (id: string, updates: Partial<Permit>) => void;
};

const PermitsContext = createContext<PermitsContextType>({
  permits: [],
  addPermit: () => {},
  updatePermit: () => {},
});

export const PermitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [permits, setPermits] = useState<Permit[]>(mockPermits);

  const addPermit = (permit: Permit) => {
    setPermits((prev) => [...prev, permit]);
  };

  const updatePermit = (id: string, updates: Partial<Permit>) => {
    setPermits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  return (
    <PermitsContext.Provider value={{ permits, addPermit, updatePermit }}>
      {children}
    </PermitsContext.Provider>
  );
};

export const usePermits = () => useContext(PermitsContext);
