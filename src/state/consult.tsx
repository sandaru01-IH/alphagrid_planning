import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import ConsultModal from "../components/ConsultModal";

interface ConsultContextValue {
  open: (context?: string) => void;
}

const ConsultContext = createContext<ConsultContextValue | null>(null);

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<string | undefined>(undefined);

  const open = useCallback((ctx?: string) => {
    setContext(ctx);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ConsultContext.Provider value={{ open }}>
      {children}
      <ConsultModal isOpen={isOpen} onClose={close} context={context} />
    </ConsultContext.Provider>
  );
}

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("useConsult must be used within ConsultProvider");
  return ctx;
}
