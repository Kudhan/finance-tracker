import React from "react";
import { BsCashCoin } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { SiCashapp } from "react-icons/si";

const ICON_STYLES = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
];

const Stats = ({ dt }) => {
  const data = [
    {
      label: "Total Balance",
      amount: dt?.balance || 0,
      increase: 10.9,
      icon: <BsCashCoin size={24} />,
    },
    {
      label: "Total Income",
      amount: dt?.income || 0,
      increase: 8.9,
      icon: <BsCashCoin size={24} />,
    },
    {
      label: "Total Expense",
      amount: dt?.expense || 0,
      increase: -10.9,
      icon: <SiCashapp size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {data.map((item, index) => (
        <div
          key={index + item.label}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl ${ICON_STYLES[index]
                }`}
            >
              {item.icon}
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-medium">
                {item.label}
              </span>
              <p className="text-2xl font-bold text-slate-900">
                ₹{item.amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <div className={`flex items-center text-sm font-semibold ${item.increase > 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {item.increase > 0 ? <IoMdArrowUp /> : <IoMdArrowDown />}
              {Math.abs(item.increase)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">vs last month</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
