// components/Dashboard/ChatVolumeChart.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ChatVolumeCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
`;

interface ChatVolumeData {
  date: string;
  total: number;
  ai: number;
  agent: number;
}

// Custom tooltip component moved outside to prevent recreation on every render
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="body2" fontWeight={600} mb={1}>
          Day {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography key={index} variant="body2" color={entry.color}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const ChatVolumeChart: React.FC = () => {
  const [data, setData] = useState<ChatVolumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchChatVolumeData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/analytics/chat-volume?range=${timeRange}`);
        
        // Mock data for now - matching the dashboard image
        const mockData: ChatVolumeData[] = [
          { date: '8', total: 320, ai: 180, agent: 140 },
          { date: '9', total: 280, ai: 160, agent: 120 },
          { date: '10', total: 350, ai: 200, agent: 150 },
          { date: '11', total: 290, ai: 170, agent: 120 },
          { date: '12', total: 380, ai: 220, agent: 160 },
          { date: '13', total: 310, ai: 180, agent: 130 },
          { date: '14', total: 360, ai: 210, agent: 150 }
        ];
        
        setData(mockData);
        console.log('ChatVolumeChart data loaded:', mockData);
        console.log('ChatVolumeChart data length:', mockData.length);
      } catch (error) {
        console.error('Error fetching chat volume data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatVolumeData();
  }, [timeRange]);

  if (loading) {
    return (
      <ChatVolumeCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </ChatVolumeCard>
    );
  }

  return (
    <ChatVolumeCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Chat Volume
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            displayEmpty
            sx={{ height: 32 }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

            <Box sx={{ height: 'calc(100% - 50px)', position: 'relative' }}>
        {data.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          </Box>
                ) : (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#666' }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '8px' }}
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1e40af"
                  strokeWidth={2}
                  name="Total Chats"
                  dot={{ fill: '#1e40af', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="ai"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="AI Chats"
                  dot={{ fill: '#16a34a', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#16a34a', strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="agent"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Chats With Agent"
                  dot={{ fill: '#dc2626', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#dc2626', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </ChatVolumeCard>
  );
};

export default ChatVolumeChart;
