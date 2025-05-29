import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../libs/apiCall';

const TransferMoney = ({ isOpen, setIsOpen, selectedAccount, accounts = [], refetch }) => {
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [loading, setLoading] = useState(false); // Declare loading state

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setToAccount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTransfer = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!amount || !toAccount) {
      toast.error('Please enter amount and select destination account.');
      return;
    }

    if (Number(amount) <= 0) {
      toast.error('Amount must be greater than zero.');
      return;
    }

    if (selectedAccount.id === Number(toAccount)) {
      toast.error('Cannot transfer to the same account.');
      return;
    }

    setLoading(true); // Set loading to true when starting the transfer

    try {
      // Sending the correct data format (numeric from_account, to_account, and amount)
      const result = await api.put('/transaction/transfer-money', {
        from_account: selectedAccount.id,  // Ensure it's numeric
        to_account: Number(toAccount),      // Ensure toAccount is treated as a number
        amount: Number(amount),             // Ensure amount is numeric
      });

      console.log('Transfer result:', result);
      toast.success('Transfer successful!');
      refetch(); // Refetch accounts after successful transfer
      setIsOpen(false); // Close the modal after transfer
    } catch (error) {
      console.error('Transfer error:', error);

      // Check if the error has a response message
      const errorMessage =
        error?.response?.data?.message || 'Transfer failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false after the transfer completes
      
    }
  };

  return (
    <div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg z-50"
      // Note: No backdrop / dark overlay
    >
      <h2 className="text-xl font-semibold mb-4">Transfer Money</h2>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
          <input
            type="text"
            disabled
            value={selectedAccount?.account_name || ''}
            className="w-full rounded border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700 mb-1">
            To Account
          </label>
          <select
            id="toAccount"
            className="w-full rounded border border-gray-300 p-2"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Account
            </option>
            {accounts
              .filter((acc) => acc.id !== selectedAccount?.id) // exclude from account itself
              .map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name} ({acc.account_number})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded ${loading ? 'bg-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Processing...' : 'Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferMoney;
