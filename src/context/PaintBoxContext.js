import { createContext, useContext } from "react";

export const PaintBoxContext = createContext(null);

export function usePaint() {
    const c = useContext(PaintBoxContext);
    if (!c) throw new Error("Trying to use context outside provider.");
    return c;
}