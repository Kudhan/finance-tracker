import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import DialogWrapper from './wrappers/dialog-wrapper';
import api from '../libs/apiCall';
import toast from 'react-hot-toast';

const accounts = ["cash", "crypto", "visa", "paypal"];

const AddAccount = ({ isOpen, setIsOpen, refetch, existingAccounts = [] }) => {
  const generateAccountNumber = () => {
    let account_number = "";
    while (account_number.length < 13) {
      const uuid = uuidv4().replace(/-/g, "");
      account_number += uuid.replace(/\D/g, "");
    }
    return account_number.slice(0, 13);
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      account_name: "cash",
      account_number: generateAccountNumber(),
      amount: 0
    }
  });

  const onSubmit = async (data) => {
    if (existingAccounts.some(acc => acc.name === data.account_name)) {
      toast.error(`Account of type "${data.account_name}" already exists.`);
      setIsOpen(false);
      return;
    }

    try {
      await api.post('/account/create', {
        name: data.account_name,
        account_number: data.account_number,
        amount: Number(data.amount),
      });

      toast.success("Account added successfully!");
      reset();
      setIsOpen(false);
      if (typeof refetch === "function") {
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add account. Please try again.");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <DialogWrapper isOpen={isOpen} setIsOpen={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Add New Account</h2>

        <label className="block text-sm font-medium text-gray-700">Account Name</label>
        <select {...register("account_name")} className="w-full rounded border border-gray-300 p-2">
          {accounts.map(name => (
            <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700">Account Number</label>
        <input
          {...register("account_number")}
          type="text"
          readOnly
          className="w-full rounded border border-gray-300 p-2"
        />

        <label className="block text-sm font-medium text-gray-700">Initial Amount</label>
        <input
          {...register("amount")}
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded border border-gray-300 p-2"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={handleClose} className="rounded bg-gray-300 px-4 py-2">Cancel</button>
          <button type="submit" className="rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">Add Account</button>
        </div>
      </form>
    </DialogWrapper>
  );
};

export default AddAccount;
