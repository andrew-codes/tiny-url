import { getJestProjectsAsync } from "@nx/jest"
import type { Config } from "jest"

const config = async (): Promise<Config> => ({
  projects: await getJestProjectsAsync(),
  resetMocks: true,
  testMatch: ["<rootDir>/apps/*/src/**/__tests__/**/*.{js,ts}"],
})

export default config
