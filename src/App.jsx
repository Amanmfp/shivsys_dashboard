
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import SignUp from './pages/SignUp'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Transactions from './pages/Transactions'
import Messages from './pages/Messages'
import MainContainner from './pages/MainContainner'
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="SignUp" element={<SignUp />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<MainContainner />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="Messages" element={<Messages />} />
                </Route>
            </Routes>
        </Router>
    )
}
export default App
