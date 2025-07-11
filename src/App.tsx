import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "./redux/slice/userSlice";
import { fetchOrganization } from "./redux/slice/organizationSlice";
import { RootState, AppDispatch } from "./redux/store/store";

import ActivateAccount from "./components/ActivateAccount/ActivateAccount";
import ChangePassword from "./components/Change-Password/ChangePassword";
import Header from "./components/Header/Header";
import Chats from "./components/Chats/Chats";
import Organization from "./components/Organization/Organization";
import Agents from "./components/AI-Settings/Agents/Agents";
import Configuration from "./components/AI-Settings/Configuration/Configuration";
import ForgotPassword from "./pages/Forgot-Password/ForgotPassword";
import PasswordResetConfirmation from "./pages/Forgot-Password/PasswordResetConfirmation";
import ResetPassword from "./pages/Forgot-Password/ResetPassword";
import Register from "./pages/Register/Register";
import VerifyOtp from "./pages/Verify-OTP/VerifyOtp";
import { DashboardContainer, MainContainer, ContentArea } from "./styles/layout.styled";
import Login from "./pages/Login/Login";
import Sidebar from "./components/SideBar";
import Home from "./pages/Home/Home";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";
import Tasks from "./components/Tasks/Tasks";
import Settings from "./components/Settings/Settings";

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/confirmation",
  "/change-password",
  "/activate-account",
];

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("access_token");
  return token ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!publicRoutes.includes(location.pathname)) {
      if (!token) {
        navigate("/login");
      } else {
        dispatch(getUserDetails(token))
          .unwrap()
          .catch((error) => {
            console.error("Failed to fetch user details:", error);
            navigate("/login");
          });
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.orgId) {
      dispatch(fetchOrganization(user.orgId));
    }
  }, [user?.orgId, dispatch]);

  return (
    <SocketProvider>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/confirmation" element={<PasswordResetConfirmation />} />
        <Route path="/activate-account" element={<ActivateAccount />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <DashboardContainer>
                <Header />
                <MainContainer>
                  <Sidebar />
                  <ContentArea>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/chats" element={<Chats />} />
                      <Route path="/organization" element={<Organization />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/configuration" element={<Configuration />} />
                      <Route path="/agents" element={<Agents />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </ContentArea>
                </MainContainer>
              </DashboardContainer>
            </AuthGuard>
          }
        />
        {/* Separate Route for Change Password (Inside AuthGuard) */}
        <Route
          path="/change-password"
          element={
            <AuthGuard>
              <ChangePassword />
            </AuthGuard>
          }
        />
      </Routes>
    </SocketProvider>
  );
}

export default AppRoutes;