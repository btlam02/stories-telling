import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AdminPage from "../pages/AdminPage/AdminDashboard"
import UserPage from "../pages/UserPage/UserDashboard"
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";



const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminRoutes><AdminPage/></AdminRoutes>}/>
        <Route path="/user/dashboard" element={<UserRoutes><UserPage /></UserRoutes>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
