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
- If it's different → clears `localStorage`, clears `Cache Storage`, and reloads the page!

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

export default defineConfig({
  plugins: [
    // ... other plugins
    versionPlugin(), // Add at the end of plugins array
  ],
});
```

**⚠️ Important:** Make sure to add `versionPlugin()` at the **end** of your plugins array for optimal performance.

#### 2. In your app entry (`main.js`, `main.ts`, etc):

```js
import { checkVersionAndReload } from "auto-clear-cache";

checkVersionAndReload();
```

---

### ✅ Vue 3 (Vite)

#### 1. First, add the plugin to `vite.config.js`:

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { versionPlugin } from "auto-clear-cache";

export default defineConfig({
  plugins: [
    vue(),
    // ... other plugins
    versionPlugin(), // Must be added to generate version.json
  ],
});
```

#### 2. Then use it in your `main.js`:

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import { checkVersionAndReload } from "auto-clear-cache";

checkVersionAndReload(); // check before mounting

createApp(App).mount("#app");
```

**⚠️ Important:** You MUST add `versionPlugin()` to your Vite config first, otherwise `checkVersionAndReload()` will fail because `version.json` won't exist.

---

### ✅ React (Vite)

#### 1. First, add the plugin to `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { versionPlugin } from "auto-clear-cache";

export default defineConfig({
  plugins: [
    react(),
    // ... other plugins
    versionPlugin(), // Must be added to generate version.json
  ],
});
```

#### 2. Then use it in your `main.jsx`:

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
versionPlugin({
  fileName: "my-version.json",
  outDir: "build",
});
```

---

## 🔧 Troubleshooting

### Plugin Not Generating version.json

If `checkVersionAndReload()` fails with a network error, make sure you've added the plugin to your build configuration:

```js
// vite.config.js
import { versionPlugin } from "auto-clear-cache";

export default defineConfig({
  plugins: [
    // ... your other plugins
    versionPlugin(), // ← This is REQUIRED
  ],
});
```

Without the plugin, no `version.json` file will be created, and the version check will fail.

### Node.js Module Import Issues

If you encounter errors like `"resolve" is not exported by "__vite-browser-external:path"`, make sure your plugin file uses the correct Node.js module imports:

```js
// ✅ Correct - vite-plugin-version.js
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

export default function versionPlugin(options = {}) {
  return {
    name: "vite-plugin-version",
    apply: "build", // Only run during build
    closeBundle() {
      const version = Date.now().toString();
      const outDir = options.outDir || "dist";
      const filePath = resolve(outDir, options.fileName || "version.json");
      writeFileSync(filePath, JSON.stringify({ version }, null, 2));
      console.log(`📦 version.json created with version ${version}`);
    },
  };
}
```

### ES Module Configuration

Ensure your `package.json` has the correct module configuration:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.js"
    },
    "./vite": {
      "import": "./vite-plugin-version.js"
    }
  }
}
```

### Plugin Order in Vite

Place the version plugin at the **end** of your plugins array in `vite.config.js`:

```js
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // ... other plugins
    versionPlugin(), // ← Last plugin
  ],
});
```

---

## ❓ FAQ

### Q: What if the user is offline?

The `fetch('/version.json')` uses `{ cache: 'no-store' }`, and will simply fail silently if offline — no reload happens.

### Q: Does this clear service workers?

No, this version doesn't unregister service workers yet — but you can easily extend it.

### Q: Can I see a working demo?

Coming soon: demo repo with Vue, React & Vanilla JS versions!

### Q: checkVersionAndReload() is not working / giving network errors?

Make sure you've added `versionPlugin()` to your Vite config first. Without it, no `version.json` file is generated, and the function will fail to fetch the version.

### Q: Why do I get "require is not defined" errors?

This happens when mixing CommonJS (`require`) with ES modules. Make sure all your files use ES module syntax (`import`/`export`) and your `package.json` has `"type": "module"`.

---

## 🧪 Tested With:

- ✅ Vue 3 + Vite
- ✅ React + Vite
- ✅ Vanilla JS
- ✅ Chrome, Firefox, Safari
- ✅ Static site deployment (Netlify, Firebase, etc)

---

## ✅ Angular (CLI or Vite-based)

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

## ✅ Framework Compatibility

| Framework  | Works? | Notes                   |
| ---------- | ------ | ----------------------- |
| Vue 3      | ✅     | Vite recommended        |
| React      | ✅     | Vite recommended        |
| Angular    | ✅     | CLI or Vite             |
| Vanilla JS | ✅     | Any static site         |
| Svelte     | ✅     | Vite or manual setup    |
| Nuxt       | ✅     | Use in client-side only |
| Next.js    | ⚠️     | Requires custom setup   |

---

## 📌 TODO (Contributions Welcome!)

- [ ] Add CLI (`auto-clear-cache init`)
- [ ] Add support for unregistering service workers
- [ ] Add integration with Webpack
- [ ] Add example repo
- [ ] Add TypeScript definitions
- [ ] Add Next.js compatibility

---

## 🔖 License

MIT — by [Kerolos Zakaria](https://github.com/keroloszakaria)

---

Let your users always enjoy the latest version of your app — no more "it's not working" because of stale cache 🚀

## 🤝 Contributing

Found a bug or want to add a feature? PRs are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
