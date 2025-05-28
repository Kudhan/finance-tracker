import React, { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { FaBtc, FaPaypal } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { RiVisaLine } from 'react-icons/ri';
import { MdAdd, MdVerifiedUser } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../libs/apiCall';
import Loading from '../components/loading';
import Title from '../components/title';
import AccountMenu from '../components/accountDialog';
import AddAccount from '../components/accountDialog/addAccount';
// import AddMoney from '../components/accountDialog/addMoney';
// import TransferMoney from '../components/accountDialog/transferMoney';

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
      <FaPaypal size={26} />
    </div>
  ),
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const AccountPage = () => {
  const { user } = useStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: res } = await api.get('/account');
      setData(res?.data);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.status === 'auth_failed') {
        localStorage.removeItem('user');
        window.location.reload();
      } else {
        toast.error('Failed to fetch accounts.');
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

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="w-full py-10">
        <div className="flex items-center justify-between px-6">
          <Title title="Accounts Information" />
          <button
            onClick={() => setIsOpen(true)}
            className="py-2 px-4 rounded bg-black text-white flex items-center gap-2"
          >
            <MdAdd size={22} />
            <span>Add</span>
          </button>
        </div>

        {data?.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10 text-gray-600">
            <span>No Account Found</span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6 px-6">
            {data.map((acc, index) => (
              <div
                key={index}
                className="w-full h-48 flex flex-col justify-between bg-gray-50 p-4 rounded shadow"
              >
                <div className="flex items-center gap-4">
                  {ICONS[acc?.account_name?.toLowerCase()]}
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-black text-xl font-bold">
                        {acc?.account_name}
                      </p>
                      <MdVerifiedUser className="text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-600">{acc?.account_number}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(acc?.createdat).toLocaleDateString('en-US', {
                        dateStyle: 'full',
                      })}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <AccountMenu
                      addMoney={() => handleOpenAddMoney(acc)}
                      transferMoney={() => handleTransferMoney(acc)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <p className="text-xl text-gray-600 font-medium">
                    {formatCurrency(acc?.account_balance)}
                  </p>
                  <button
                    onClick={() => handleOpenAddMoney(acc)}
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Add Money
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchAccounts}
        key={new Date().getTime()}
      />

      {/* <AddMoney
        isOpen={isOpenTopup}
        setIsOpen={setIsOpenTopup}
        id={selectedAccount}
        refetch={fetchAccounts}
        key={new Date().getTime() + 1}
      />
      <TransferMoney
        isOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        id={selectedAccount}
        refetch={fetchAccounts}
        key={new Date().getTime() + 2}
      /> */}
    </>
  );
};

export default AccountPage;
