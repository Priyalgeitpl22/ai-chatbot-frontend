import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TopIntentsCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
`;

const IntentItem = styled(ListItem)`
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

interface IntentData {
  name: string;
  count: number;
  percentage: number;
}

const TopIntentsList: React.FC = () => {
  const [intents, setIntents] = useState<IntentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopIntents = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/analytics/top-intents');
        
        // Mock data for now - matching the dashboard image
        const mockIntents: IntentData[] = [
          { name: 'Refund', count: 246, percentage: 28.5 },
          { name: 'Shipping', count: 189, percentage: 21.9 },
          { name: 'Product Info', count: 173, percentage: 20.0 },
          { name: 'Troubleshooting', count: 103, percentage: 11.9 },
          { name: 'Pricing', count: 86, percentage: 10.0 }
        ];
        
        setIntents(mockIntents);
      } catch (error) {
        console.error('Error fetching top intents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopIntents();
  }, []);

  if (loading) {
    return (
      <TopIntentsCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </TopIntentsCard>
    );
  }

  return (
    <TopIntentsCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Top Chat Intents
        </Typography>
        <IconButton size="small" sx={{ color: '#3B82F6' }}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>

      <List sx={{ p: 0, height: 'calc(100% - 80px)', overflow: 'auto' }}>
        {intents.map((intent, index) => (
          <motion.div
            key={intent.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <IntentItem>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={500}>
                      {intent.name}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#3B82F6">
                      {intent.count}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      {intent.percentage}% of total
                    </Typography>
                    <Chip
                      label={`${intent.percentage}%`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 20,
                        borderColor: '#3B82F6',
                        color: '#3B82F6'
                      }}
                    />
                  </Box>
                }
              />
            </IntentItem>
          </motion.div>
        ))}
      </List>

      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          More
        </Typography>
      </Box>
    </TopIntentsCard>
  );
};

export default TopIntentsList;
