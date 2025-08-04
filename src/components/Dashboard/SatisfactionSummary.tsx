import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const SatisfactionCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 50%;
  text-wrap: nowrap;
`;

const EmojiContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

interface SatisfactionData {
  score: number;
  count: number;
  emoji: string;
  color: string;
}

const SatisfactionSummary: React.FC = () => {
  const [data, setData] = useState<SatisfactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchSatisfactionData = async () => {
      try {

        const mockData: SatisfactionData[] = [
          { score: 1, count: 31, emoji: '😡', color: '#EF4444' },
          { score: 2, count: 57, emoji: '😐', color: '#F59E0B' },
          { score: 3, count: 110, emoji: '🙂', color: '#10B981' },
          { score: 4, count: 284, emoji: '😊', color: '#3B82F6' }
        ];
        
        setData(mockData);
        
        // Calculate average score
        const totalCount = mockData.reduce((sum, item) => sum + item.count, 0);
        const weightedSum = mockData.reduce((sum, item) => sum + (item.score * item.count), 0);
        setAverageScore(weightedSum / totalCount);
      } catch (error) {
        console.error('Error fetching satisfaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSatisfactionData();
  }, []);

  if (loading) {
    return (
      <SatisfactionCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </SatisfactionCard>
    );
  }

  return (
    <SatisfactionCard>
      <Box mb={2} width="35%">
        <Typography fontWeight={600} fontSize={14} mb={1}>
          Customer Satisfaction
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Avg. AI Score{' '}
          <Typography component="span" variant="h5" fontWeight={700} color="#3B82F6">
            {averageScore.toFixed(1)}
          </Typography>
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ height: 'calc(100% - 80px)' }}>
        {data.map((item, index) => (
          <motion.div
            key={item.score}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <EmojiContainer>
              <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                {item.emoji}
              </Typography>
              <Typography variant="body2" fontWeight={600} color={item.color}>
                {item.count}
              </Typography>
            </EmojiContainer>
          </motion.div>
        ))}
      </Box>
    </SatisfactionCard>
  );
};

export default SatisfactionSummary;
