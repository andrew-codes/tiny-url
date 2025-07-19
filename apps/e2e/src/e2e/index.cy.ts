describe("Index page.", () => {
  beforeEach(() => {
    cy.request("POST", "/api/url/clear")
    cy.visit("/")
  })

  it(`Tiny URL creation.
    - Create one or more shortened URLs.
    - Shortened URLs are displayed on the page.`, () => {
    cy.intercept("POST", "/api/url/short").as("shortenUrl")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://andrew.codes")
      cy.get('button[type="submit"]').click()
      cy.get('input[name="longUrl"]').should("have.value", "")
    })
    cy.get("@shortenUrl").then((interception) => {
      expect(interception?.response?.statusCode).to.eq(201)
      expect(interception?.response?.body).to.have.property("shortUrl")
      cy.wrap(interception?.response?.body.shortUrl).as("shortenedUrlResponse")
    })

    cy.wait("@shortenUrl")

    cy.origin("https://andrew.codes", () => {
      cy.on("uncaught:exception", (e) => {
        return false
      })
    })

    cy.get("table").within(() => {
      cy.get("tbody tr").its("length").should("be.gte", 1)
      cy.get("tbody tr").first().find("td").first().find("a").click()
    })
    cy.url().should("eq", "https://andrew.codes/")
  })

  it(`Page loads existing shortened URLs.
    - Fetches after page load.`, () => {
    cy.intercept("POST", "/api/url/short").as("shortenUrl")
    cy.intercept("GET", "/api/url/list").as("listUrls")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://www.linkedin.com/in/jamesandrewsmith")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://github.com/andrew-codes")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://andrew.codes")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl")

    cy.reload()
    cy.wait("@listUrls")

    cy.get("table").within(() => {
      cy.get("tbody tr").should("have.length.gte", 3)
    })
  })

  it(`Short URL analytics.`, () => {
    cy.intercept("POST", "/api/url/short").as("shortenUrl")
    cy.intercept("GET", "/api/url/list").as("listUrls")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://andrew.codes")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl")

    for (let i = 0; i < 4; i++) {
      cy.get("table").within(() => {
        cy.get("tbody tr").eq(0).find("td").first().find("a").click()
        cy.go("back")
      })
      cy.get("table tbody tr")
        .eq(0)
        .find("td")
        .eq(1)
        .should("contain.text", `${i + 1}`)
    }
  })

  it(`Vanity URL creation.
    - Create a shortened URL with a vanity path.
    - Shortened URL is displayed on the page.`, () => {
    cy.intercept("POST", "/api/url/short").as("shortenUrl")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://andrew.codes")
      cy.get('input[name="vanityPath"]').type("my-cool-link")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl").then((interception) => {
      expect(interception?.response?.statusCode).to.eq(201)
      expect(interception?.response?.body).to.have.property("shortUrl")
      cy.wrap(interception?.response?.body.shortUrl).as("shortenedUrlResponse")
    })

    cy.get("table").within(() => {
      cy.get("tbody tr").its("length").should("be.gte", 1)
      cy.get("tbody tr").first().find("td").first().contains("a", "my-cool-link").click()
    })
    cy.url().should("eq", "https://andrew.codes/")
    cy.go("back")
  })

  it.only(`Duplicate vanity URL creation.
    - Creates first one.
    - Errors shown on second attempt; URL is not created or updated.`, () => {
    cy.intercept("POST", "/api/url/short").as("shortenUrl")

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://andrew.codes")
      cy.get('input[name="vanityPath"]').type("my-cool-link")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl").then((interception) => {
      expect(interception?.response?.statusCode).to.eq(201)
      expect(interception?.response?.body).to.have.property("shortUrl")
      cy.wrap(interception?.response?.body.shortUrl).as("shortenedUrlResponse")
    })

    cy.get("form").within(() => {
      cy.get('input[name="longUrl"]').type("https://github.com/andrew-codes")
      cy.get('input[name="vanityPath"]').type("my-cool-link")
      cy.get('button[type="submit"]').click()
    })
    cy.wait("@shortenUrl").then((interception) => {
      expect(interception?.response?.statusCode).to.eq(400)
      expect(interception?.response?.body).to.contain("Short URL already exists.")
    })

    cy.get("table").within(() => {
      cy.get("tbody tr").its("length").should("be.gte", 1)
      cy.get("tbody tr").first().find("td").first().contains("a", "my-cool-link").click()
    })
    cy.url().should("eq", "https://andrew.codes/")
    cy.go("back")
  })
})
