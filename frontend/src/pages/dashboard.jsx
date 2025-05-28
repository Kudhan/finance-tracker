import React, { useState, useEffect } from 'react';
import Loading from '../components/loading';
import api from '../libs/apiCall';
import { toast } from 'react-hot-toast';
import Stats from '../components/stats';
import Info from '../components/info';
import DoughNutChart from '../components/doughNutChart';
import Chart from '../components/chart';
import Accounts from '../components/accounts';
import RecentTransactions from '../components/transactions';

const Dashboard = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    const URL = `/transactions/dashboard`;
    try {
      const response = await api.get(URL);
      setData(response.data);
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

  return (
    <>
      <Info title="Dashboard" subtitle="Your financial overview at a glance" />
      <Stats
      dt={{
        balance:data?.availableBalance,
        income:data?.totalIncome,
        expense:data?.totalExpense,
      }}
        
      />

      <div className="flex flex-col-reverse md:flex-row items-center gap-10 w-full">
        <Chart datat={data?.chartData} />
        {data?.totalIncome > 0 && (
          <DoughNutChart
          dt={{
        balance:data?.availableBalance,
        income:data?.totalIncome,
        expense:data?.totalExpense,
      }}
          />
        )}
      </div>

      <div className='flex flex-col-reverse gap-0'>
        <RecentTransactions data={data?.lastTransactions} />
        {data?.lastTransactions?.length>0 && <Accounts data={data?.lastAccount} />}
      </div>
    </>
  );
};

export default Dashboard;
