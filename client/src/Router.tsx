import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { ProductsList } from "./pages/ProductsList";
import { Settings } from "./pages/Settings";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { CouponsList } from "./pages/admin/Coupons/CouponsList";
import { EmployeesList } from "./pages/admin/Employees/EmployeesList";
import { EmployeesForm } from "./pages/admin/Employees/EmployeesForm";
import { OrdersList } from "./pages/admin/Orders/OrdersList";
import { ProductsForm } from "./pages/admin/Products/ProductsForm";
import { ProductsList as AdminProductsList } from "./pages/admin/Products/ProductsList";
import { UsersList } from "./pages/admin/Users/UsersList";
import { UsersForm } from "./pages/admin/Users/UsersForm";
import { Chef } from "./pages/employees/Chef";
import { Delivery } from "./pages/employees/Delivery";
import { Recepcionist } from "./pages/employees/Recepcionist";
import { UserContext } from "./contexts/User/UserContext";
import { User } from "./interfaces/User";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { AnimatePresence } from "framer-motion";
import { SectionsList } from "./pages/admin/Sections/SectionsList";
import { Orders } from "./pages/employees/Orders";
import { Orders as OrdersUsers } from "./pages/Orders";
import { RedirectMiddleware } from "./middleware";
import { SettingsEmployees } from "./pages/employees/SettingsEmployees";

export const Router = () => {
  const { user, logued } = useContext(UserContext) as {
    user: User;
    logued: boolean;
  };
  return (
    <BrowserRouter>
      <AnimatePresence>
        <RedirectMiddleware>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/products" element={<ProductsList />} />
            <Route
              path="/settings"
              element={logued ? <Settings /> : <Navigate to={`/`} />}
            />
            <Route
              path="/orders"
              element={logued ? <OrdersUsers /> : <Navigate to={`/`} />}
            />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/login"
              element={logued ? <Navigate to={`/`} /> : <Login />}
            />
            <Route
              path="/login/:register"
              element={logued ? <Navigate to={`/`} /> : <Login />}
            />
            <Route
              path="/admin"
              element={!logued || !user.admin ? <Navigate to={`/`} /> : null}
            >
              <Route index element={<AdminPanel />} />
              <Route path="coupons" element={<CouponsList />} />
              <Route path="employees" element={<EmployeesList />} />
              <Route path="employees/new" element={<EmployeesForm />} />
              <Route path="employees/:id" element={<EmployeesForm />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="products" element={<AdminProductsList />} />
              <Route path="products/new" element={<ProductsForm />} />
              <Route path="products/:id" element={<ProductsForm />} />
              <Route path="sections" element={<SectionsList />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/new" element={<UsersForm />} />
              <Route path="users/:id" element={<UsersForm />} />
              <Route path="*" element={<Navigate to={`/admin`} />} />
            </Route>
            <Route
              path="/employee"
              element={
                !logued || (!user.admin && !user.position) ? (
                  <Navigate to={`/`} />
                ) : null
              }
            >
              <Route path="chef" element={<Chef />} />
              <Route path="delivery" element={<Delivery />} />
              <Route path="recepcionist" element={<Recepcionist />} />
              <Route path="recepcionist/orders" element={<Orders />} />
              <Route path="settings" element={<SettingsEmployees />} />
            </Route>
            <Route path="*" element={<Navigate to={`/`} />} />
          </Routes>
        </RedirectMiddleware>
      </AnimatePresence>
    </BrowserRouter>
  );
};
