import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import App from "../pages/AdminPage/AdminPage"
import UserPage from "../pages/UserPage/UserDashboard"
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ManageUsers from "../pages/AdminPage/ManageUsers"
import PlayStories from "../pages/PlayStories/PlayStoriesPage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminRoutes><App/></AdminRoutes>}/>
  
        <Route path="/user/dashboard" element={<UserRoutes><UserPage /></UserRoutes>} />
        <Route path="/play" element={<PlayStories />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
