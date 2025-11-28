import styled from "styled-components";
import { Box} from "@mui/material";

export const PageWrapper = styled(Box)`
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: 0.2s ease;
`;

export const EntryCard = styled(Box)`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
`;

export const EntryHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;
export const BottomActions = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

export const StyledButton = styled.button`
font-weight: semibold;
width:180px;
padding: 8px 12px;
border: none;
border-radius: 6px;
color: #1e293b;
background-color:var(--theme-color);
cursor: pointer;
font-size: 16px;  
font-weight: 600;
font-family:var(--custom-font-family);

:hover {
  background-color: var(--theme-color);
  opacity: 0.8;
}
`;