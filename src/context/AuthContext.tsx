import React, { useState, createContext, ReactNode } from "react";

interface User {
  email: string;
  rol: string;
}

interface AuthContextData {
  user: User;
  isLogged: boolean;
  handleLogin: (userLogged: User) => void;
  logoutContext: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthContextComponentProps {
  children: ReactNode;
}

const AuthContextComponent: React.FC<AuthContextComponentProps> = ({ children }) => {
  const defaultUser: User = { email: "", rol: "" };

  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem("userInfo") || JSON.stringify(defaultUser))
  );

  const [isLogged, setIsLogged] = useState<boolean>(
    JSON.parse(localStorage.getItem("isLogged") || "false")
  );

  const handleLogin = (userLogged: User) => {
    setUser(userLogged);
    setIsLogged(true);
    localStorage.setItem("userInfo", JSON.stringify(userLogged));
    localStorage.setItem("isLogged", JSON.stringify(true));
  };

  const logoutContext = () => {
    setUser(defaultUser);
    setIsLogged(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isLogged");
  };

  const data: AuthContextData = {
    user,
    isLogged,
    handleLogin,
    logoutContext,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthContextComponent;
