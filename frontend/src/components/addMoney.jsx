import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DialogWrapper from './wrappers/dialog-wrapper';
import api from '../libs/apiCall';
import toast from 'react-hot-toast';

const AddMoney = ({ isOpen, setIsOpen, refetch, selectedAccount }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data) => {
    if (data.amount <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      // PUT request to backend to add money to the account
      const response = await api.put(`/account/addmoney/${selectedAccount.id}`, {
        amount: Number(data.amount),
      });

      if (response.status === 200) {
        toast.success("Money added successfully!");
        reset();
        setIsOpen(false);

        if (typeof refetch === 'function') {
          refetch(); // Refetch accounts to get updated balance
        }
      } else {
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <DialogWrapper isOpen={isOpen} setIsOpen={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Add Money to Account</h2>

        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          {...register('amount')}
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded border border-gray-300 p-2"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {loading ? 'Adding...' : 'Add Money'}
          </button>
        </div>
      </form>
    </DialogWrapper>
  );
};

export default AddMoney;
