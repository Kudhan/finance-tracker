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

console.log("Icon Map:", iconMap);
console.log("Background Color Map:", bgColorMap);

const Accounts = ({ accounts = [] }) => {
  return (
    <div className="w-full">
      <Title title="Accounts" />
      <span className="text-sm text-gray-600 ">View all your accounts</span>

      <div className="w-full">
        {accounts.map((item, index) => {
          const key = item.account_name?.toLowerCase(); // Normalize
          const icon = iconMap[key] || <RiAccountBoxLine size={26} />;
          const bgColor = bgColorMap[key] || "bg-gray-600";

          return (
            <div key={index} className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColor} text-white flex items-center justify-center rounded-full`}>
                  {icon}
                </div>
                <div>
                  <p className="text-black text-lg font-semibold">{item.account_name}</p>
                  <span className="text-gray-600 ">{item.account_number}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl text-black font-bold">₹{Number(item.account_balance).toLocaleString()}</p>
                <span className="text-sm text-gray-600">Account Balance</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Accounts;
