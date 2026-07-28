import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user);

  useEffect(() => {
    async function restoreUser() {
      try {
        const response = await getCurrentUser();

        setUser(response.user);
      } catch (error) {
        // User is not logged in. Leave user as null.
      }finally {
    setLoading(false);
  }


const response = await getCurrentUser();



setUser(response.user);
    }
    
    restoreUser(); 
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
