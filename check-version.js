export async function checkVersionAndReload({
  path = "/version.json",
  localStorageKey = "app_version",
  clearLocalStorage = true,
  clearCache = true,
} = {}) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    const { version } = await res.json();

    const savedVersion = localStorage.getItem(localStorageKey);

    if (savedVersion && savedVersion !== version) {
      console.warn("[auto-clear-cache] New version detected. Reloading...");

      if (clearLocalStorage) localStorage.clear();

      if (clearCache && "caches" in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }

      location.reload();
    }

    localStorage.setItem(localStorageKey, version);
  } catch (error) {
    console.error("[auto-clear-cache] Failed to check version:", error);
  }
}
