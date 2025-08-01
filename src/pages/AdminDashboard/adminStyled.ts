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
  gap: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
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
  height: 30%;
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
  height: 40%;
`;
