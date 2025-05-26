import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Signin from './pages/auth/signin'
import Signup from './pages/auth/signup'
import Dashboard from './pages/dashboard'
import Settings from './pages/settings'
import AccountPage from './pages/accountPage'
import Transactions from './pages/transactions'
import useStore from './store'

const RootLayout = () => {
  const {user} = useStore((state) => state);
  console.log("RootLayout user:", user);
  

  return !user ? (
    <Navigate to="/signin" />
  ) : (
    <div>
      <Outlet />
    </div>
  )
}

function App() {

  
  return (
    <main>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/overview" />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </main>
  )
}

export default App
