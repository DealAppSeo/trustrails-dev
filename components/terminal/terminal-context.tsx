"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type DisplayMode = "simple" | "advanced";

interface TerminalContextType {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("simple");

  useEffect(() => {
    const saved = localStorage.getItem("trusttrader_display_mode") as DisplayMode;
    if (saved === "simple" || saved === "advanced") {
      setDisplayMode(saved);
    }
  }, []);

  const handleSetDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(mode);
    localStorage.setItem("trusttrader_display_mode", mode);
  };

  return (
    <TerminalContext.Provider value={{ displayMode, setDisplayMode: handleSetDisplayMode }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
}
