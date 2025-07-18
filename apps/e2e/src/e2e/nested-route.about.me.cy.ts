describe("Nested routes.", () => {
  it("Page load.", () => {
    cy.visit("/about/me")
    cy.contains("About Me")
  })

  it("Page load with trailing slash.", () => {
    cy.visit("/about/me/")
    cy.contains("About Me")
  })

  it("Page load nested route that does not exist.", () => {
    cy.visit("/about/me/details")
    cy.contains("About Me")
  })
})
