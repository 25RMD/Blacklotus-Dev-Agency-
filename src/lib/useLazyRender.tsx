import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useLocation } from "react-router";

type LazyRenderContextType = {
  isRendered: boolean;
  renderLazy: React.Dispatch<React.SetStateAction<boolean>>;
};

const LazyRenderContext = createContext<LazyRenderContextType | null>(null);

type LazyRenderProviderProps = {
  children: ReactNode;
};

export function LazyRenderProvider({
  children,
}: LazyRenderProviderProps) {
  const location = useLocation();

  const [isRendered, renderLazy] = useState<boolean>(
    Boolean(location.hash)
  );
  
  // Re-check on every hash change
  useEffect(() => {
    if (location.hash && !isRendered) {
      renderLazy(true);
    }
  }, [location.hash, isRendered]);

  return (
    <LazyRenderContext.Provider value={{ isRendered, renderLazy }}>
      {children}
    </LazyRenderContext.Provider>
  );
}

export function useLazyRender(): LazyRenderContextType {
  const context = useContext(LazyRenderContext);

  if (!context) {
    throw new Error(
      "useLazyRender must be used inside LazyRenderProvider"
    );
  }

  return context;
}