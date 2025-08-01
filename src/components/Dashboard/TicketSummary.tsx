import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';

const TicketSummaryCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
`;

const MetricItem = styled(Box)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
  }
`;

interface TicketStats {
  totalTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
  avgResolutionTime: string;
  resolutionRate: number;
}

const TicketSummary: React.FC = () => {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketStats = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/analytics/ticket-summary');
        
        // Mock data for now
        const mockStats: TicketStats = {
          totalTickets: 142,
          resolvedTickets: 96,
          pendingTickets: 18,
          avgResolutionTime: '3m 45s',
          resolutionRate: 67.6
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketStats();
  }, []);

  if (loading) {
    return (
      <TicketSummaryCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </TicketSummaryCard>
    );
  }

  if (!stats) {
    return (
      <TicketSummaryCard>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No ticket data available
        </Typography>
      </TicketSummaryCard>
    );
  }

  return (
    <TicketSummaryCard>
      <Box display="flex" alignItems="center" mb={2}>
        <AssignmentIcon sx={{ mr: 1, color: '#3B82F6' }} />
        <Typography variant="h6" fontWeight={600}>
          Ticket Summary
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <MetricItem>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Total Tickets
                </Typography>
                <Typography variant="h5" fontWeight={600} color="#3B82F6">
                  {stats.totalTickets}
                </Typography>
              </Box>
            </MetricItem>
          </motion.div>
        </Grid>

        <Grid item xs={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <MetricItem>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Resolved
                </Typography>
                <Typography variant="h5" fontWeight={600} color="#10B981">
                  {stats.resolvedTickets}
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ color: '#10B981' }} />
            </MetricItem>
          </motion.div>
        </Grid>

        <Grid item xs={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <MetricItem>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Avg Response
                </Typography>
                <Typography variant="h5" fontWeight={600} color="#F59E0B">
                  {stats.avgResolutionTime}
                </Typography>
              </Box>
              <ScheduleIcon sx={{ color: '#F59E0B' }} />
            </MetricItem>
          </motion.div>
        </Grid>

        <Grid item xs={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <MetricItem>
              <Box flex={1}>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
                <Typography variant="h5" fontWeight={600} color="#EF4444">
                  {stats.pendingTickets}
                </Typography>
              </Box>
            </MetricItem>
          </motion.div>
        </Grid>
      </Grid>

      <Box mt={2} textAlign="center">
        <Chip
          label={`${stats.resolutionRate}% Resolution Rate`}
          color="success"
          variant="outlined"
          size="small"
        />
      </Box>
    </TicketSummaryCard>
  );
};

export default TicketSummary;
