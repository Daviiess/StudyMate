import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an auth provider");
}
    return context;
}

export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    },[])

    const checkAuthStatus = () => {
     try { 
         
         const token = localStorage.getItem("token");
         const userStr = localStorage.getItem('user');

        const isValidToken = token && token !== "undefined";
        const isValidUser = userStr && userStr !== "undefined";

         if(isValidToken && isValidUser){
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            }else{
                setUser(null);
                setIsAuthenticated(false);
            }
        
    }catch(error){
        console.error("Auth check failed:" , error);
        setUser(null);
        console.error("Auth check failed:", error);
    // Just clear the local states, don't force a redirect here
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    }finally{
        setLoading(false);
    }
    };

     const login = (userData , token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user' , JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
    }
    const logout = () => {
       localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    }
    const updateUser = (updatedUserData) => {
        const newUserData = {...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    }
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
        checkAuthStatus
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 