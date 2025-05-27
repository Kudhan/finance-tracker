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

const RootLayout = () => {
  const { user } = useStore((state) => state);

 setAuthToken(user?.token || "");
 return !user ? (
  <Navigate to="/signin" replace={true}/>
 ):(
  <>
  <div className="min-h-[calc(100vh-100px)]">
    <Outlet />
  </div>
  </>
 )
};

function App() {
  return (
    <main>
      <div className='w-full min-h-screen bg-gray-100 md:px-20 dark:bg-slate-900'>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>

          {/* Public routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Toaster position='top-center' />
    </main>
  );
}

export default App;
