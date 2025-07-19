import { css, Global } from "@emotion/react"

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        html,
        body {
          margin: 1.25rem 1rem;
          font-size: 16px;
          padding: 0;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
            "Open Sans", "Helvetica Neue", sans-serif;
          background-color: #fff;
        }

        a {
          color: #6c63ff;
        }
      `}
    />
  )
}

export { GlobalStyles }
