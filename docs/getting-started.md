# Getting Started

There are two primary ways to run the project; bare metal (on a developer host machine) and via a dev container. Note there are some [caveats](./dev-container.md#caveats) when running in a dev container. Bare metal produces the best DX (developer experience) in regards to e2e and component tests; so it is the preferred mechanism. See the [dev container](./dev-container.md) docs for more information on running in a dev container.

## Bare Metal

Any major OS should run this project. I developed and verified on macOS. Ensure you have the following software installed:

### Step 1: Required Software

1. Node.js@^22.17.0
2. Bash (git bash is fine)
   > Although most of my scripts are written in Bash, I recommend writing them to be shell independent. Ask me how I accomplish this and how Nx makes it simple to do so.
3. dotnet
   1. CLI (available on PATH)
   2. sdk@9.0.302
   3. runtimes: Microsoft.AspNetCore.App 9.0.7, Microsoft.NETCore.App 9.0.7
4. [jq](https://jqlang.org/) (available on PATH)
5. Browser (tested using MS Edge)
6. vscode

#### Step 2: Setup

All commands are run in bash and in the root directory of the repo. The tooling chosen means there is not a need to change directory into a project or sub-directory.

```bash
# Setup projects (required for all OS)
source ./.devcontainer/setupYarn.sh

# Optionally (but recommended): automatically install all recommended vscode extensions
# Referenced from [extensions.json](../.vscode/extensions.json)
source ./scripts/install-extensions.sh

# If using Linux, this may be required instead.
source ./.devcontainer/postCreate.sh
```

## Running Project

This demo consists of 2 projects, a dotnet web server and a React front-end. Running the application requires coordination between building and serving across these two apps; one in dotnet, the other in TypeScript. However, this is all handled by the e2e project automatically. It represents both the E2E tests and the e2e running for local development.

```bash
# Run e2e tests with debugging enabled (useful for development)
yarn nx open-cypress e2e

# Or run all e2e tests (useful for running in CI)
yarn nx test/e2e e2e

# Or start app for browsing
yarn nx start e2e # Open http://localhost:5289 in browser of choice

# Dev container only
# In a separate shell, this will open the browser with remote debugging enabled.
yarn nx open-chromium e2e
```

### Tests

> Please note that it is recommended to run test/unit tests in vscode for debugging capabilities.

```bash
# Run component tests with debugging/for development (includes visual regression testing)
yarn nx open-cypress client
# View [visual baseline directory](./../apps/client/visual-tests/screenshots/baseline) for visual regression outputs.

# Run all component tests
yarn nx test/component client

# Run Web server unit tests
yarn nx test/unit web
```

### Debugging

Console.log's are painful, so IDE breakpoints are supported and automatically enabled.

1. Start the app via one of the above targets, `open-cypress`, `run-cypress`, or `start` on the e2e project.
2. For dotnet, launch the `Debug .NET Web Server` in vscode.
3. For TS, the browser will need to be launched with [remote debugging enabled](./#enable-browser-remote-debugging). Note that E2E/component tests do this automatically.
   1. Based on your browser, once open to the http://localhost:5289, launch the `Debug with Edge` or `Debug with Chrome`

> Note IDE debugging is not enabled for component tests due to time restrictions.

#### Enable Browser Remote Debugging

For MS Edge (and Chrome), the browser will need to be launched with remote debugging enabled in order for breakpoints to work. You can do so as follows in your shell of choice. Note to replace edge.exe with the path to MS Edge (or Chrome).

```sh
edge.exe --remote-debugging-port=9222 --user-data-dir=remote-debug-profile
```
