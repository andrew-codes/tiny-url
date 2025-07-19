import { defineConfig } from "cypress"
import * as getCompareSnapshotsPlugin from "cypress-image-diff-js/plugin"

export default defineConfig({
  component: {
    specPattern: "**/__component_tests__/*.test.tsx",
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents: (on, config) => {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--window-size=1920,1080")
          launchOptions.args.push("--force-zoom-factor=2")
          launchOptions.args.push("--no-sandbox")
          launchOptions.args.push("--disable-gpu")
          launchOptions.args.push("--disable-dev-shm-usage")
          launchOptions.args.push("--disable-software-rasterizer")
        }

        return launchOptions
      })

      return getCompareSnapshotsPlugin(on, config)
    },
  },
})
