// https://usehooks.com/useLocalStorage/

import { useCallback, useEffect, useState } from "react";

const isServer = typeof window === 'undefined';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => initialValue);

  const initialize = () => {
    if (isServer) {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  };

  /* prevents hydration error so that state is only initialized after server is defined */
  useEffect(() => {
    if (!isServer) {
      setStoredValue(initialize());
    }
  }, []);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

type DataLoaderState<T> = { state: "error", message: string } | { state: "loading" } | { state: "data", data: T }

export function useDataLoader<T>() {
  const [ state, setState ] = useState<DataLoaderState<T>>({ state: "loading"});
  const setLoading = useCallback(() => {setState({state:'loading'})}, [setState]);
  const setError = useCallback((m: string) => {setState({state:'error', message: m})}, [setState]);
  const setData = useCallback((d: T) => {setState({state:'data', data: d})}, [setState]);
  return {
    error: state.state === "error" ? state : null,
    loading: state.state === "loading" ? state : null,
    data: state.state === "data" ? state : null,
    setLoading: setLoading,
    setError: setError,
    setData: setData
  }
}