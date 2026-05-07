import { createContext, useContext } from "react";

const OSContext = createContext(null);

export function useOS() {
  return useContext(OSContext);
}