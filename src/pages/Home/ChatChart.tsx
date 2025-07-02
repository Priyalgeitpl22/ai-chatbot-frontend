import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Satisfied', value: 85 },
  { name: 'Neutral', value: 8 },
  { name: 'Unsatisfied', value: 7 },
];

const COLORS = ['#48bb78', '#ecc94b', '#f56565'];

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const percent = ((payload[0].value / total) * 100).toFixed(2); 

    return (
      <div style={{
        background: 'var(--theme-color)', padding: '8px', borderRadius: '4px', boxShadow:'inherit',
      }}>
        <p style={{ margin: 0, color: payload[0].color }}>
          <strong>{payload[0].name}:</strong> {percent}%
        </p>
      </div>
    );
  }
  return null;
};

export const ChatChart: React.FC = () => {
  return (
    <>
      <h3 style={{ margin: '0 0 16px 0', color: '#2d3748' }}>OVERALL CHATS</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            style={{ cursor: 'pointer' }}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={(props) => <CustomTooltip {...props} />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};
