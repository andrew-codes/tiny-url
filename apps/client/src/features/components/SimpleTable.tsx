import styled from "@emotion/styled"
import { FC, PropsWithChildren } from "react"

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  gap: 0.5rem;
  border-radius: 0.25rem;

  tr {
    display: flex;
    align-items: center;
  }

  th,
  td {
    text-align: left;
  }

  tbody {
  }

  td:first-of-type,
  th:first-of-type {
    flex: 1;
  }

  tbody tr {
    padding: 1rem 0.5rem;
    transition: background-color 0.3s ease;

    background-color: #b0b0b0;

    &:last-child {
      border-radius: 0 0 0.25rem 0.25rem;
    }

    &:first-child {
      border-radius: 0.25rem 0.25rem 0 0;
    }

    &:hover {
      background-color: #ebe8e8;
    }
  }

  tbody td {
    display: flex;
    padding-right: 1rem;
    &:last-child {
      padding-right: 0;
    }
  }
`

const SimpleTable: FC<PropsWithChildren<object>> = ({ children }) => {
  return <StyledTable>{children}</StyledTable>
}

export { SimpleTable }
