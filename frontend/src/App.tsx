import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { ProductProvider } from './context/ProductContext';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const ProtectedLayout = () => (
  <ProductProvider>
    <div className="app-shell">
      <Navbar />
      <main className="workspace">
        <Outlet />
      </main>
    </div>
  </ProductProvider>
);

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
