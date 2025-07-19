import { SimpleTable } from "../SimpleTable"

describe("SimpleTable", () => {
  it("Renders correctly.", () => {
    cy.mount(
      <SimpleTable>
        <thead>
          <tr>
            <th colSpan={2}>Short Links</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
          <tr>
            <td>
              <a href="some-link">A link in the data</a>
            </td>
            <td>Data 2</td>
          </tr>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </SimpleTable>,
    )

    cy.get("table").compareSnapshot("simple-table")
  })
})
