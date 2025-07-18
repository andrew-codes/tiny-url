describe("404 page", () => {
  beforeEach(() => {
    cy.visit("/non-existent-page", { failOnStatusCode: false })
  })

  it("should display the 404 message", () => {
    cy.contains("404").should("be.visible")
  })

  it("should have a link to go back to the home page", () => {
    cy.get("a").contains("Go to Home").should("be.visible").click()
    cy.url().should("eq", Cypress.config().baseUrl + "/")
  })

  it("should return a 404 status code", () => {
    cy.request({
      url: "/non-existent-page",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
