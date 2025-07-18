# Design

- [Design](#design)
  - [Nx Tooling](#nx-tooling)
  - [Workspaces](#workspaces)
  - [SSR Implications](#ssr-implications)
    - [Route Coupling](#route-coupling)
    - [App Hydration](#app-hydration)
  - [Cypress and Playwright](#cypress-and-playwright)
  - [Packaging for Deployment](#packaging-for-deployment)

## Nx Tooling

Nx enables management of multiple projects, across technology boundaries in a mono-repo. To view all projects and how they relate/depend on one another, try running the command `yarn nx graph` (interactive project graph in a browser).

Additionally, Nx enables automation of developer oriented tasks (think scaffolding or moving projects). Note while Nx provides many built-in generators, creating new ones is very straight-forward and allows customization of the task to your app.

> Ask me about how Nx can improve DX and significantly speed up building, testing, other tasks when developing locally.

## Workspaces

Given I'm using Nx as my mono-repo tooling, there are multiple `package.json` files. To efficiently manage required dependencies on disk, I'm using Yarn (@berry) workspaces.

> Note, I typically prefer zero-installs with Yarn PnP, but I have not configured for this demo. This can reduce installation of dependencies in CI by orders of magnitude.

## SSR Implications

With any non-Node.js based web server, there is a problem bridging a gap between React (other modern component library) and server-side rendering. For practical purposes, a dotnet web server is not going to be able to support SSR with React. This design choice leaves us with a few realities. I'll list them below and then show how I've chosen to mitigate each one.

1. Route Coupling: imposes a tight coupling between server-side routes and page apps; each route must have a corresponding page app bundle.
2. App Hydration: the web server responds with a blank HTML page for every page app that exists. React will bootstrap and render the app fully client-side.

### Route Coupling

Most, if not all, HTML responses to clients will be a blank HTML document. This is due to the inability to do SSR. For this reason, every (rich) route will require a JS bundle that will bootstrap and render the app fully client-side. The problem this creates is a tight coupling between the bundles and server-side routes. As an example, new page apps (primary bundle for each page) will require creating a new JS bundle. However, the web server must also be updated to serve a blank HTML page with this bundle included. This is the coupling of who owns the route?

I've chosen to solve this with a very rudimentary implementation. All page app routes are handled by a fallback in the web server. The fallback is able to determine if the incoming request matches a page app bundle. If so, then this page app is served to users. If not, then a 404 route is used (also a page app). How a request is mapped to a page app is as follows:

1. The request path is mapped to a JS bundle file by name, e.g. `/about` maps to `app/about.js`
2. `/` always maps to `app/index.js`
3. Nested route segments match with a period file name pattern, e.g. `about/me` matches `about.me.js`
4. Nested route segments match the furthest file pattern depth when one does not exist, e.g., `about/me/more` maps to `about.me.js` when `about.me.more.js` does not exist

This allows new page applications to be added without making changes to the web server. This also can be used to enable client-side routing if desired.

### App Hydration

In order for a the user to see the page, React must render into the blank page. However, it may require server data to be complete this request. This leaves with 2 standard options:

1. Gather all data required for rendering on the server, serve this with the HTML as a JSON script embedded on the page, use for hydration on first render.
2. Render the app without data and fetch required data from server after first render.

The first option will yield a better user experience, but also is technically more complex. For the purposes of a demo, I've opted for option 2.

## Cypress and Playwright

I've chosen to use Cypress for a very important, differentiating reason. Playwright does not support component level tests. Supporting component level testing with Playwright, is more akin to creating a web site for the sole purpose of rendering components in isolation that can then be tested by Playwright. However, the setup to render a component in a certain state is no longer owned by the test. Cypress enables true component level testing; something I find more valuable than E2E tests in practice. Given Cypress is will already be included, I typically use it for E2E to minimize the cognitive overhead of working with the tests and application.

> Ask me how I normally test and assert that components "look right."

## Packaging for Deployment

I've opted to skip this step for the sake of the demo. Although there are circumstances that may dictate a specific deployment packaging, my go to in most cases is to package as a versioned container. I'd favor a Linux container if possible; given Windows-based containers do not work well with Linux-based ones for deployments to k8s, etc.
