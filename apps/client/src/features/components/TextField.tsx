import styled from "@emotion/styled"
import { FC, forwardRef, ReactNode, useEffect, useRef, useState } from "react"

const TextFieldContainer = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
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
}> = forwardRef<
  HTMLInputElement,
  {
    defaultValue?: string
    label?: string
    hintText?: ReactNode
    startAdornment?: ReactNode
    endAdornment?: ReactNode
    error?: string | boolean
    name?: string
    type?: HTMLInputElement["type"]
    required?: boolean
  }
>(
  (
    {
      defaultValue = "",
      endAdornment,
      error,
      label,
      hintText,
      name,
      required,
      type,
      startAdornment,
    },
    inputRef,
  ) => {
    const [focused, setFocused] = useState(false)
    const [value, setValue] = useState(defaultValue)

    const internalRef = useRef<HTMLInputElement>(null)
    const resolvedRef = (inputRef as React.RefObject<HTMLInputElement>) || internalRef

    useEffect(() => {
      if (resolvedRef.current?.value === "") {
        setValue("")
      }
    }, [resolvedRef])

    return (
      <TextFieldContainer data-test-id="textfield">
        <div>
          <StartAdornment
            data-test-id="adornment"
            onClick={() => {
              resolvedRef.current?.focus()
            }}
          >
            {startAdornment}
          </StartAdornment>
          <InputContainer>
            <Input
              defaultValue={defaultValue}
              type="text"
              ref={resolvedRef}
              name={name}
              onFocus={(evt: React.FocusEvent<HTMLInputElement>) => {
                setFocused(true)
              }}
              onBlur={(evt: React.FocusEvent<HTMLInputElement>) => {
                setFocused(false)
              }}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                setValue(evt.target.value)
              }}
            />
            {label && (
              <Label
                focused={focused}
                value={value}
                htmlFor={name}
                onClick={() => {
                  resolvedRef.current?.focus()
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
              resolvedRef.current?.focus()
            }}
          >
            {endAdornment}
          </EndAdornment>
          <Line focused={focused} error={!!error} />
        </div>
        <HintText error={!!error}>{error ? error : hintText}</HintText>
      </TextFieldContainer>
    )
  },
)

export { TextField }
