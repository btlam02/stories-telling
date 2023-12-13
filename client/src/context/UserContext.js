import React from "react";

const UserContext = React.createContext({ email: "",role: "", auth: false });

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({ email: "",role:"",auth: false });

  const loginContext = (email,token,role) => {
    setUser((user) => ({
      email: email,
      role: role,
      auth: true,
    }));
    localStorage.setItem("token",token);
    localStorage.setItem("role",role);
    localStorage.setItem("email",email); 
  };

  const logout = () => {
    localStorage.removeItem("token")
    setUser((user) => ({
      email: "",
      role: "",
      auth: false,
    }));
  };
  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
