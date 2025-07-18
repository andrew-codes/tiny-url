import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import react from "@vitejs/plugin-react"
import fs from "fs"
import path from "path"
import { defineConfig } from "vite"

const pageApps = fs
  .readdirSync(path.resolve(__dirname, "src/routes"))
  .filter((f) => f.endsWith(".tsx"))
  .reduce(
    (acc, f) => {
      acc[f.replace(".tsx", "")] = path.resolve(__dirname, `src/routes/${f}`)
      return acc
    },
    {} as Record<string, string>,
  )

export default defineConfig(() => ({
  root: __dirname,
  base: "/app/",
  cacheDir: "../../node_modules/.vite/apps/client",
  plugins: [react(), nxViteTsPaths()],
  build: {
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: pageApps,
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
}))
