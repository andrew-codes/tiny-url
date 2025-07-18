import styled from "@emotion/styled"
import { FC, useState } from "react"

const ErrorMessage = styled.p`
  color: red;
`

const CreateForm: FC<{
  onCreate: (
    evt: React.FormEvent<HTMLFormElement>,
    data: { longUrl: string; shortUrl: string },
  ) => void
}> = ({ onCreate }) => {
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault()
        const form = evt.target as HTMLFormElement
        const data = new FormData(form)
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
      }}
    >
      <input name="longUrl" type="url" placeholder="Enter long URL" required />
      <button type="submit">Shorten URL</button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  )
}

export { CreateForm }
