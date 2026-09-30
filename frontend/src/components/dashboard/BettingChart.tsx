import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockUserList } from '../../utils/mockSnail'

const COLORS = ['#22c55e', '#ef4444'];

export const BettingChart = () => {
  return (
    <div>
      <h3>Apuestas</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={mockUserList}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={3}
            >
              {mockUserList.map((_, index) => (
                <Cell key={index} fill={COLORS[index]}/>
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};