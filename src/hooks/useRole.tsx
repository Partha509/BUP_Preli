"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "operator" | "analyst";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = "gridwise-active-role";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("operator");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (saved === "operator" || saved === "analyst") {
        setRoleState(saved);
      }
    } catch {}
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch {}
  };

  const toggleRole = () => {
    const next = role === "operator" ? "analyst" : "operator";
    setRole(next);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
