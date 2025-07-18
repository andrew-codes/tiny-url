import { FC, StrictMode, useEffect, useState } from "react"
import * as ReactDOM from "react-dom/client"
import { CreateForm } from "../features/url/CreateForm"

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
    <div>
      <CreateForm
        onCreate={(evt, data) => {
          setShortenedUrls((prev) => [...prev, { shortUrl: data.shortUrl, accessCount: 0 }])
        }}
      />
      <table>
        <thead>
          <tr>
            <th>Shortened URLs</th>
            <th>Access Count</th>
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
      </table>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
