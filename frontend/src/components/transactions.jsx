import React from "react";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";

const RecentTransactions = ({ data = [] }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Latest Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Source</th>
              <th className="py-3 px-6 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-6 flex items-center gap-2 text-sm font-medium">
                  {item.status === "Pending" && (
                    <RiProgress3Line className="text-yellow-500" size={20} />
                  )}
                  {item.status === "Completed" && (
                    <IoCheckmarkDoneCircle className="text-green-500" size={20} />
                  )}
                  {item.status === "Rejected" && (
                    <TiWarning className="text-red-500" size={20} />
                  )}
                  <span>{item.status}</span>
                </td>

                <td className="py-3 px-6 text-sm text-gray-700">
                  {item.source}
                </td>

                <td className="py-3 px-6 text-right font-semibold text-gray-900">
                  ₹{item.amount}.00
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
