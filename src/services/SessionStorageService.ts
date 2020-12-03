class SessionStorageService {
  hasKey(key: string) {
    return !!window.sessionStorage.getItem(key)?.length;
  }
  get(key: string) {
    return window.sessionStorage.getItem(key);
  }
  set(entries: { key: string; value: any }) {
    window.sessionStorage.setItem(entries.key, entries.value);
  }
}
export default new SessionStorageService();
