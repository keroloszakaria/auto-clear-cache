# 🚀 auto-clear-cache

Automatically clears browser cache and reloads your app when a new build version is detected — so your users always get the latest updates!

---

## ✨ Why?

Modern browsers **cache aggressively** — especially assets like `main.js`, `styles.css`, etc.  
So when you ship a new build, your users might still be using old, cached versions 😬

**auto-clear-cache** solves this by:

- Generating a unique version for each build
- Saving the version to `version.json`
- Comparing that version on app load
- If it’s different → clears `localStorage`, clears `Cache Storage`, and reloads the page!

---

## ⚙️ Installation

```bash
npm install auto-clear-cache
```

Or use directly in your HTML or app.

---

## 🧠 How It Works

1. During build, the plugin generates `dist/version.json` with a timestamp version.
2. On app load, it fetches `version.json` and compares it with what's saved in `localStorage`.
3. If the version has changed:
   - Clears `localStorage`
   - Clears `Cache Storage`
   - Reloads the page (to force loading latest assets)

---

## 🛠️ Usage

### ✅ Vite (Vue, React, Svelte...etc)

#### 1. In `vite.config.js`:

```js
import { versionPlugin } from "auto-clear-cache";

export default {
  plugins: [versionPlugin()],
};
```

#### 2. In your app entry (`main.js`, `main.ts`, etc):

```js
import { checkVersionAndReload } from "auto-clear-cache";

checkVersionAndReload();
```

---

### ✅ Vue 3 (Vite)

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import { checkVersionAndReload } from "auto-clear-cache";

checkVersionAndReload(); // check before mounting

createApp(App).mount("#app");
```

---

### ✅ React (Vite)

```js
// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { checkVersionAndReload } from "auto-clear-cache";

checkVersionAndReload().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
});
```

---

### ✅ Vanilla JS (no framework)

1. After `build`, copy `version.json` to your deployment folder.
2. Add the following to your main HTML or JS:

```html
<script type="module">
  import { checkVersionAndReload } from "./path-to/auto-clear-cache/check-version.js";
  checkVersionAndReload();
</script>
```

Or bundle it in your build with Rollup/Webpack.

---

## 🔧 Options

You can pass config options to `checkVersionAndReload()`:

```js
checkVersionAndReload({
  path: "/version.json", // Path to version file
  localStorageKey: "app_version", // Key name in localStorage
  clearLocalStorage: true, // Whether to clear localStorage
  clearCache: true, // Whether to clear CacheStorage
});
```

---

## 📁 What versionPlugin() Does

In your build folder (`dist/`), this plugin creates a file like:

```json
{
  "version": "1720223342331"
}
```

You can change file name and output path if needed:

```js
versionPlugin({ fileName: "my-version.json", outDir: "build" });
```

---

## ❓ FAQ

### Q: What if the user is offline?

The `fetch('/version.json')` uses `{ cache: 'no-store' }`, and will simply fail silently if offline — no reload happens.

---

### Q: Does this clear service workers?

No, this version doesn’t unregister service workers yet — but you can easily extend it.

---

### Q: Can I see a working demo?

Coming soon: demo repo with Vue, React & Vanilla JS versions!

---

## 🧪 Tested With:

- ✅ Vue 3 + Vite
- ✅ React + Vite
- ✅ Vanilla JS
- ✅ Chrome, Firefox, Safari
- ✅ Static site deployment (Netlify, Firebase, etc)

---

## 📌 TODO (Contributions Welcome!)

- [ ] Add CLI (`auto-clear-cache init`)
- [ ] Add support for unregistering service workers
- [ ] Add integration with Webpack
- [ ] Add example repo

---

## 🔖 License

MIT — by [Krullus](https://github.com/krullus)

---

## 📸 Optional: Add an infographic

_We can create a simple diagram later showing:_

> build → generate version.json → compare → cache clear → reload

---

### ✅ Angular (CLI or Vite-based)

#### 🔹 If using Angular CLI (default setup):

1. Create a version file manually after build using a Node script:

```js
// generate-version.js
const fs = require("fs");
const path = require("path");

const version = Date.now().toString();
fs.writeFileSync(
  path.resolve(__dirname, "dist/version.json"),
  JSON.stringify({ version })
);
```

2. Update your `package.json` build script:

```json
"scripts": {
  "build": "ng build && node generate-version.js"
}
```

3. Modify your `main.ts` to call the version checker **before** bootstrapping Angular:

```ts
import { checkVersionAndReload } from "auto-clear-cache";

checkVersionAndReload().then(() => {
  import("./app/app.module").then(({ AppModule }) => {
    import("@angular/platform-browser-dynamic").then(
      (platformBrowserDynamic) => {
        platformBrowserDynamic
          .platformBrowserDynamic()
          .bootstrapModule(AppModule)
          .catch((err) => console.error(err));
      }
    );
  });
});
```

---

#### 🔹 If using Angular with Vite:

Use the same instructions as for Vite projects:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { versionPlugin } from "auto-clear-cache";

export default defineConfig({
  plugins: [versionPlugin()],
});
```

Then add `checkVersionAndReload()` to `main.ts` before app initialization.

---

## ✅ Summary

| Framework  | Works? | Notes           |
| ---------- | ------ | --------------- |
| Vue 3      | ✅     | Vite only       |
| React      | ✅     | Vite only       |
| Angular    | ✅     | CLI or Vite     |
| Vanilla JS | ✅     | Any static site |
| Svelte     | ✅     | Vite or manual  |

---

Let your users always enjoy the latest version of your app — no more "it's not working" because of stale cache 🚀
