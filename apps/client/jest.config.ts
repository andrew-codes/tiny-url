const config = {
  displayName: "client",
  preset: "../../jest.preset.js",
  resetMocks: true,
  transform: {
    "^(?!.*\\.(js|ts|json)$)": "@nx/react/plugins/jest",
    "^.+\\.[tj]s$": ["babel-jest", { presets: ["@nx/react/babel"] }],
  },
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "../../coverage/apps/client",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{js,ts}"],
}

export default config
