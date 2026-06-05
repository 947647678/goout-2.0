"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AgentContextValue {
  isOpen: boolean;
  openAgent: () => void;
  closeAgent: () => void;
  toggleAgent: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAgent = useCallback(() => setIsOpen(true), []);
  const closeAgent = useCallback(() => setIsOpen(false), []);
  const toggleAgent = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <AgentContext.Provider
      value={{ isOpen, openAgent, closeAgent, toggleAgent }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
