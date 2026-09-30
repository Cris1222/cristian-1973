import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSnailList } from '../../utils/mockSnail'

export const SnailWinsChart = () => {
  return (
    <div>
      <h3>Victorias de caracoles</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={mockSnailList}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} domain={[0, 6]} />
            <Tooltip />
            <Bar dataKey="wins" fill="#6366f1" radius={6}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};