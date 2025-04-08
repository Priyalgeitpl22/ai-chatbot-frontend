import styled from "@emotion/styled";
import { Box, Chip, IconButton, TableCell, TableContainer, TableHead, Typography } from "@mui/material";

export const AgentsContainer = styled.div`
  width: 92%;
  height: 98%;
  display: flex;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  flex-direction: column;
  background: var(--white-fade-gradient);
  padding: 16px;
  border-radius: 8px;
}
`;
export const AgentHeader = styled.section`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
  `;

export const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 600;
    color: #35495c;
    display: flex;
    font-family: "var(--custom-font-family)";
  `;

export const StyledTableContainer = styled(TableContainer)`
  width: auto;
  max-height: 400px;
  overflow: auto !important;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
    &::-webkit-scrollbar {
      width: 8px; 
      height:6px;
    }
  
    &::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
  
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--theme-color), var(--theme-color));
      opacity: 0.5;
      border-radius: 10px; 
    }
  
    &::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, var(--theme-color), #378f8f); 
    }
  `;

export const StyledTableHead = styled(TableHead)`
    background-color: transparent;
    position: sticky;
    top: 0;
    z-index: 1;
  `;

export const StyledTableCell = styled(TableCell)`
  color: #222222;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  font-family: 'var(--custom-font-family)';
  &.MuiTableCell-head {
    background-color: #F8F7FD;
    color: #424242;
    font-weight: 600;
    font-family: 'var(--custom-font-family)';
  }
  .MuiSelect-root {
    &::before, &::after {
      border: none;  
    }
    border-bottom: none;  
    :hover:not(.Mui-disabled, .Mui-error):before {
      border-bottom: none !important; 
    }
  }
`;


export const AvailabilityList = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 8px;        
`;

export const AvailabilityChip = styled(Chip)`
  background-color: #F8F7FD;
  color: #424242;
  font-weight: 500;
  padding: 4px 8px;
  height: auto;
  font-family: 'var(--custom-font-family)';
`;

export const UserInfoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const UserName = styled(Typography)`
  font-weight: 500;
  color: #2D3748;
  font-family: "var(--custom-font-family)";
`;

export const ActionButton = styled(IconButton)`
  padding: 8px;
  &:hover {
    background-color: #F8F7FD;
  }
`;