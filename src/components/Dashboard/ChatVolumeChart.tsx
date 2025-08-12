import React, { useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { AppDispatch, RootState } from '../../redux/store/store';
import { fetchChatVolumeData } from '../../redux/slice/analyticsSlice';

const ChatVolumeCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  text-wrap: nowrap;
`;


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
          {label}
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
  const dispatch = useDispatch<AppDispatch>();
  const { chatVolumeData, chatVolumeLoading, chatVolumeError } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchChatVolumeData());
    };

    fetchData();
  }, [dispatch]);


const renderCustomLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul style={{ display: 'flex', listStyle: 'none', paddingLeft: 0 }}>
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: 24,
            fontSize: '12px',
            color: 'black',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
              display: 'inline-block',
              marginRight: 8,
              borderRadius: 2,
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};



  return (
    <ChatVolumeCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <Typography fontWeight={600} fontSize={14}>
          Chat Volume
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value="7d"
            displayEmpty
            sx={{ height: 24,fontSize:'0.875rem'}}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root": {
                    fontSize: "12px",
                    color: 'text.secondary'
                  },
                },
              },
            }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Display */}
      {chatVolumeError && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            Error: {chatVolumeError}
          </Typography>
        </Box>
      )}

      <Box sx={{ height: 'calc(100% - 30px)', position: 'relative' }}>
        {chatVolumeLoading ? (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <CircularProgress size={40} />
          </Box>
        ) : chatVolumeData.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chatVolumeData}>
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
<ReferenceLine y={0} stroke="#ccc" strokeDasharray="3 3" />
<Tooltip content={<CustomTooltip />} />

      <Legend
  verticalAlign="top"
  height={36}
  content={renderCustomLegend}
/>


<Line
  type="monotone"
  dataKey="total"
  stroke="#6c8efdff"
  strokeWidth={2}
  name="Total Chats"
  dot={{ fill: '#1e40af', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 1 }}
/>
<Line
  type="monotone"
  dataKey="ai"
  stroke="#78a9f7ff"
  strokeWidth={2}
  name="AI Chats"
  dot={{ fill: '#78a9f7ff', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#78a9f7ff', strokeWidth: 1 }}
/>
<Line
  type="monotone"
  dataKey="agent"
  stroke="#a1c2f7ff"
  strokeWidth={2}
  name="Chats With Agent"
  dot={{ fill: '#a1c2f7ff', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#a1c2f7ff', strokeWidth: 1 }}
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
