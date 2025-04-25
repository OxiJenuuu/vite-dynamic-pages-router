import { createContext, useContext, useState } from "react";

const PageGlobalsContext = createContext(null);

export function PageGlobalsProvider({ children }) {
  const [globals, setGlobals] = useState({});

  const setGlobal = (key, value) => {
    setGlobals((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearGlobals = () => {
    setGlobals({});
  };

  return (
    <PageGlobalsContext.Provider value={{ globals, setGlobal, clearGlobals }}>
      {children}
    </PageGlobalsContext.Provider>
  );
}

export function useGlobals() {
  const context = useContext(PageGlobalsContext);
  if (!context) {
    throw new Error("useGlobals must be used within a <PageGlobalsProvider>");
  }
  return context;
}
