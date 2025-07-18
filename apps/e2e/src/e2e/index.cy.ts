describe("Index page.", () => {
  beforeEach(() => cy.visit("/"))

  it("Page load.", () => {
    cy.contains("Home page")
  })
})
