import React from 'react';
import useStore from '../store';  // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const signOut = useStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/signin');  // Redirect to sign-in page after logout
  };

  return (
    <div>
      <h1>Dashboard page</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
