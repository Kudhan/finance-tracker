import React, { useState, useEffect, Fragment } from 'react';
import useStore from '../store';
import { useForm } from 'react-hook-form';
import { Combobox, Transition } from '@headlessui/react';
import { BsChevronExpand } from 'react-icons/bs';
import api from '../libs/apiCall';
import toast from 'react-hot-toast';

const SettingForm = () => {
  const { user, setCredentials } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstname: user?.firstname || '',
      email: user?.email || '',
    },
  });

  const [selectedCountry, setSelectedCountry] = useState({
    country: user?.country || '',
    currency: user?.currency || '',
  });
  const [query, setQuery] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Password form state
  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: pwdErrors },
    reset: resetPwd,
  } = useForm();

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://restcountries.com/v3.1/all');
        const json = await res.json();
        const data = json.map((c) => ({
          country: c.name.common,
          currency: c.currencies ? Object.keys(c.currencies)[0] : 'N/A',
        }));
        setCountriesData(data.sort((a, b) => a.country.localeCompare(b.country)));
      } catch (err) {
        toast.error('Failed to load countries');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const filteredCountries =
    query === ''
      ? countriesData
      : countriesData.filter((c) =>
          c.country.toLowerCase().includes(query.toLowerCase())
        );

  // Profile update submit
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const updateData = {
        firstname: values.firstname,
        lastname: values.lastname || '',
        email: values.email,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      const { data: res } = await api.put(`/user/${user.id}`, updateData);

      if (res.status === 'success') {
        toast.success(res.message || 'Profile updated successfully');
        setCredentials({ ...user, ...updateData });
        reset(updateData);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Change password submit
  const onChangePassword = async (values) => {
    try {
      setLoading(true);
      const { data: res } = await api.post(`/user/change-password`, values);
      if (res.status === 'success') {
        toast.success(res.message);
        resetPwd();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 my-10">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Settings</h1>

      {/* Profile Settings Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstname"
              {...register('firstname', { required: 'First name is required' })}
              className={`block w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                errors.firstname ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your first name"
              disabled={loading}
            />
            {errors.firstname && (
              <p className="mt-1 text-red-600 text-sm">{errors.firstname.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastname"
              {...register('lastname')}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
              placeholder="Your last name (optional)"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`block w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <Combobox value={selectedCountry} onChange={setSelectedCountry} nullable>
              <div className="relative">
                <div
                  className={`relative w-full cursor-default overflow-hidden rounded-md border shadow-sm ${
                    loading ? 'border-gray-300 bg-gray-100' : 'border-gray-300 bg-white'
                  }`}
                >
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-gray-900 focus:ring-0 focus:outline-none"
                    displayValue={(country) => country?.country || ''}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Select your country"
                    disabled={loading}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <BsChevronExpand className="h-5 w-5" />
                  </Combobox.Button>
                </div>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg z-50 border border-gray-300">
                    {filteredCountries.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                        No results found.
                      </div>
                    ) : (
                      filteredCountries.map((country, idx) => (
                        <Combobox.Option
                          key={idx}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-violet-600 text-white' : 'text-gray-900'
                            }`
                          }
                          value={country}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-semibold' : 'font-normal'
                                }`}
                              >
                                {country.country} ({country.currency})
                              </span>
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-violet-600 py-3 text-white font-semibold hover:bg-violet-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      {/* Divider */}
      <hr className="my-10 border-gray-300" />

      {/* Change Password Form */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Change Password</h2>
        <form onSubmit={handleSubmitPwd(onChangePassword)} className="space-y-6 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              {...registerPwd('currentPassword', { required: 'Current password is required' })}
              className={`block w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                pwdErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter current password"
              disabled={loading}
              autoComplete="current-password"
            />
            {pwdErrors.currentPassword && (
              <p className="mt-1 text-red-600 text-sm">{pwdErrors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              {...registerPwd('newPassword', { required: 'New password is required' })}
              className={`block w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                pwdErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
              disabled={loading}
              autoComplete="new-password"
            />
            {pwdErrors.newPassword && (
              <p className="mt-1 text-red-600 text-sm">{pwdErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...registerPwd('confirmPassword', {
                required: 'Confirm password is required',
              })}
              className={`block w-full rounded-md border px-4 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                pwdErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
              disabled={loading}
              autoComplete="new-password"
            />
            {pwdErrors.confirmPassword && (
              <p className="mt-1 text-red-600 text-sm">{pwdErrors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-violet-600 py-3 text-white font-semibold hover:bg-violet-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingForm;
