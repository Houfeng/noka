import { DependencyList, useMemo } from "react";

export function useQuery<T>(fn: () => T, deps: DependencyList): T {
  return useMemo(() => fn(), deps);
}
