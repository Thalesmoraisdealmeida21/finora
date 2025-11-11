import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Dashboard from './pages/dashboard'
import Account from './pages/account'
import { Toaster } from "@/components/ui/sonner";
import BalanceLog from "./pages/balanceLog";
import Login from "./pages/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              localStorage.getItem('token') ? <Navigate to="/" replace /> : <Login />
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/accounts" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/balance-log/:id" 
            element={
              <ProtectedRoute>
                <BalanceLog />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
      
    </>
  )
}

export default App
