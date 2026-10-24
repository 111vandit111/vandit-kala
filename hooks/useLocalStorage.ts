export const useLocalStorage = () => {
    const isClient = typeof window !== "undefined";
  
    const setLocalStorage = (key: string, value: object) => {
      if (!isClient) return;
      const stringified =  JSON.stringify(value);
      localStorage.setItem(key, stringified);
      window.dispatchEvent(new CustomEvent("savedProjectsUpdated"));
    };
  
    const getLocalStorage = (key: string) => {
      if (!isClient || !key) return null;
      const item = localStorage.getItem(key);
      try {
        return item ? JSON.parse(item) : null;
      } catch {
        return item;
      }
    };

    const removeLocalStorage = (key: string , id: string) => {
      if (!isClient || !key) return null;
      const item = localStorage.getItem(key);
      if(!item) return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(item);
      } catch {
        return;
      }
      if (!Array.isArray(parsed)) return;
      const filtered = parsed.filter((entry: { name: string; }) => entry.name !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent("savedProjectsUpdated"));
    };
  
    return { setLocalStorage, getLocalStorage, removeLocalStorage };
  };
  