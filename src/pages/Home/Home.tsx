import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import  Grid from '@mui/material/Grid2';
import { 
  DashboardContainer, 
  WelcomeSection, 
  StatsCard, 
  CardHeader, 
  CardValue, 
  ChartContainer 
} from './home.styled';
import { ChatTrafficChart } from './ChatTrafficChart';
import { ChatChart } from './ChatChart';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

interface StatData {
  label: string;
  value: string;
  background: string;
  trend?: string; 
}

const statsData: Record<string, StatData> = {
  handledChats: {
    label: 'HANDLED CHATS',
    value: '12847',
    trend: '+12.4%',
    background: '#f3f6ff'
  },
  openChats: {
    label: 'OPEN CHATS',
    value: '3945',
    trend: '+2.9%',
    background: '#fff5f5'
  },
  waitingChats: {
    label: 'WAITING CHATS',
    value: '234',
    trend: '+0.2%',
    background: '#fff8f0'
  },
  resolvedChats: {
    label: 'RESOLVED CHATS',
    value: '413',
    trend: '+12.4%',
    background: '#f0fff4'
  }
};

const Home: React.FC = () => {
  const {user} = useSelector((state: RootState) => state.user);
  return (
    <DashboardContainer>
      <WelcomeSection>
        <Box>
          <h1>Hello {user?.fullName}, Welcome to your dashboard</h1>
          <p>Dashboard supports you with data and information that can help you make decisions you may need to take.</p>
        </Box>
      </WelcomeSection>

      <Grid container spacing={3}>
        {Object.entries(statsData).map(([key, data]) => (
          <Grid size={3} key={key}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatsCard background={data.background}>
                <CardHeader>{data.label}</CardHeader>
                <CardValue>
                  {data.value}
                  {data.trend && (
                    <span className="trend">{data.trend}</span>
                  )}
                </CardValue>
              </StatsCard>
            </motion.div>
          </Grid>
        ))}

        <Grid size={4}>
          <ChartContainer>
            <ChatChart />
          </ChartContainer>
        </Grid>
        <Grid size={8}>
          <ChartContainer>
            <ChatTrafficChart />
          </ChartContainer>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Home;