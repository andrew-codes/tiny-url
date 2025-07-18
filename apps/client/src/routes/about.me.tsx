import { FC, StrictMode } from "react"
import * as ReactDOM from "react-dom/client"

const App: FC = () => {
  return (
    <div>
      <h1>About Me</h1>
      <p>This is the about me.</p>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
