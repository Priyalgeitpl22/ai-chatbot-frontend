import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '12 AM', today: 300, lastWeek: 250 },
  { time: '3 AM', today: 400, lastWeek: 380 },
  { time: '6 AM', today: 500, lastWeek: 450 },
  { time: '9 AM', today: 450, lastWeek: 420 },
  { time: '12 PM', today: 550, lastWeek: 500 },
  { time: '3 PM', today: 500, lastWeek: 480 },
  { time: '6 PM', today: 600, lastWeek: 550 },
  { time: '9 PM', today: 450, lastWeek: 400 },
];

export const ChatTrafficChart: React.FC = () => {
  return (
    <>
      <h3 style={{ margin: '0 0 16px 0', color: '#2d3748' }}>HOURLY CHAT TRAFFIC</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="today" 
            stroke="#4299e1" 
            fill="#ebf8ff" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="lastWeek" 
            stroke="#ed64a6" 
            fill="#fed7e2" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};