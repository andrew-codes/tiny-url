import styled from "@emotion/styled"
import { FC, useCallback, useState } from "react"
import { Button } from "../components/Button"
import { TextField } from "../components/TextField"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CreateForm: FC<{
  onCreate: (
    evt: React.FormEvent<HTMLFormElement>,
    data: { longUrl: string; shortUrl: string },
  ) => void
}> = ({ onCreate }) => {
  const [error, setError] = useState<string | false>(false)

  const handleSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault()
      const form = evt.target as HTMLFormElement
      const data = new FormData(form)
      if (!data.get("longUrl")) {
        setError("URL is required")
        return
      }

      setError(false)
      fetch("/api/url/short", {
        method: "POST",
        body: JSON.stringify({ longUrl: data.get("longUrl") }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          if (!result?.shortUrl) {
            return Promise.reject("No shortUrl returned from API")
          }
          form.reset()
          onCreate(evt, { longUrl: data.get("longUrl") as string, shortUrl: result.shortUrl })
        })
        .catch((err) => {
          setError("There was a problem creating the short URL. Please try again.")
          console.error("Error creating short URL:", err)
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
        error={error}
        hintText="Enter a long URL"
        startAdornment={
          <span role="img" aria-label="link">
            🔗
          </span>
        }
      />
      <Button type="submit">Shorten URL</Button>
    </Form>
  )
}

export { CreateForm }
