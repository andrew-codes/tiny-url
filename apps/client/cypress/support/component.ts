import compareSnapshotCommand from "cypress-image-diff-js"
import { mount } from "cypress/react"
import { createElement } from "react"
import { GlobalStyles } from "../../src/features/components/GlobalStyles"

console.debug("GlobalStyles", GlobalStyles)

Cypress.Commands.add("mount", (component, options) => {
  return mount(
    createElement("div", {
      children: [createElement(GlobalStyles), component],
    }),
    options,
  )
})

compareSnapshotCommand()
