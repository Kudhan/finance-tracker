import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./title";

const COLORS = ["#34D399", "#F87171", "#60A5FA"];

const DoughnutChart = ({ data }) => {
  return (
    <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent">
      <Title title="Summary" />

      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Pie
            data={data}
            innerRadius={110}
            outerRadius={180}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
