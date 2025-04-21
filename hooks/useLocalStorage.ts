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
      const parsed = JSON.parse(item);
      console.log(parsed);
      const filtered = parsed.filter((item: { name: string; }) => item.name !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent("savedProjectsUpdated"));
    };
  
    return { setLocalStorage, getLocalStorage, removeLocalStorage };
  };
  