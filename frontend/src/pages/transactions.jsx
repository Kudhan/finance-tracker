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
import * as XLSX from 'xlsx';

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

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "Transactions.xlsx");
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  if (isLoading) return <Loading />;

  return (

    <div className='w-full py-8 px-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Transactions</h1>
          <p className='text-slate-500 text-sm mt-1'>Manage and track your financial activity.</p>
        </div>
        <div className='flex gap-3 mt-4 md:mt-0'>
          <button onClick={() => setIsOpen(true)} className='flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md'>
            <MdAdd size={20} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6'>
        <div className='flex flex-col xl:flex-row gap-4 justify-between items-center'>
          <form onSubmit={handleSearch} className='w-full flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-64'>
              <IoSearchOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search transactions...'
                className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400'
              />
            </div>

            <div className='flex gap-2 w-full md:w-auto'>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full md:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-500'
              />
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full md:w-auto px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-indigo-500'
              />
              <button type='submit' className='px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors'>
                Filter
              </button>
            </div>
          </form>

          <div className='flex gap-2 w-full xl:w-auto justify-end'>
            <button onClick={handleExportPDF} className='px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors'>
              Export PDF
            </button>
            <button onClick={handleExportExcel} className='px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors'>
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-slate-50/50 border-b border-slate-200'>
              <tr>
                <th className='py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Description</th>
                <th className='py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Status</th>
                <th className='py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Source</th>
                <th className='py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Date</th>
                <th className='py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right'>Amount</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className='py-12 text-center text-slate-400'>
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                data.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className='hover:bg-slate-50/80 transition-colors group'>
                      <td className='py-4 px-6'>
                        <div className='font-medium text-slate-900'>{tx.description}</div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          tx.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className='py-4 px-6 text-sm text-slate-600'>{tx.source}</td>
                      <td className='py-4 px-6 text-sm text-slate-500'>
                        {dayjs(tx.createdat).format('MMM D, YYYY h:mm A')}
                      </td>
                      <td className='py-4 px-6 text-right'>
                        <span className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isIncome ? '+' : '-'} ₹{parseFloat(tx.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal & Overlay */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity' onClick={() => setIsOpen(false)}></div>

          <div className='relative bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all overflow-hidden'>
            <div className='bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center'>
              <h2 className='text-lg font-bold text-slate-900'>Add Transaction</h2>
              <button onClick={() => setIsOpen(false)} className='text-slate-400 hover:text-slate-600 transition-colors'>✕</button>
            </div>

            <form onSubmit={handleAddTransaction} className='p-6 space-y-5'>
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-slate-700'>Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className='block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                >
                  <option value=''>Select Source Account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} (₹{parseFloat(acc.account_balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className='space-y-1'>
                <label className='block text-sm font-medium text-slate-700'>Description</label>
                <input
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  placeholder='Grocery, Rent, Salary...'
                />
              </div>

              <div className='space-y-1'>
                <label className='block text-sm font-medium text-slate-700'>Amount (₹)</label>
                <input
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className='block w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  placeholder='0.00'
                />
              </div>

              <div className='pt-2 flex gap-3'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  disabled={addingTransaction}
                  className='flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2'
                  disabled={addingTransaction}
                >
                  {addingTransaction ? <FaSpinner className='animate-spin' /> : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
};

export default Transactions;
