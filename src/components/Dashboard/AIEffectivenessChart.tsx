import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AIEffectivenessCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%
`;

const COLORS = ['#10B981', '#3B82F6', '#EF4444']; // Green, Blue, Red

interface EffectivenessData {
  name: string;
  value: number;
  percentage: number;
}

const AIEffectivenessChart: React.FC = () => {
  const [data, setData] = useState<EffectivenessData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIEffectivenessData = async () => {
      try {
        const mockData: EffectivenessData[] = [
          { name: 'Answered by AI', value: 65, percentage: 65 },
          { name: 'Failed (agent)', value: 25, percentage: 25 },
          { name: 'Failed (ticket)', value: 10, percentage: 10 }
        ];
        
        console.log('Setting mock data:', mockData);
        
        setData(mockData);
        console.log('AIEffectivenessChart data loaded:', mockData);
      } catch (error) {
        console.error('Error fetching AI effectiveness data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAIEffectivenessData();
  }, []);

  if (loading) {
    return (
      <AIEffectivenessCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </AIEffectivenessCard>
    );
  }

  const totalAIAnswered = data.find(item => item.name === 'Answered by AI')?.percentage || 0;

  return (
    <AIEffectivenessCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight={600} fontSize={14}>
          AI Effectiveness
        </Typography>
      </Box>

      <Box position="relative" height="calc(100% - 50px)" display="flex" alignItems="center" justifyContent="space-between">
        {/* Chart Container */}
        <Box position="relative" width="140px" height="140px" >
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="body2" color="text.secondary">
                No data available
              </Typography>
            </Box>
          )}
          
          {/* Center text */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Typography 
              variant="h3" 
              fontWeight={700} 
              color="#3B82F6"
              sx={{ fontSize: '1.75rem', lineHeight: 1 }}
            >
              {totalAIAnswered}%
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.7rem', mt: 0.5 }}
            >
              AI Success Rate
            </Typography>
          </Box>
        </Box>

        {/* Legend - Right side */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, ml: 2 }}>
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Box display="flex" alignItems="center">
                <Box
                  width={8}
                  height={8}
                  borderRadius="50%"
                  bgcolor={COLORS[index % COLORS.length]}
                  mr={1}
                  sx={{ flexShrink: 0 }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ fontSize: '0.8rem', color: 'text.primary', flex: 1 }}
                >
                  {item.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  sx={{ fontSize: '0.8rem', color: 'text.primary' }}
                >
                  {item.percentage}%
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </AIEffectivenessCard>
  );
};

export default AIEffectivenessChart;
