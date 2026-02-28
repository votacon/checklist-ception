import { createContext, useContext } from "react";

interface BarebonesContextValue {
  barebones: boolean;
  toggle: () => void;
}

export const BarebonesContext = createContext<BarebonesContextValue>({
  barebones: false,
  toggle: () => {},
});

export function useBarebones() {
  return useContext(BarebonesContext);
}
