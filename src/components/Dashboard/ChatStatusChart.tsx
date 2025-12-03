import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { AppDispatch, RootState } from '../../redux/store/store';

const ChatStatusCard = styled(Box)`
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
  position:relative;
`;

const ChatStatusChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chatStatusData, chatStatusLoading, chatStatusError } = useSelector(
    (state: RootState) => state.analytics
  );
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case '7':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

    };

    fetchData();
  }, [dispatch, timeRange]);

  // Transform backend data to chart format
  const transformDataForChart = () => {
    if (!chatStatusData || chatStatusData.length === 0) return [];

    // Create chart data directly from backend data
    return chatStatusData.map((item: any) => {
      const status = item.status;
      const count = item.count;

      return {
        name: status,
        count: count,
      };
    });
  };

  const chartData = transformDataForChart();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#6c8efdff';
      case 'Open':
        return '#78a9f7ff';
      case 'Trashed':
        return '#a1c2f7ff';
      default:
        return '#87B0F0';
    }
  };

  return (
    <ChatStatusCard>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                fontSize: '12px',
                color: 'text.secondary',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    "& .MuiMenuItem-root": {
                      fontSize: "12px",
                    },
                  },
                },
              }}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: '5px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: getStatusColor('Completed'),
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
                backgroundColor: getStatusColor('Open'),
                borderRadius: '2px',
              }}
            />
            <Typography variant="body2" color="text.primary" fontSize={12}>
              Open
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: '#a1c2f7ff',
                borderRadius: '2px',
              }}
            />
            <Typography variant="body2" color="text.primary">
              Trashed
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Error Display */}
      {chatStatusError && (
        <Box sx={{ p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            Error: {chatStatusError}
          </Typography>
        </Box>
      )}

      {/* Chart */}
      <Box sx={{ height: '100%', width: '100%', mt: 2 }}>
        {chatStatusLoading ? (
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
        ) : chartData.length === 0 ? (
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
            <BarChart
              width={500}
              height={150}
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, }}
            >
              <CartesianGrid strokeDasharray="3 2" />
              <XAxis dataKey="name" tick={{
                fontSize: 12,
                fontFamily: 'Roboto',
                fill: '#333',
              }} />
              <YAxis tick={{
                fontSize: 12,
                fontFamily: 'Roboto',
                fill: '#333',
              }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6c8efdff" />
            </BarChart>
          </>
        )}
      </Box>
    </ChatStatusCard>
  );
};

export default ChatStatusChart;
