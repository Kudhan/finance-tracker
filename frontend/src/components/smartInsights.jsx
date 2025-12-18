import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SmartInsights = ({ income, expense }) => {
    const savings = Math.max(0, income - expense);
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // Calculate Financial Health Score (0-100)
    // Base 50, + up to 50 based on savings rate (capped at 50% savings rate for max score)
    let healthScore = 50;
    if (income > 0) {
        healthScore += Math.min(50, savingsRate);
    }
    if (expense > income) healthScore -= 20;
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    const data = [
        { name: 'Score', value: healthScore },
        { name: 'Remaining', value: 100 - healthScore },
    ];

    const getColor = (score) => {
        if (score >= 80) return '#10b981'; // Emerald-500
        if (score >= 50) return '#6366f1'; // Indigo-500
        return '#f43f5e'; // Rose-500
    };

    const getAdvice = (score) => {
        if (score >= 80) return "Excellent! You're a savings master.";
        if (score >= 50) return "Good job. Try to reduce discretionary spending.";
        return "Warning: Your expenses are high. Review your budget.";
    };

    return (
        <div className="w-full h-full p-6 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl text-white shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>

            <h3 className="text-lg font-semibold text-indigo-100 mb-4">Financial Health Score</h3>

            <div className="flex flex-col items-center justify-center relative">
                <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={75}
                                startAngle={180}
                                endAngle={0}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell key="cell-0" fill={getColor(healthScore)} />
                                <Cell key="cell-1" fill="rgba(255,255,255,0.1)" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center -mt-4">
                    <span className="text-4xl font-bold">{healthScore}</span>
                    <span className="text-xs block text-indigo-300">/ 100</span>
                </div>
            </div>

            <div className="mt-2 text-center">
                <p className="font-medium text-lg">{healthScore >= 80 ? "Excellent Health" : (healthScore >= 50 ? "Good Health" : "Needs Improvement")}</p>
                <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
                    {getAdvice(healthScore)}
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-indigo-700/50 flex justify-between text-sm">
                <div className="text-center">
                    <span className="block text-indigo-300 text-xs">Savings Rate</span>
                    <span className="font-bold">{savingsRate.toFixed(1)}%</span>
                </div>
                <div className="text-center">
                    <span className="block text-indigo-300 text-xs">Monthly Surplus</span>
                    <span className="font-bold">₹{Number(savings).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default SmartInsights;
