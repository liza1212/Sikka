import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from "recharts";
import Title from './Title';



// export default function Chart() {
//   const theme = useTheme();

//   return (
//     <React.Fragment>
//       <Title>Today</Title>
//       <ResponsiveContainer>
//         <LineChart
//           data={data}
//           margin={{
//             top: 16,
//             right: 16,
//             bottom: 0,
//             left: 24,
//           }}
//         >
//           <XAxis
//             dataKey="time"
//             stroke={theme.palette.text.secondary}
//             style={theme.typography.body2}
//           />
//           <YAxis
//             stroke={theme.palette.text.secondary}
//             style={theme.typography.body2}
//           >
//             <Label
//               angle={270}
//               position="left"
//               style={{
//                 textAnchor: 'middle',
//                 fill: theme.palette.text.primary,
//                 ...theme.typography.body1,
//               }}
//             >
//               Sales ($)
//             </Label>
//           </YAxis>
//           <Line
//             isAnimationActive={false}
//             type="monotone"
//             dataKey="amount"
//             stroke={theme.palette.primary.main}
//             dot={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </React.Fragment>
//   );
// }




const data = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: -3000,
  },
  {
    name: "Page C",
    uv: -2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: -1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 3490,
  }

];

export default function App() {
  const theme = useTheme();
  return (
    <BarChart
      width={750}
      height={240}
      data={data}
      margin={{
        top: 16,
        right: 16,
        bottom: 0,
        left: 24,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend align="right" verticalAlign='top'
        payload={[
          { value: 'You get', type: 'rect', color: '#aef5cb' },
          { value: 'You owe', type: 'rect', color: '#d26b13' },
        ]}
      />
      <ReferenceLine y={0} stroke={theme.palette.text.secondary} />
      <Bar dataKey="uv"  >
        {
        data.map(item =>item.uv > 0?<Cell fill="#aef5cb" />  : <Cell fill="#d26b13" />)
      }
      </Bar>
    </BarChart>
  );
}
