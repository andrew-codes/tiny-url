import { FC, StrictMode } from "react"
import * as ReactDOM from "react-dom/client"

const App: FC = () => {
  return (
    <div>
      <h1>We're still searching for this page...</h1>
      <p>
        Sorry, looks like we've misplaced this page. Please check the URL or return to the home
        page.
      </p>
      <p>Status: 404</p>
      <p>
        <a href="/">Go to Home Page</a>
      </p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
