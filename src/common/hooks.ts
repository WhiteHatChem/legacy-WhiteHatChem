// https://usehooks.com/useLocalStorage/

import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};


export function useTheme(key: string, initialValue: string): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? item : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

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