import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../libs/apiCall';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { IoSearchOutline } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import dayjs from 'dayjs';

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTransactions = async () => {
    try {
      const endDateAdjusted = endDate ? dayjs(endDate).add(1, 'day').format('YYYY-MM-DD') : '';
      const URL = `/transaction?df=${startDate}&dt=${endDateAdjusted}&s=${search}`;
      const { data: res } = await api.get(URL);
      setData(res?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({ s: search, df: startDate, dt: endDate });
    setIsLoading(true);
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='w-full max-w-5xl mx-auto py-10 px-6 md:px-10'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8'>

        {/* Date Range and Search Form */}
        <form onSubmit={handleSearch} className='flex flex-wrap items-center gap-6 flex-grow'>
          <div className='flex flex-col'>
            <label htmlFor='startDate' className='text-sm text-gray-600 font-semibold mb-1'>
              Start Date
            </label>
            <input
              id='startDate'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='endDate' className='text-sm text-gray-600 font-semibold mb-1'>
              End Date
            </label>
            <input
              id='endDate'
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex flex-col flex-grow min-w-[220px]'>
            <label htmlFor='searchInput' className='text-sm text-gray-600 font-semibold mb-1'>
              Search
            </label>
            <div className='flex items-center border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500'>
              <IoSearchOutline className='text-gray-400 mr-2 text-lg' />
              <input
                id='searchInput'
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search description or source...'
                className='w-full outline-none bg-transparent text-gray-800 placeholder-gray-400'
              />
            </div>
          </div>

          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-2 transition duration-200 shadow-md'
          >
            Search
          </button>
        </form>

        {/* Add Payment Button */}
        <button
          onClick={() => setIsOpen(true)}
          className='mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md px-5 py-2 flex items-center gap-2 shadow-md transition duration-200'
        >
          <MdAdd size={22} />
          <span>Pay</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className='space-y-4'>
        {data.length === 0 ? (
          <p className='text-gray-500 text-center py-12 text-lg'>No transactions found.</p>
        ) : (
          data.map((tx) => {
            const { id, description, status, source, amount, type, createdat } = tx;
            const sign = type === 'income' ? '+' : '-';
            const amountColor = type === 'income' ? 'text-green-600' : 'text-red-600';

            return (
              <div
                key={id}
                className='flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer'
                onClick={() => {
                  setSelected(tx);
                  setIsOpenView(true);
                }}
              >
                <div>
                  <p className='font-semibold text-gray-800 text-lg'>{description}</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    {status} via {source} &middot; {dayjs(createdat).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
                <div className={`font-bold text-xl ${amountColor}`}>
                  {sign}${parseFloat(amount).toFixed(2)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Transactions;
