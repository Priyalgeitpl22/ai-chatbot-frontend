import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import {
  StatsOverview,
  ChatVolumeChart,
  // EmailTranscripts,
  // TopIntentsList,
  // SatisfactionSummary,
  AIEffectivenessChart,
  ChatStatusChart,
  // LiveAgents,
  // TicketSummary
} from "../../components/Dashboard";

const DashboardContainer = styled(Box)`
  background: #f7f9fc;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const DashboardContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`;

const StatsSection = styled(Box)`
  height: 120px;
`;

const ChartsSection = styled(Box)`
  height: 320px;
  margin: 24px 0;
`;

const BottomSection = styled(Box)`
  height: 280px;
`;

export default function AdminDashboard() {
  return (
    <DashboardContainer>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Chatbot Analytics
      </Typography>

      <DashboardContent>
        {/* Stats Overview Section */}
        <div>

        <StatsSection>
          <StatsOverview />
        </StatsSection>
        </div>

        {/* Charts Section */}
        <div>

        <ChartsSection>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Chat Volume Chart */}
            <Grid item xs={12} lg={8} sx={{ height: '100%' }}>
              <Box sx={{ height: 320, minHeight: 320 }}>
                <ChatVolumeChart />
              </Box>
            </Grid>

            {/* AI Effectiveness Chart */}
            <Grid item xs={12} lg={4} sx={{ height: '100%' }}>
              <Box sx={{ height: 320, minHeight: 320 }}>
                <AIEffectivenessChart />
              </Box>
            </Grid>
          </Grid>
        </ChartsSection>
        </div>

        {/* Bottom Section */}
        <div>
        <BottomSection>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Chat Status Chart */}
            <Grid item xs={12} lg={6} sx={{ height: '100%' }}>
              <Box sx={{ height: 280, minHeight: 280 }}>
                <ChatStatusChart />
              </Box>
            </Grid>

            {/* Right Side Cards */}
            <Grid item xs={12} lg={6} sx={{ height: '100%' }}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                {/* Top Intents */}
                {/* <Grid item xs={12} sm={6} sx={{ height: '50%' }}>
                  <Box sx={{ height: '100%' }}>
                    <TopIntentsList />
                  </Box>
                </Grid> */}

                {/* Satisfaction Summary */}
                {/* <Grid item xs={12} sm={6} sx={{ height: '50%' }}>
                  <Box sx={{ height: '100%' }}>
                    <SatisfactionSummary />
                  </Box>
                </Grid> */}

                {/* Email Transcripts */}
                {/* <Grid item xs={12} sm={6} sx={{ height: '50%' }}>
                  <Box sx={{ height: '100%' }}>
                    <EmailTranscripts />
                  </Box>
                </Grid> */}

                {/* Live Agents */}
                {/* <Grid item xs={12} sm={6} sx={{ height: '50%' }}>
                  <Box sx={{ height: '100%' }}>
                    <LiveAgents />
                  </Box>
                </Grid> */}

                {/* Ticket Summary */}
                {/* <Grid item xs={12} sx={{ height: '50%' }}>
                  <Box sx={{ height: '100%' }}>
                    <TicketSummary />
                  </Box>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </BottomSection>
        </div>
      </DashboardContent>
    </DashboardContainer>
  );
}
