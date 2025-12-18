import React, { useState, useEffect } from 'react';
import { MdEdit, MdCheck } from 'react-icons/md';

const SavingsGoal = () => {
    // Determine the user's specific storage key if needed, or just use 'user_savings_goal'
    // For simplicity in this demo, we use a static key or we could use the user ID if available via props.
    // We'll stick to local state synced with localStorage for basic persistence.

    const [isEditing, setIsEditing] = useState(false);
    const [goal, setGoal] = useState({
        name: "New Car",
        target: 500000,
        current: 120000
    });

    useEffect(() => {
        const saved = localStorage.getItem('savings_goal');
        if (saved) {
            setGoal(JSON.parse(saved));
        }
    }, []);

    const saveGoal = () => {
        localStorage.setItem('savings_goal', JSON.stringify(goal));
        setIsEditing(false);
    };

    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));

    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900">Savings Goal</h3>
                <button
                    onClick={() => isEditing ? saveGoal() : setIsEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    {isEditing ? <MdCheck className="text-emerald-600" /> : <MdEdit />}
                </button>
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Goal Name</label>
                        <input
                            type="text"
                            value={goal.name}
                            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Amount (₹)</label>
                        <input
                            type="number"
                            value={goal.target}
                            onChange={(e) => setGoal({ ...goal, target: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Saved (₹)</label>
                        <input
                            type="number"
                            value={goal.current}
                            onChange={(e) => setGoal({ ...goal, current: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
                            🎯
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{goal.name}</p>
                            <p className="text-sm text-slate-500">Target: ₹{goal.target.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-700">₹{goal.current.toLocaleString()}</span>
                            <span className="text-slate-500">{percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 text-center">
                        {goal.target - goal.current > 0
                            ? `You need ₹${(goal.target - goal.current).toLocaleString()} more to reach your goal.`
                            : "Goal reached! 🎉"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SavingsGoal;
