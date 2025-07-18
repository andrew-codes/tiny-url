describe("About Us page.", () => {
  beforeEach(() => cy.visit("/about"))

  it("Page load.", () => {
    cy.contains("About Us")
  })
})
