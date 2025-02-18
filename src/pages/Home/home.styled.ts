import { Box, Card, styled, Typography } from "@mui/material";

interface AnalyticsCardProps {
  background?: string; // Optional background prop
}

export const ContentContainer = styled(Box)`
  width: auto;
  height: 98%;
  padding: 24px;
  display: flex;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  flex-direction: column;
  background: var(--white-fade-gradient);
`;

export const HeaderOptions = styled(Box)`
  height: 40px;
  display: flex;
  background-color: #f1f5f9;
  padding: 5px;
  border-radius: 8px;
`

export const DashboardContainer = styled(Box)(`
  width: auto;
  height: 98%;
  display: flex;
  padding: 24px;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  flex-direction: column;
  background: var(--white-fade-gradient);
`);

export const AnalyticsCard = styled(Card)<AnalyticsCardProps>(({ background }) => ({
  marginBottom: "20px",
  width: '200px',
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  background: background || "#f4f4f9", // Default background color if no prop is passed
  '&:hover': {
    background: "#e0e0e0", // Background color on hover
  },
}));

export const CardHeader = styled(Typography)({
  fontSize: "12px",
  fontWeight: "bold",
});

export const AnalyticsValue = styled(Typography)({
  fontSize: "22px",
  fontWeight: "500",
});