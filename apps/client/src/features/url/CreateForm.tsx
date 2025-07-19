import styled from "@emotion/styled"
import { merge } from "lodash"
import { FC, useCallback, useReducer } from "react"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

type ErrorState = Record<string, string>
type ErrorActions =
  | { type: "SET_ERROR"; payload: { field: string; message: string } }
  | { type: "CLEAR_ERRORS" }

const CreateForm: FC<{
  onCreate: (
    evt: React.FormEvent<HTMLFormElement>,
    data: { longUrl: string; shortUrl: string },
  ) => void
}> = ({ onCreate }) => {
  const [error, dispatch] = useReducer((state: ErrorState, action: ErrorActions) => {
    switch (action.type) {
      case "SET_ERROR":
        return merge({}, state, { [action.payload.field]: action.payload.message })
      case "CLEAR_ERRORS":
        return {}
      default:
        return state
    }
  }, {} as ErrorState)

  const handleSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault()
      const form = evt.target as HTMLFormElement
      const data = new FormData(form)
      if (!data.get("longUrl")) {
        dispatch({ type: "SET_ERROR", payload: { field: "longUrl", message: "URL is required" } })
        return
      }

      dispatch({ type: "CLEAR_ERRORS" })
      fetch("/api/url/short", {
        method: "POST",
        body: JSON.stringify({
          longUrl: data.get("longUrl"),
          vanityPath: data.get("vanityPath") ?? null,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return new Promise((resolve) => {
            res.json().then((result) => resolve([res, result]))
          }) as Promise<[Response, { shortUrl?: string; error?: string }]>
        })
        .then(([res, result]) => {
          if (!res.ok) {
            return Promise.reject(result.error || "Unknown error")
          }
          if (!result?.shortUrl) {
            return Promise.reject("No shortUrl returned from API")
          }
          form.reset()
          onCreate(evt, { longUrl: data.get("longUrl") as string, shortUrl: result.shortUrl })
        })
        .catch((err) => {
          console.error("Error creating short URL", err)
          if (err?.toString().includes("Duplicate")) {
            dispatch({
              type: "SET_ERROR",
              payload: { field: "vanityPath", message: "Vanity Path already exists." },
            })
            return
          }
          dispatch({
            type: "SET_ERROR",
            payload: {
              field: "form",
              message: "There was an unknown problem creating the short URL. Please try again.",
            },
          })
        })
    },
    [onCreate],
  )

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        required
        name="longUrl"
        type="url"
        label="URL"
        error={error.longUrl}
        hintText="Enter a long URL"
      />
      <TextField
        name="vanityPath"
        type="url"
        label="Vanity Path (optional)"
        hintText="Enter a vanity path (e.g. my-cool-link)"
        error={error.vanityPath}
      />
      <Button type="submit">Shorten URL</Button>
      {error.form && <div style={{ color: "red" }}>{error.form}</div>}
    </Form>
  )
}

export { CreateForm }
