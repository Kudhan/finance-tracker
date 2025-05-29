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

const ICONS = {
  crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),
  visa: (
    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),
  cash: (
    <div className="w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full">
      <GiCash size={26} />
    </div>
  ),
  paypal: (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <SiPaypal size={26} />
    </div>
  ),
};

const formatCurrency = (amount) => {
  return `$${parseFloat(amount || 0).toFixed(2)}`;
};

const AccountPage = () => {
  const { user } = useStore((state) => state);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
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
    setSelectedAccount(acc?.id);
    setIsOpenTopup(true);
  };

  const handleTransferMoney = (acc) => {
    setSelectedAccount(acc?.id);
    setIsOpenTransfer(true);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const existingAccounts = data.map(acc => ({
    name: acc.account_name?.toLowerCase(),
  }));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full py-10">
        <div className="flex items-center justify-between px-6 mb-6">
          <Title title="Accounts Information" />
          <button
            onClick={() => setIsOpen(true)}
            className="py-2 px-4 rounded bg-black text-white flex items-center gap-2"
          >
            <MdAdd size={22} />
            <span>Add</span>
          </button>
        </div>

        {data.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10 text-gray-600">
            <span>No Account Found</span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6 px-6">
            {data.map((acc, index) => (
              <div key={index} className="w-full h-48 flex gap-4 bg-gray-50 p-3 rounded shadow">
                <div>
                  {ICONS[acc?.account_name?.toLowerCase()] || (
                    <div className="w-12 h-12 bg-gray-500 text-white flex items-center justify-center rounded-full">
                      ?
                    </div>
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-black text-2xl font-bold">{acc?.account_name}</p>
                      <MdVerifiedUser size={26} className="text-emerald-600 ml-1" />
                    </div>
                    <AccountMenu 
                      addMoney={() => handleOpenAddMoney(acc)}
                      transferMoney={() => handleTransferMoney(acc)} />
                  </div>
                  <span className="text-gray-600 font-light leading-loose">{acc?.account_number}</span>
                  <p className="text-xs text-gray-600">
                    {new Date(acc?.createdat).toLocaleDateString('en-US', { dateStyle: 'full' })}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl text-gray-600 font-medium">{formatCurrency(acc?.account_balance)}</p>
                    <button
                      onClick={() => handleOpenAddMoney(acc)}
                      className="text-sm outline-none text-violet-600 hover:underline"
                    >
                      Add Money
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
        existingAccounts={existingAccounts}
      />

      {/* TODO: AddMoney and TransferMoney modals when ready */}
    </>
  );
};

export default AccountPage;
