// components/Dashboard/ChatStatusChart.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { styled } from '@mui/material/styles';

const ChatStatusCard = styled(Box)`
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
`;

const ChatStatusChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockData = [
          {
            name: '250',
            completed: 65,
            open: 15,
            total: 80,
          },
          {
            name: '500',
            completed: 165,
            open: 70,
            total: 235,
          },
          {
            name: '750',
            completed: 460,
            open: 100,
            total: 560,
          },
          {
            name: '1.000',
            completed: 1085,
            open: 85,
            total: 1170,
          },
        ];
        setData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [timeRange]);

  const COLORS = {
    completed: '#3660D0',
    open: '#87B0F0',
  };

  return (
    <ChatStatusCard>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography fontWeight={600} fontSize={14} color="text.primary">
            Chat Status
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#bdbdbd',
                },
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: COLORS.completed,
                borderRadius: '2px',
              }}
            />
            <Typography variant="body2" color="text.primary">
              Completed
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: COLORS.open,
                borderRadius: '2px',
              }}
            />
            <Typography variant="body2" color="text.primary">
              Open
            </Typography>
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ height: 200, width: '100%', mt: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : data.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No data available
              </Typography>
            </Box>
                    ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Debug: {JSON.stringify(data[0])}
              </Typography>
              <BarChart
                width={500}
                height={200}
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill={COLORS.completed} />
                <Bar dataKey="open" fill={COLORS.open} />
              </BarChart>
            </>
          )}
        </Box>
    </ChatStatusCard>
  );
};

export default ChatStatusChart;
