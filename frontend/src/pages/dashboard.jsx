import React, { useState, useEffect } from 'react';
import Loading from '../components/loading';
import api from '../libs/apiCall';
import { toast } from 'react-hot-toast';
import Stats from '../components/stats';
import Info from '../components/info';
import DoughnutChart from '../components/doughNutChart';
import Chart from '../components/chart';
import Accounts from '../components/accounts';
import RecentTransactions from '../components/transactions';
import SmartInsights from '../components/smartInsights';
import SavingsGoal from '../components/savingsGoal';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const [dashboardRes, accountRes] = await Promise.all([
        api.get('/transaction/dashboard'),
        api.get('/account')
      ]);

      const respData = dashboardRes.data;
      const accountsData = accountRes.data?.accounts || [];

      // Normalize keys & prepare chart data with lowercase keys for recharts
      const chartDataNormalized = (respData.ChartData || []).map((item) => ({
        label: item.label,
        income: Number(item.Income),
        expense: Number(item.Expense),
      }));

      setData({
        availableBalance: Number(respData.availableBalance) || 0,
        totalIncome: Number(respData.totalIncome) || 0,
        totalExpense: Number(respData.totalExpense) || 0,
        chartData: chartDataNormalized,
        lastTransactions: respData.lastTransactions || [],
        lastAccounts: accountsData.slice(0, 4), // Take top 4 accounts
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch dashboard stats');
      if (error?.response?.data?.status === 'auth-failed') {
        localStorage.removeItem('user');
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center p-6 text-slate-500">No data available.</p>;
  }

  const doughnutData = [
    { name: 'Balance', value: data.availableBalance },
    { name: 'Income', value: data.totalIncome },
    { name: 'Expense', value: data.totalExpense },
  ];

  return (
    <div className="w-full">
      <Info title="Dashboard" subtitle="Overview of your financial health" />

      <Stats
        dt={{
          balance: data.availableBalance,
          income: data.totalIncome,
          expense: data.totalExpense,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SmartInsights income={data.totalIncome} expense={data.totalExpense} />
        </div>
        <div className="lg:col-span-1 h-full">
          <SavingsGoal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart Section - spans 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <Chart data={data.chartData} />
        </div>

        {/* Doughnut Chart Section - spans 1 col */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center">
          {(data.totalIncome > 0 || data.totalExpense > 0) ? (
            <DoughnutChart data={doughnutData} />
          ) : (
            <div className="text-center py-10 text-slate-400">
              No data for chart
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <RecentTransactions data={data.lastTransactions} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <Accounts accounts={data.lastAccounts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
