import { Button } from "../Button"

describe("Button", () => {
  it("Default.", () => {
    cy.mount(<Button>Click me</Button>)

    cy.get('[data-test-id="button"]').compareSnapshot({
      name: "button",
      cypressScreenshotOptions: {
        disableTimersAndAnimations: true,
      },
    })
  })

  it("With onClick handler.", () => {
    const onClick = cy.stub().as("onClick")
    cy.mount(<Button onClick={onClick}>Click me</Button>)
    cy.get("button").click()

    cy.get("@onClick").should("have.been.calledOnce")
  })

  it("Disabled.", () => {
    const onClick = cy.stub().as("onClick")
    cy.mount(
      <Button onClick={onClick} disabled>
        Click me
      </Button>,
    )
    cy.get("button").click({ force: true })

    cy.get("@onClick").should("not.have.been.called")
  })

  it("Renders children.", () => {
    cy.mount(
      <Button>
        <span role="img" aria-label="link">
          🔗
        </span>
        <span>Click me</span>
      </Button>,
    )
    cy.get("button span").should("have.length", 2)
  })
})
