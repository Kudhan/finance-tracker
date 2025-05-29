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

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/transaction/dashboard');
      const respData = response.data;

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
        lastAccounts: respData.lastAccounts || [],
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
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center p-6">No data available.</p>;
  }

  const doughnutData = [
    { name: 'Balance', value: data.availableBalance },
    { name: 'Income', value: data.totalIncome },
    { name: 'Expense', value: data.totalExpense },
  ];

  return (
    <>
      <Info title="Dashboard" subtitle="Your financial overview at a glance" />

      <Stats
        dt={{
          balance: data.availableBalance,
          income: data.totalIncome,
          expense: data.totalExpense,
        }}
      />

      <div className="flex flex-col-reverse md:flex-row items-center gap-10 w-full">
        <Chart data={data.chartData} />

        {(data.totalIncome > 0 || data.totalExpense > 0) && (
          <DoughnutChart data={doughnutData} />
        )}
      </div>

      
        
        
      
    </>
  );
};

export default Dashboard;
