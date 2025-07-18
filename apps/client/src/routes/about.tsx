import { FC, StrictMode } from "react"
import * as ReactDOM from "react-dom/client"

const App: FC = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our application.</p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
