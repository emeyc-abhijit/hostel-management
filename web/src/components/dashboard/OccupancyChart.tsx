import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Occupied', value: 856, color: 'hsl(222, 59%, 28%)' },
  { name: 'Available', value: 144, color: 'hsl(38, 92%, 50%)' },
  { name: 'Maintenance', value: 24, color: 'hsl(215, 16%, 47%)' },
];

export function OccupancyChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">Room Occupancy</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {data.map((item) => (
          <div key={item.name}>
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
