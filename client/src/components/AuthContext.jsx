import React from "react";

export const AuthContext = React.createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [roomId, setRoomId] = React.useState(null);
  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged, roomId, setRoomId }}>
      {children}
    </AuthContext.Provider>
  );
};
