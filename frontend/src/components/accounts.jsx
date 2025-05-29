import React from "react";
import { FaBtc, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import Title from "./title";

// You can enhance this if your API data differs,
// For now assuming lastAccounts array has same structure as data here
const iconMap = {
  Crypto: <FaBtc size={26} />,
  "Visa Debit Card": <RiVisaLine size={26} />,
  MasterCard: <FaCcMastercard size={26} />,
  Paypal: <FaPaypal size={26} />,
};

const bgColorMap = {
  Crypto: "bg-amber-600",
  "Visa Debit Card": "bg-blue-600",
  MasterCard: "bg-rose-600",
  Paypal: "bg-blue-700",
};

const Accounts = ({ accounts = [] }) => {
  return (
    <div className="mt-20 md:mt-0 py-5 md:py-20 w-full">
      <Title title="Accounts" />
      <span className="text-sm text-gray-600 dark:text-gray-500">View all your accounts</span>

      <div className="w-full">
        {accounts.map((item, index) => {
          const icon = iconMap[item.name] || <FaBtc size={26} />; // fallback icon
          const bgColor = bgColorMap[item.name] || "bg-gray-600";

          return (
            <div key={index} className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColor} text-white flex items-center justify-center rounded-full`}>
                  {icon}
                </div>
                <div>
                  <p className="text-black dark:text-gray-400 text-lg">{item.name}</p>
                  <span className="text-gray-600">{item.account}</span>
                </div>
              </div>

              <div>
                <p className="text-xl text-black dark:text-gray-400 font-medium">${item.amount}</p>
                <span className="text-sm text-gray-600 dark:text-violet-700">Account Balance</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;
