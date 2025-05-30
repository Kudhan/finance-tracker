import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./title";

const Chart = ({ data }) => {
  return (
    <div className="w-full md:w-2/3">
      <Title title="Transaction Activity" />

      <ResponsiveContainer width="100%" height={500} className="mt-5">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#34D399" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#F87171" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
