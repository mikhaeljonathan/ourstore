import React from 'react'
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App';
import Dashboard from './pages/dashboard/Dashboard';
import LandingPage from './pages/landingPage/LandingPage';
import Login from './pages/login/Login';
import ManagePage from './pages/managepage/ManagePage';
import Products from './pages/Products/Products';
import SuccessBuy from './pages/success-buy/SuccessBuy';
import Theme from './pages/theme/Theme';
import SignUp from './pages/signup/SignUp';
import Otp from './pages/otp/Otp';
import Forgot from './pages/forgot/Forgot';
import Reset from './pages/reset/Reset';
import CustomPage from './components/CustomPage';
import EditProfile from './components/EditProfile';
import { Provider } from 'react-redux';
import { store } from "./redux/store";

import ViewProduct from './pages/ViewProduct/ViewProduct';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/landingpage",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/forgot",
    element: <Forgot />
  },
  {
    path: "/reset/:token",
    element: <Reset />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/otp",
    element: <Otp />
  },
  {
    path: "/success-buy",
    element: <SuccessBuy />
  },
  {
    path: "/managepage",
    element: <ManagePage />
  },
  {
    path: "/products",
    element: <Products />
  },
  {
    path: "/theme",
    element: <Theme />
  },
  {
    path: "/viewproduct/:id",
    element: <ViewProduct />
  },
  {
    path: `/pages/:id`,
    element: <CustomPage />
  },
  {
    path: "/editprofile",
    element: <EditProfile />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);