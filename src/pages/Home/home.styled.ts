import styled from '@emotion/styled';
import { Box, Paper } from '@mui/material';

export const DashboardContainer = styled(Box)`
  padding: 24px;
  min-height: 100vh;
  background: #f8fafc;
`;

export const WelcomeSection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 24px;
    color: #1a365d;
    margin: 0;
    margin-bottom: 8px;
  }

  p {
    color: #718096;
    margin: 0;
  }
`;

interface StatsCardProps {
  background?: string;
}

export const StatsCard = styled(Paper)<StatsCardProps>`
  padding: 24px;
  background: ${props => props.background || '#fff'} !important;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const CardHeader = styled.div`
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const CardValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #2d3748;
  .trend {
    font-size: 14px;
    color: #48bb78;
    margin-left: 8px;
  }
`;

export const ChartContainer = styled(Paper)`
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 300px;
`;

export const HeaderOptions = styled(Box)`
  height: 40px;
  display: flex;
  background-color: #f1f5f9;
  padding: 5px;
  border-radius: 8px;
`