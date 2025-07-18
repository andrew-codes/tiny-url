import { FC, StrictMode } from "react"
import * as ReactDOM from "react-dom/client"

const App: FC = () => {
  return <p>Home page</p>
}

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
