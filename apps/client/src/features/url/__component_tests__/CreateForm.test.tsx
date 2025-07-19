import { CreateForm } from "../CreateForm"

describe("CreateForm", () => {
  it(`Form renders.`, () => {
    cy.mount(<CreateForm onCreate={cy.stub()} />)
    cy.get("form")
    cy.get('input[name="longUrl"]')
    cy.get('button[type="submit"]')
  })

  it(`Invalid form.`, () => {
    const onCreate = cy.stub().as("onCreate")

    cy.mount(<CreateForm onCreate={onCreate} />)

    cy.get('button[type="submit"]').click()
    cy.get("@onCreate").should("not.have.been.called")
  })

  it(`Form submits.`, () => {
    const shortUrl = "http://short.url/abc123"
    cy.intercept("POST", "/api/url/short", {
      statusCode: 201,
      body: { shortUrl },
    }).as("createUrl")
    const onCreate = cy.stub().as("onCreate")

    cy.mount(<CreateForm onCreate={onCreate} />)

    cy.get('button[type="submit"]').click()
    cy.get('input[name="longUrl"]').focus().type("https://example.com")
    cy.get('button[type="submit"]').click()
    cy.get("@onCreate").should("have.been.calledOnceWith", Cypress.sinon.match.any, {
      longUrl: "https://example.com",
      shortUrl: shortUrl,
    })

    cy.wait("@createUrl")
    cy.get('input[name="longUrl"]').should("have.value", "")
  })

  it(`Form handles API error.`, () => {
    cy.intercept("POST", "/api/url/short", {
      statusCode: 400,
      body: { error: "Duplicate" },
    }).as("createUrl")
    const onCreate = cy.stub().as("onCreate")

    cy.mount(<CreateForm onCreate={onCreate} />)

    cy.get('input[name="longUrl"]').focus().type("https://example.com")
    cy.get('button[type="submit"]').click()
    cy.get("@onCreate").should("not.have.been.called")

    cy.wait("@createUrl")
    cy.get('[data-test-id="textfield"]').eq(1).contains("Vanity Path already exists.")
  })
})
