import styled from "@emotion/styled"
import { FC, StrictMode, useEffect, useState } from "react"
import * as ReactDOM from "react-dom/client"
import { GlobalStyles } from "../features/components/GlobalStyles"
import { SimpleTable } from "../features/components/SimpleTable"
import { CreateForm } from "../features/url/CreateForm"

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
`

const App: FC = () => {
  const [shortenedUrls, setShortenedUrls] = useState<Array<{ shortUrl: string }>>([])

  useEffect(() => {
    fetch("/api/url/list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setShortenedUrls(data)
        }
      })
      .catch((err) => {
        console.error("Error fetching shortened URLs:", err)
      })
  }, [])

  return (
    <Container>
      <CreateForm
        onCreate={(evt, data) => {
          setShortenedUrls((prev) => [...prev, { shortUrl: data.shortUrl, accessCount: 0 }])
        }}
      />
      <SimpleTable>
        <thead>
          <tr>
            <th colSpan={2}>Short Links</th>
          </tr>
        </thead>
        <tbody>
          {shortenedUrls.map(({ shortUrl, accessCount }, idx) => (
            <tr key={idx}>
              <td>
                <a href={shortUrl} rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </td>
              <td>{accessCount}</td>
            </tr>
          ))}
        </tbody>
      </SimpleTable>
    </Container>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)
root.render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>,
)
