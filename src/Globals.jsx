import { createContext, useContext, useState, useEffect } from "react";
import { globalsStore } from "./globalsStore";

const PageGlobalsContext = createContext(null);

export function PageGlobalsProvider({ children }) {
  const [globals, setGlobals] = useState(globalsStore.all());

  const setGlobal = (key, value) => {
    globalsStore.set(key, value);
    setGlobals({ ...globalsStore.all() });
  };

  const clearGlobals = () => {
    globalsStore.clear();
    setGlobals({});
  };

  useEffect(() => {
    setGlobals({ ...globalsStore.all() });
  }, []);

  return (
    <PageGlobalsContext.Provider value={{ globals, setGlobal, clearGlobals }}>
      {children}
    </PageGlobalsContext.Provider>
  );
}

export function useGlobals() {
  const ctx = useContext(PageGlobalsContext);
  if (!ctx) throw new Error("useGlobals must be used inside <PageGlobalsProvider>");
  return ctx;
}
