import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Signin from './pages/auth/signin';
import Signup from './pages/auth/signup';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import AccountPage from './pages/accountPage';
import Transactions from './pages/transactions';
import useStore from './store';
import { setAuthToken } from './libs/apiCall';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';

const RootLayout = () => {
  const { user } = useStore((state) => state);

  setAuthToken(user?.token || "");

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Navbar />

      {/* Full width, NO padding, NO margin, NO gap */}
      <div className="w-full min-h-[calc(100vh-80px)] bg-gray-100">
        {/* Controlled inner padding for content */}
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-gray-100">
      {/* No padding here – prevents gaps */}
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/overview" />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/accounts" element={<AccountPage />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>

        {/* Public routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Toaster position="top-center" />
    </main>
  );
}

export default App;
