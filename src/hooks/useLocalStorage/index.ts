import { useState } from "react";

type StoredValue<T> = T | null;

const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Retrieve the stored value from local storage on component mount
  const storedValue: StoredValue<T> = (() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item)
        return initialValue instanceof Date
          ? new Date(JSON.parse(item))
          : JSON.parse(item);
      else return initialValue;
    } catch (error) {
      console.error("Error retrieving from local storage:", error);
      return initialValue;
    }
  })();

  // State to hold the current value
  const [value, setValue] = useState<StoredValue<T>>(storedValue);

  // Function to update the local storage and state with a new value
  const updateValue = (newValue: T | ((prevValue: T) => T)) => {
    try {
      const newValueToStore =
        newValue instanceof Function ? newValue(value as T) : newValue;
      setValue(newValueToStore);
      window.localStorage.setItem(key, JSON.stringify(newValueToStore));
    } catch (error) {
      console.error("Error updating local storage:", error);
    }
  };

  // Function to remove the item from local storage and reset the state
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setValue(null);
    } catch (error) {
      console.error("Error removing from local storage:", error);
    }
  };

  return { value, setValue: updateValue, removeValue };
};

export default useLocalStorage;
