import { Box, styled } from "@mui/material";


export const SearchBar = styled(Box)`
  display: flex;
  height: 27px;
  width: 95%;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  padding: 0.4rem;
  border: 1px solid var(--theme-color);
  margin-bottom: 0.6rem;
  
  input {
    background: none;
    border: none;
    outline: none;
    color: #64748b;
    width: 100%;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;