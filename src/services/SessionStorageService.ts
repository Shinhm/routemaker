class SessionStorageService {
  static hasKey(key: string) {
    return !!window.sessionStorage.getItem(key)?.length;
  }
  static get(key: string) {
    return window.sessionStorage.getItem(key);
  }
  static set(entries: { key: string; value: any }) {
    window.sessionStorage.setItem(entries.key, entries.value);
  }
}
export default SessionStorageService;
