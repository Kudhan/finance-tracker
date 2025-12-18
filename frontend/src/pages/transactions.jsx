import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../libs/apiCall';
import toast from 'react-hot-toast';
import Loading from '../components/loading'
import { IoSearchOutline } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [addingTransaction, setAddingTransaction] = useState(false);

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
      console.error(error);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get('/account');
      setAccounts(data.accounts);
    } catch (err) {
      toast.error('Failed to fetch accounts');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({ s: search, df: startDate, dt: endDate });
    setIsLoading(true);
    await fetchTransactions();
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount || !selectedAccount) {
      return toast.error('Please fill all fields');
    }

    const source = accounts.find(acc => acc.id === parseInt(selectedAccount))?.account_name;
    setAddingTransaction(true);

    try {
      await api.post(`/transaction/add-transaction/${selectedAccount}`, {
        description,
        source,
        amount: parseFloat(amount),
      });
      toast.success('Transaction added');
      setIsOpen(false);
      setDescription('');
      setAmount('');
      setSelectedAccount('');
      setIsLoading(true);
      await fetchTransactions();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setAddingTransaction(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 15);

    const tableColumn = ['Date', 'Description', 'Status', 'Source', 'Type', 'Amount'];
    const tableRows = [];

    data.forEach(tx => {
      const txData = [
        dayjs(tx.createdat).format('MMM D, YYYY h:mm A'),
        tx.description,
        tx.status,
        tx.source,
        tx.type,
        `${tx.type === 'income' ? '+' : '-'}INR ${parseFloat(tx.amount).toFixed(2)}`
      ];
      tableRows.push(txData);
    });

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('transactions.pdf');
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className='w-full'>
      {/* Filters */}
      <div className='flex flex-col md:flex-row md:items-center gap-4 mb-6'>
        <form onSubmit={handleSearch} className='flex flex-wrap items-end gap-4'>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-600'>Start Date</label>
            <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className='border px-3 py-1.5 rounded' />
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-600'>End Date</label>
            <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className='border px-3 py-1.5 rounded' />
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-600'>Search</label>
            <div className='flex items-center border px-2 py-1.5 rounded'>
              <IoSearchOutline className='text-gray-500 mr-1' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search...'
                className='outline-none bg-transparent text-gray-700 placeholder:text-gray-600'
              />
            </div>
          </div>
          <button type='submit' className='bg-black text-white px-4 py-2 rounded'>Search</button>
        </form>

        {/* Buttons */}
        <div className='flex gap-2 mt-5'>
          <button onClick={() => setIsOpen(true)} className='py-2 px-4 rounded text-white bg-blue-600 flex items-center gap-2'>
            <MdAdd size={20} />
            <span>Pay</span>
          </button>
          <button onClick={handleExportPDF} className='py-2 px-4 rounded text-white bg-green-600 flex items-center gap-2'>
            Export to PDF
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className='space-y-4'>
        {data.length === 0 ? (
          <p className='text-gray-500'>No transactions found.</p>
        ) : (
          data.map((tx) => {
            const { id, description, status, source, amount, type, createdat } = tx;
            const sign = type === 'income' ? '+' : '-';
            const amountColor = type === 'income' ? 'text-green-600' : 'text-red-600';

            return (
              <div key={id} className='flex justify-between items-center p-3 bg-white rounded shadow-sm'>
                <div>
                  <p className='font-medium'>{description}</p>
                  <p className='text-sm text-gray-500'>
                    {status} via {source} • {dayjs(createdat).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
                <div className={`font-bold ${amountColor}`}>
                  {sign}₹{parseFloat(amount).toFixed(2)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Transaction Modal */}
      {isOpen && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative'>
            <h2 className='text-lg font-bold mb-4'>Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className='space-y-4'>
              <div>
                <label className='block text-sm text-gray-600'>Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className='border px-3 py-2 rounded w-full'
                >
                  <option value=''>Select Account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} (Bal: ₹{parseFloat(acc.account_balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm text-gray-600'>Description</label>
                <input
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='border px-3 py-2 rounded w-full'
                  placeholder='E.g., Grocery, Rent...'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600'>Amount</label>
                <input
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className='border px-3 py-2 rounded w-full'
                  placeholder='E.g., 250'
                />
              </div>
              <div className='flex justify-between items-center'>
                <button
                  type='button'
                  className='text-gray-600'
                  onClick={() => setIsOpen(false)}
                  disabled={addingTransaction}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
                  disabled={addingTransaction}
                >
                  {addingTransaction && <FaSpinner className='animate-spin' />}
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
