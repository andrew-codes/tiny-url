import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset"
import { defineConfig } from "cypress"
import { merge } from "lodash"

const START_COMMAND = process.env.START_COMMAND
let webServerCommands = null
if (START_COMMAND !== "") {
  webServerCommands = { default: START_COMMAND }
}

console.debug("CYPRESS START_COMMAND: ", START_COMMAND)

export default defineConfig({
  e2e: {
    ...nxE2EPreset(
      __filename,
      merge({
        cypressDir: "src",
        webServerCommands: webServerCommands,
        ciBaseUrl: "http://localhost:5289",
      }),
    ),
    onSetupNodeEvents: (on, config) => {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--window-size=1920,1080")
          launchOptions.args.push("--force-zoom-factor=1")
          launchOptions.args.push("--no-sandbox")
          launchOptions.args.push("--disable-gpu")
          launchOptions.args.push("--disable-dev-shm-usage")
          launchOptions.args.push("--disable-software-rasterizer")
        }

        return launchOptions
      })
    },
    baseUrl: "http://localhost:5289",
    pageLoadTimeout: 120000,
  },
})
