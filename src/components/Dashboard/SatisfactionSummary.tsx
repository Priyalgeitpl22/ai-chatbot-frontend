import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '../../redux/store/store';
import { fetchSatisfactionData } from '../../redux/slice/analyticsSlice';

const SatisfactionCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 50%;
  text-wrap: nowrap;
   position:relative;
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
  const dispatch = useDispatch<AppDispatch>();
  const { satisfactionData, satisfactionLoading, satisfactionError } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchSatisfactionData());
  }, [dispatch]);

  // Transform backend data to component format
  const transformDataForComponent = (): SatisfactionData[] => {
    if (!satisfactionData || !satisfactionData.scoreBreakdown) return [];

    return satisfactionData.scoreBreakdown.map((item) => ({
      score: item.score,
      count: item.count,
      emoji: item.emoji,
      color: getScoreColor(item.score)
    }));
  };

  const getScoreColor = (score: number): string => {
    if (score <= 2) return '#EF4444'; 
    if (score <= 3) return '#1d1d1eff'; 
    return '#10B981'; 
  };

  const data = transformDataForComponent();
  const averageScore = satisfactionData?.averageScore || '0';

  return (
    <SatisfactionCard>
      {/* Error Display */}
      {satisfactionError && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            Error: {satisfactionError}
          </Typography>
        </Box>
      )}

     <Box mb={2} width="100%">
  <Typography fontWeight={600} fontSize={14} mb={1}>
    Customer Satisfaction
  </Typography>

  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={4}>
    <Typography variant="body2" color="text.secondary" fontSize={14}>
      Avg. AI Score
    </Typography>
    <Typography variant="h5" fontWeight={300} color='black' fontSize={14}>
      {averageScore}
    </Typography>
  </Box>
</Box>


      {/* Loading State */}
      {satisfactionLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="calc(100% - 80px)">
          <CircularProgress size={40} />
        </Box>
      ) : data.length === 0 ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="calc(100% - 80px)">
          <Typography variant="body2" color="text.secondary">
            No satisfaction data available
          </Typography>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ height: 'calc(100% - 80px)' }}>
          {data.map((item, index) => (
            <motion.div
              key={item.score}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <EmojiContainer>
                <Typography variant="h4" sx={{ fontSize: '1.5rem', color: item.color}}>
                  {item.emoji}
                </Typography>
                <Typography variant="body2" fontWeight={300}>
                  {item.count}
                </Typography>
              </EmojiContainer>
            </motion.div>
          ))}
        </Box>
      )}
    </SatisfactionCard>
  );
};

export default SatisfactionSummary;
