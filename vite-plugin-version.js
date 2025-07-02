import { writeFileSync } from 'fs';
import { resolve } from 'path';

export default function versionPlugin(options = {}) {
  const fileName = options.fileName || 'version.json';
  return {
    name: 'vite-plugin-version',
    closeBundle() {
      const version = Date.now().toString();
      const outDir = options.outDir || 'dist';
      const filePath = resolve(outDir, fileName);
      writeFileSync(filePath, JSON.stringify({ version }));
      console.log(`📦 version.json created with version ${version}`);
    }
  };
}
