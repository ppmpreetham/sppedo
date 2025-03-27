export const getStorageKey = (account: string, key: string) => `sppedo_${account}_${key}`;

export const getFromStorage = (account: string, key: string) => {
  if (typeof window === 'undefined') return null;
  const storageKey = getStorageKey(account, key);
  const value = localStorage.getItem(storageKey);
  return value ? JSON.parse(value) : null;
};

export const setToStorage = (account: string, key: string, value: any) => {
  if (typeof window === 'undefined') return;
  const storageKey = getStorageKey(account, key);
  localStorage.setItem(storageKey, JSON.stringify(value));
};