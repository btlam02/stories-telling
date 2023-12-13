import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllUsers, deactivateUser } from "./AdminAPI";
import { Table } from "react-bootstrap";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const table = useContext(Table);

  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 
  const handleDeactiveUser =(userId)=>{
    deactivateUser(userId); 
    navigate("/admin/manage-user");
  }
  
  const LoadListUser = () => {
    getAllUsers(token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });
  };

  const showUsersLength = () => {
    if (users.length > 0) {
      return <h3>Total Users: {users.length}</h3>;
    } else {
      return <h3>Not found any users</h3>;
    }
  };


  useEffect(() => {
    LoadListUser();
  }, []);

  return (
    <>
     <h1> Manage Users </h1>
     <table striped bordered hover>
        <thead>
          <tr>
            <th>ID Numbers</th>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && 
            users.map((user) =>(
            <tr key={user._id}>
            <td> {user._id} </td>
            <td> {user.email} </td>
            <td>{user.active ? "Active" : "Deactive"}</td>
            <td> {user.date} </td>
            <button onClick={handleDeactiveUser(user._id)}>Deactive</button> 
            </tr> 
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ManageUsers;

  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly />
    </div>
  );