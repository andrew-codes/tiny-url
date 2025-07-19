import styled from "@emotion/styled"
import { FC, ReactNode, useRef, useState } from "react"

const TextFieldContainer = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0.25rem;
  padding: 0 0.25rem 0.25rem;
  box-sizing: border-box;
  height: 3rem;

  > div:first-of-type {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`

const InputContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
`

const StartAdornment = styled.div`
  display: inline-block;
  margin-right: 0.25rem;
`

const EndAdornment = styled.div`
  display: inline-block;
  margin-left: 0.25rem;
`
const Input = styled.input`
  flex: 1;
  background: none;
  height: 1.75rem;
  outline: none;
  border: none;
`

const Label = styled.label`
  position: absolute;
  left: 0;
  top: 0.35rem;
  font-size: 1rem;
  font-size: ${({ focused, value }) => (value !== "" || focused ? "0.5rem" : "1rem")};
  top: ${({ focused, value }) => (value === "" && !focused ? "0.35rem" : "-0.25rem")};
  transition:
    top 0.2s,
    font-size 0.2s;
  text-align: left;
  margin: 0 0.2rem 0 0;
  background: white;
  padding: 0 0.25rem;
`

const Line = styled.hr`
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  margin: 0;
  border-color: ${({ error, focused }) => (focused ? "lightblue" : error ? "red" : "black")};
`

const HintText = styled.div`
  font-size: 0.75rem;
  color: ${({ error }) => (error ? "red" : "gray")};
`

const TextField: FC<{
  defaultValue?: string
  label?: string
  hintText?: ReactNode
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  error?: string | boolean
  name?: string
  type?: HTMLInputElement["type"]
  required?: boolean
}> = ({
  defaultValue = "",
  endAdornment,
  error,
  label,
  hintText,
  name,
  required,
  type,
  startAdornment,
}) => {
  const [focused, setFocused] = useState(false)

  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <TextFieldContainer data-test-id="textfield">
      <div>
        <StartAdornment
          data-test-id="adornment"
          onClick={() => {
            inputRef.current?.focus()
          }}
        >
          {startAdornment}
        </StartAdornment>
        <InputContainer>
          <Input
            type="text"
            ref={inputRef}
            name={name}
            onFocus={(evt) => {
              setFocused(true)
            }}
            onBlur={(evt) => {
              setFocused(false)
            }}
            onChange={(evt) => {
              setValue(evt.target.value)
            }}
            value={value}
          />
          {label && (
            <Label
              focused={focused}
              value={value}
              htmlFor={name}
              onClick={() => {
                inputRef.current?.focus()
              }}
            >
              <span>
                {label}
                {required && "*"}
              </span>
            </Label>
          )}
        </InputContainer>
        <EndAdornment
          data-test-id="adornment"
          onClick={() => {
            inputRef.current?.focus()
          }}
        >
          {endAdornment}
        </EndAdornment>
        <Line focused={focused} error={!!error} />
      </div>
      <HintText error={!!error}>{error ? error : hintText}</HintText>
    </TextFieldContainer>
  )
}

export { TextField }
