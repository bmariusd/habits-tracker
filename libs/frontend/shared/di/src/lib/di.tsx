import { createContext, useContext, type ReactNode } from 'react';
import type { Container, ServiceIdentifier } from 'inversify';

const ContainerContext = createContext<Container | null>(null);

interface DIProviderProps {
  container: Container;
  children: ReactNode;
}

export function DIProvider({ container, children }: DIProviderProps) {
  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useInjection<T>(serviceIdentifier: ServiceIdentifier<T>): T {
  const container = useContext(ContainerContext);

  if (container === null) {
    throw new Error('useInjection must be used inside a DIProvider.');
  }

  return container.get<T>(serviceIdentifier);
}
