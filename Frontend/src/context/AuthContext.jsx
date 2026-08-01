import {  useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser } from "../services/authService";


function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user);

  useEffect(() => {
    async function restoreUser() {
      try {
        const response = await getCurrentUser();

        setUser(response.data);
      } catch {
        // User is not logged in. Leave user as null.
        setUser(null);
      } finally {
        setLoading(false);
      }
      // const response = await getCurrentUser();
      // setUser(response.user);
    }
    restoreUser();
  },[]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
