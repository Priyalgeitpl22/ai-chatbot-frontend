import { Box, Grid, styled } from "@mui/material";

export const DashboardContainer = styled(Box)`
  background: #f7f9fc;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  height: calc(100vh - 90px);
  
`;

export const DashboardContent = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 80%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding:0.5rem;
  width:100%;
  
`;

export const StatsSection = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 15%;
  width: 100%;
  box-sizing: border-box;
`;

export const ChartsSection = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 35%;
  width: 100%;
  box-sizing: border-box;
`;

export const BottomSection = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  height: 35%;
  position:relative;
`;
