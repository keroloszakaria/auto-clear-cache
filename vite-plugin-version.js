export default function versionPlugin(options = {}) {
  const fileName = options.fileName || "version.json";

  return {
    name: "vite-plugin-version",
    apply: "build",
    async closeBundle() {
      try {
        // Dynamic import للـ Node.js modules
        const { writeFileSync } = await import("node:fs");
        const { resolve } = await import("node:path");

        const version = Date.now().toString();
        const outDir = options.outDir || "dist";
        const filePath = resolve(outDir, fileName);

        writeFileSync(filePath, JSON.stringify({ version }, null, 2));
        console.log(`📦 version.json created with version ${version}`);
      } catch (error) {
        console.error("❌ Failed to create version.json:", error);
      }
    },
  };
}
