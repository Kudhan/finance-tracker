import React from "react";
import { FaBtc, FaCcMastercard, FaChartLine } from "react-icons/fa";
import { RiVisaLine, RiAccountBoxLine } from "react-icons/ri";
import Title from "./title"; // Assume you have this component

// Lowercase keys for reliable mapping
const iconMap = {
  crypto: <FaBtc size={26} />,
  "visa debit card": <RiVisaLine size={26} />,
  mastercard: <FaCcMastercard size={26} />,
  stocks: <FaChartLine size={26} />, // Confirmed working icon
};

const bgColorMap = {
  crypto: "bg-amber-600",
  "visa debit card": "bg-blue-600",
  mastercard: "bg-rose-600",
  stocks: "bg-pink-700", // This will now apply
};

const Accounts = ({ accounts = [] }) => {
  return (
    <div className="mt-10 py-10 w-full">
      <Title title="Accounts" />
      <span className="text-sm text-gray-600 ">View all your accounts</span>

      <div className="w-full">
        {accounts.map((item, index) => {
          const key = item.name?.toLowerCase(); // Normalize
          const icon = iconMap[key] || <RiAccountBoxLine size={26} />;
          const bgColor = bgColorMap[key] || "bg-gray-600";

          return (
            <div key={index} className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColor} text-white flex items-center justify-center rounded-full`}>
                  {icon}
                </div>
                <div>
                  <p className="text-black dark:text-white text-lg font-semibold">{item.name}</p>
                  <span className="text-gray-600 ">{item.account}</span>
                </div>
              </div>

              <div>
                <p className="text-xl text-black dark:text-white font-bold">${item.amount}</p>
                <span className="text-sm text-gray-600 dark:text-gray-400">Account Balance</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;
