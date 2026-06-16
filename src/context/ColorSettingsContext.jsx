import { createContext, useContext } from "react";

export const ColorSettingsContext = createContext(null);

export function userColorSettings() {
    const c = useContext(ColorSettingsContext);
    if (!c) throw new Error("Trying to use context outside provider.");
    return c;
}