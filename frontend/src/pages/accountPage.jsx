import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { FaBtc } from 'react-icons/fa';
import { RiVisaLine } from 'react-icons/ri';
import { GiCash } from 'react-icons/gi';
import { SiPaypal } from 'react-icons/si';
import api from "../libs/apiCall";
import Loading from '../components/loading';
import Title from '../components/title';
import { MdAdd, MdVerifiedUser } from 'react-icons/md';
import toast from 'react-hot-toast';
import AccountMenu from '../components/accountDialog';
import AddAccount from '../components/addAccount';
import AddMoney from '../components/addMoney';
import TransferMoney from '../components/transferMoney';

const ICONS = {
  crypto: <FaBtc size={30} />,
  visa: <RiVisaLine size={30} />,
  cash: <GiCash size={30} />,
  paypal: <SiPaypal size={30} />,
};

const formatCurrency = (amount) => {
  return `₹${parseFloat(amount || 0).toFixed(2)}`;
};

const AccountPage = () => {
  const { user } = useStore((state) => state);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // hold full account object
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: res } = await api.get('/account/');
      console.log("Fetched Accounts:", res?.accounts);
      setData(res?.accounts || []);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.status === 'auth_failed') {
        localStorage.removeItem('user');
        window.location.reload();
      } else {
        toast.error('Something went wrong fetching accounts');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddMoney = (acc) => {
    setSelectedAccount(acc);  // pass full account object
    setIsOpenTopup(true);
  };

  const handleTransferMoney = (acc) => {
    setSelectedAccount(acc);  // pass full account object
    setIsOpenTransfer(true);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Accounts</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your bank accounts and cards.</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <MdAdd size={20} />
            <span className="font-medium">Add Account</span>
          </button>
        </div>

        {data.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <MdAdd size={32} />
            </div>
            <p className="text-slate-600 font-medium">No accounts found</p>
            <p className="text-slate-400 text-sm mt-1">Add your first account to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.map((acc, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {ICONS[acc?.account_name?.toLowerCase()] || (
                      <div className="font-bold text-xl">{acc?.account_name?.charAt(0)}</div>
                    )}
                  </div>
                  <AccountMenu
                    addMoney={() => handleOpenAddMoney(acc)}
                    transferMoney={() => handleTransferMoney(acc)}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    {acc?.account_name}
                    {/* Optional: Add badge if primary or verified */}
                  </h3>
                  <p className="text-slate-400 text-sm font-mono tracking-wider mb-6">
                    **** **** **** {acc?.account_number?.slice(-4) || '0000'}
                  </p>

                  <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Balance</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(acc?.account_balance)}</p>
                    </div>
                    <button
                      onClick={() => handleOpenAddMoney(acc)}
                      className="text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Top Up
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      <AddAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchAccounts}
      />

      <AddMoney
        isOpen={isOpenTopup}
        setIsOpen={setIsOpenTopup}
        refetch={fetchAccounts}
        selectedAccount={selectedAccount}  // pass full account object
      />

      <TransferMoney
        isOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        refetch={fetchAccounts}
        selectedAccount={selectedAccount}  // pass full account object
        accounts={data}  // passing all accounts for transfer
      />
    </>
  );
};

export default AccountPage;
