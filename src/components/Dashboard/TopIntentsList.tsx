import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TopIntentsCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-size: 12px;
  text-wrap: nowrap;
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} width="15%">
        <Typography fontWeight={600} fontSize={14}>
          Top Chat Intents
        </Typography>
        <IconButton size="small" sx={{ color: '#3B82F6' }}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>

      <List >
        {intents.map((intent, index) => (
            <IntentItem key={index} sx={{ padding: '5px 0px' }}>
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
              />
            </IntentItem>
        ))}
      </List>
    </TopIntentsCard>
  );
};

export default TopIntentsList;
