import React,{useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Swal from 'sweetalert2';

function UserPage() {
  const navigate = useNavigate(); 
  const {user,logout} = useContext(UserContext); 
  const token = localStorage.getItem("token"); 
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
  return (
  <>
    <div>User Dashboard</div>
    <button onClick = {handleLogout}> Log Out</button>
  </>
  );
}

export default UserPage;
