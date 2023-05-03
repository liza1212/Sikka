import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('14-04-2023', 450),
  createData('14-04-2023', 230),
  createData('14-04-2023', 150),
  createData('14-04-2023', 10),
  createData('23-03-2023', 500),
  createData('23-03-2023', 80),
  createData('4-03-2023', 230),
  createData('4-03-2023', 100),
];
const data1 = [
  createData('14-04-2023', 450, 'R'),
  createData('14-04-2023', 230, 'R'),
  createData('14-04-2023', 150, 'S'),
  createData('14-04-2023', 10, 'R'),
  createData('23-03-2023', 500, 'S'),
  createData('23-03-2023', 80, 'R'),
  createData('4-03-2023', 230, 'R'),
  createData('4-03-2023', 100, 'S'),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}