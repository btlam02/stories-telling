import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import './css/AdminDashboard.css'; // Add this line to import the CSS


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const name = user.name;
  const email = user.email;
  const role = user.role;
  

  console.log(">> user: ", user);

  const handleLogout = () => {
    logout();
    navigate("/");
    Swal.fire({
      title: "Sign Out Successfully!",
      text: "See you soon!",
      icon: "success",
      confirmButtonText: "Done",
    });
  };

  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/product">
              Create Stories
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/manage-user">
              Manage Users
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/products">
              Manage Stories
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === "admin" ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      title="Dashboard" description={`G'day ${name}!`}
      <div className="row">
        <div >{adminLinks()}</div>
        <div >{adminInfo()}</div>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    </>
  );
};

export default AdminDashboard;
