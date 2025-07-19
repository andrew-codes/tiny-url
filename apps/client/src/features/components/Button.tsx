import styled from "@emotion/styled"
import { throttle } from "lodash"
import { ButtonHTMLAttributes, FC, useEffect, useRef } from "react"

const StyledButton = styled.button`
  background: ${(props) => (props.disabled ? "#ccc" : "#6C63FF")};
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  overflow: hidden;

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`
const ButtonContainer = styled.div`
  display: inline-block;
  position: relative;
`

const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`

const Button: FC<{ children: React.ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rippleRef = useRef<HTMLSpanElement | null>(null)
  const rippleContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function ripple(evt) {
      if (containerRef.current == null) return
      if (rippleContainerRef.current == null) return

      if (!rippleRef.current) {
        rippleRef.current = document.createElement("span")
        rippleRef.current.style.position = "absolute"
        rippleRef.current.style.borderRadius = "50%"
        rippleRef.current.style.transform = "scale(0)"
        rippleRef.current.style.animation = "ripple 600ms linear"
        rippleRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.7)"
        rippleRef.current.style.overflow = "hidden"
      }
      const ripple = rippleRef.current
      const rect = rippleContainerRef.current.getBoundingClientRect()
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + "px"
      ripple.style.left = evt.clientX - rect.left - Math.max(rect.width, rect.height) / 2 + "px"
      ripple.style.top = evt.clientY - rect.top - Math.max(rect.width, rect.height) / 2 + "px"
      rippleContainerRef.current.appendChild(ripple)
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
    const throttledRipple = throttle(ripple, 300, { trailing: false })
    const el = containerRef.current
    el?.addEventListener("mousedown", throttledRipple)

    return () => {
      el?.removeEventListener("mousedown", throttledRipple)
    }
  }, [])

  return (
    <ButtonContainer ref={containerRef}>
      <StyledButton data-test-id="button" {...props}>
        {children}
      </StyledButton>
      <RippleContainer ref={rippleContainerRef} />
    </ButtonContainer>
  )
}

export { Button }
